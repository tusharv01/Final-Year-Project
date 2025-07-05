import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const addProduct = async (data, supplierId) => {
  return await prisma.inventoryItem.create({
    data: {
      ...data,
      supplierId,
    },
  });
};

export const getAllProducts = async () => {
  return await prisma.inventoryItem.findMany();
};

export const getProductById = async (id) => {
  return await prisma.inventoryItem.findUnique({ where: { id } });
};

export const getProductsBySupplier = async (supplierId) => {
  return await prisma.inventoryItem.findMany({ where: { supplierId } });
};

export const updateProduct = async (id, supplierId, updates) => {
  const item = await prisma.inventoryItem.findUnique({ where: { id } });
  if (!item || item.supplierId !== supplierId) {
    throw new Error('Unauthorized or product not found');
  }

  return await prisma.inventoryItem.update({
    where: { id },
    data: updates,
  });
};

export const deleteProduct = async (id, supplierId) => {
  const item = await prisma.inventoryItem.findUnique({ where: { id } });
  if (!item || item.supplierId !== supplierId) {
    throw new Error('Unauthorized or product not found');
  }

  return await prisma.inventoryItem.delete({ where: { id } });
};
