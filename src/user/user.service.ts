import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';

import { PrismaClient } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaClient) {}

  async editUser(userId: number, dto: EditUserDto) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
  }
}
