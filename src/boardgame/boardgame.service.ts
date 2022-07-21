import { Injectable } from '@nestjs/common';
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

  editBoardgameById(
    userId: number,
    boardgameId: number,
    dto: EditBoardgameDto,
  ) {}

  deleteBoardgameById(userId: number, boardgameId: number) {}
}
