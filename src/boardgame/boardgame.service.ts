import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBoardgameDto, EditBoardgameDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BoardgameService {
  constructor(private prisma: PrismaService) {}

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

  async createBoardgame(userId: number, dto: CreateBoardgameDto) {
    const boardgame = await this.prisma.boardgame.create({
      data: {
        userId,
        ...dto,
      },
    });

    return boardgame;
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
