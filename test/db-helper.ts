import { PrismaClient } from '@prisma/client';

export function cleanDb(prisma: PrismaClient) {
  return prisma.$transaction([
    prisma.boardgame.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}