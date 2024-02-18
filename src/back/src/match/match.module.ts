import { Module } from '@nestjs/common';
import { MatchResolver } from './match.resolver';
import { MatchService } from './match.service';
import { PrismaService } from '../prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Module({
  providers: [MatchResolver, MatchService, PrismaService, JwtService, AuthService, UserService],
  exports: [MatchService],
})
export class MatchModule {}
