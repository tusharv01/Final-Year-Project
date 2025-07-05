import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Allowed forward transitions
const transitions = {
  PLACED:     ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED:    ['DELIVERED', 'RETURNED'],
  DELIVERED:  [],
  CANCELLED:  [],
  RETURNED:   []
};

function assertValidStatus(status) {
  if (!Object.keys(transitions).includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
}

async function assertTransitionAllowed(orderId, newStatus) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, select: { status: true }});
  if (!order) throw new Error('Order not found');

  const legalNext = transitions[order.status];
  if (!legalNext.includes(newStatus)) {
    throw new Error(`Illegal transition from ${order.status} → ${newStatus}`);
  }
}

export const updateOrderStatus = async (orderId, newStatus, location, adminId) => {
  assertValidStatus(newStatus);
  await assertTransitionAllowed(orderId, newStatus);

  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    });

    const log = await tx.orderStatusLog.create({
      data: {
        orderId,
        status: newStatus,
        location,
        updatedByAdminId: adminId
      }
    });

    return { order, log };
  });
};

export const getStatusLogs = (orderId) =>
  prisma.orderStatusLog.findMany({
    where: { orderId },
    orderBy: { timestamp: 'asc' }
  });
