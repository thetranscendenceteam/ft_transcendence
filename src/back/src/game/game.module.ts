import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { MatchModule } from 'src/match/match.module';
import { MatchService } from 'src/match/match.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AuthModule, UserModule, MatchModule],
  providers: [MatchService, UserService, AuthService, GameGateway],
})
export class GameModule {}
