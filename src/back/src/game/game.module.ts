import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { MatchModule } from 'src/match/match.module';
import { MatchService } from 'src/match/match.service';

@Module({
  imports: [MatchModule],
  providers: [GameGateway, MatchService],
})
export class GameModule {}
