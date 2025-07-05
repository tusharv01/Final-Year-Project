import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const registerPendingUser = async ({ email, password, name, role, location }) => {
  if (!['SUPPLIER', 'RETAILER'].includes(role)) {
    throw new Error('Invalid role');
  }

  // const existing = await prisma.pendingUser.findUnique({ where: { email } });
  // if (existing) {
  //   throw new Error('Email already pending approval');
  // }

  const hashedPassword = await bcrypt.hash(password, 10);
  // const pending = await prisma.pendingUser.create({
  //   data: {
  //     email,
  //     password: hashedPassword,s
  //     name,
  //     role,
  //     location
  //   }
  // });

  // return pending;

   const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
      location
    }
  });

  return newUser;
};


export const approvePendingUser = async (userId) => {
  // Fetch the pending user
  const pendingUser = await prisma.pendingUser.findUnique({ where: { id: userId } });
  if (!pendingUser) {
    throw new Error('Pending user not found');
  }

  // Move user from pendingUser to user table
  const approvedUser = await prisma.user.create({
    data: {
      email: pendingUser.email,
      password: pendingUser.password, // already hashed
      name: pendingUser.name,
      role: pendingUser.role,
      location: pendingUser.location,
    },
  });

  // Delete from pendingUser table
  await prisma.pendingUser.delete({ where: { id: userId } });

  return approvedUser;
};


export const approveAllPendingUsers = async () => {
  // Fetch all pending users
  const pendingUsers = await prisma.pendingUser.findMany();

  if (pendingUsers.length === 0) {
    return { message: 'No pending users to approve' };
  }

  // Transaction to move all pending users to user table and delete from pendingUser
  const result = await prisma.$transaction(async (prisma) => {
    const createdUsers = [];

    for (const pendingUser of pendingUsers) {
      const user = await prisma.user.create({
        data: {
          email: pendingUser.email,
          password: pendingUser.password,
          name: pendingUser.name,
          role: pendingUser.role,
          location: pendingUser.location,
        },
      });

      await prisma.pendingUser.delete({ where: { id: pendingUser.id } });

      createdUsers.push(user);
    }

    return createdUsers;
  });

  return result;
};


export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // Create JWT payload
  const payload = {
    userId: user.id,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  return { token, user };
};