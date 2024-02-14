import { Module } from '@nestjs/common';
import { RelationshipResolver } from './relationship.resolver';
import { RelationshipService } from './relationship.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [RelationshipResolver, RelationshipService, PrismaService]
})
export class RelationshipModule { }
