import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createOrder = async (retailerId, orderData) => {
  const { items } = orderData; // [{ itemId, quantity }]
  if (!items || items.length === 0) throw new Error('No items in order');

  return await prisma.$transaction(async (tx) => {
    // Check stock
    for (const { itemId, quantity } of items) {
      const item = await tx.inventoryItem.findUnique({ where: { id: itemId } });
      if (!item || item.quantityAvailable < quantity) {
        throw new Error(`Insufficient stock for item ${item?.name || itemId}`);
      }
    }

    const order = await tx.order.create({
      data: {
        retailerId,
        status: 'PENDING',
        orderItems: {
          create: items.map(({ itemId, quantity }) => ({
            itemId,
            quantity,
          })),
        },
      },
      include: { orderItems: true },
    });

    // Reduce stock
    for (const { itemId, quantity } of items) {
      await tx.inventoryItem.update({
        where: { id: itemId },
        data: { quantityAvailable: { decrement: quantity } },
      });
    }

    return order;
  });
};

export const getOrdersByRetailer = async (retailerId) => {
  return prisma.order.findMany({
    where: { retailerId },
    include: { orderItems: { include: { item: true } } },
  });
};

export const getOrderById = async (orderId, retailerId) => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: { include: { item: true } } },
  });
};

export const updateOrder = async (orderId, retailerId, newData) => {
  const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
  if (!existingOrder || existingOrder.retailerId !== retailerId) {
    throw new Error('Not authorized or order not found');
  }
  if (existingOrder.status !== 'PENDING') {
    throw new Error('Only PENDING orders can be updated');
  }

  // Optional: logic to handle updating orderItems (advanced)
  return prisma.order.update({
    where: { id: orderId },
    data: newData,
  });
};

export const deleteOrder = async (orderId, retailerId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: true },
  });
  if (!order || order.retailerId !== retailerId) throw new Error('Not authorized or order not found');
  if (order.status !== 'PENDING') throw new Error('Cannot delete shipped orders');

  return await prisma.$transaction(async (tx) => {
    // Restore stock
    for (const item of order.orderItems) {
      await tx.inventoryItem.update({
        where: { id: item.itemId },
        data: { quantityAvailable: { increment: item.quantity } },
      });
    }

    await tx.orderItem.deleteMany({ where: { orderId } });
    await tx.order.delete({ where: { id: orderId } });
  });
};
