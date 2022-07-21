import { Module } from '@nestjs/common';
import { BoardgameController } from './boardgame.controller';
import { BoardgameService } from './boardgame.service';

@Module({
  controllers: [BoardgameController],
  providers: [BoardgameService]
})
export class BoardgameModule {}
