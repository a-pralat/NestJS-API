import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BoardgameService } from './boardgame.service';
import { GetUser } from '../auth/decorator';
import { CreateBoardgameDto, EditBoardgameDto } from './dto';

@UseGuards(JwtGuard)
@Controller('boardgames')
export class BoardgameController {
  constructor(private boardgameService: BoardgameService) {}
  @Get()
  getBoardgames(@GetUser('id') userId: number) {
    return this.boardgameService.getBoardgames(userId);
  }

  @Get(':id')
  getBoardgameById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) boardgameId: number,
  ) {
    return this.boardgameService.getBoardgameById(userId, boardgameId);
  }

  @Post()
  createBoardgame(
    @GetUser('id') userId: number,
    @Body() dto: CreateBoardgameDto,
  ) {
    return this.boardgameService.createBoardgame(userId, dto);
  }

  @Patch(':id')
  editBoardgameById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) boardgameId: number,
    @Body() dto: EditBoardgameDto,
  ) {
    return this.boardgameService.editBoardgameById(userId, boardgameId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBoardgameById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) boardgameId: number,
  ) {
    return this.boardgameService.deleteBoardgameById(userId, boardgameId);
  }
}
