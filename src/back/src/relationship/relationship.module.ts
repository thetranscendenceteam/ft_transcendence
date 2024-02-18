import { Module } from '@nestjs/common';
import { RelationshipResolver } from './relationship.resolver';
import { RelationshipService } from './relationship.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [RelationshipResolver, RelationshipService, PrismaService, JwtService, AuthService, UserService]
})
export class RelationshipModule { }
