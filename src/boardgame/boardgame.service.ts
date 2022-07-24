import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBoardgameDto, EditBoardgameDto } from './dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BoardgameService {
  constructor(private prisma: PrismaClient) {}

  getBoardgames(userId: number) {
    return this.prisma.boardgame.findMany({
      where: {
        userId,
      },
    });
  }

  getBoardgameById(userId: number, boardgameId: number) {
    return this.prisma.boardgame.findFirst({
      where: {
        id: boardgameId,
        userId,
      },
    });
  }

  createBoardgame(userId: number, dto: CreateBoardgameDto) {
    return this.prisma.boardgame.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async editBoardgameById(
    userId: number,
    boardgameId: number,
    dto: EditBoardgameDto,
  ) {
    // get boardgame by id
    const boardgame = await this.prisma.boardgame.findUnique({
      where: {
        id: boardgameId,
      },
    });

    // check if user owns this boardgame
    if (!boardgame || boardgame.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.boardgame.update({
      where: {
        id: boardgameId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBoardgameById(userId: number, boardgameId: number) {
    // get boardgame by id
    const boardgame = await this.prisma.boardgame.findUnique({
      where: {
        id: boardgameId,
      },
    });

    // check if user owns this boardgame
    if (!boardgame || boardgame.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.boardgame.delete({
      where: {
        id: boardgameId,
      },
    });
  }
}
