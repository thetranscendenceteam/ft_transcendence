import { Module } from '@nestjs/common';
import { MatchResolver } from './match.resolver';
import { MatchService } from './match.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [MatchResolver, MatchService, PrismaService],
  exports: [MatchService],
})
export class MatchModule {}
