import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from '../prisma.service';
import { AvatarController } from './avatar.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AvatarController],
  providers: [UserService, UserResolver, PrismaService, AuthService, JwtService]
})
export class UserModule { }