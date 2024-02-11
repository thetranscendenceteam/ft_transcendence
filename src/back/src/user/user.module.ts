import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from '../prisma.service';
import { AvatarController } from './avatar.controller';

@Module({
  controllers: [AvatarController],
  providers: [UserService, UserResolver, PrismaService]
})
export class UserModule { }