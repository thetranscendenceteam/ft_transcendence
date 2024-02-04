import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from '../prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [AuthService, AuthResolver, UserService, PrismaService],
})
export class AuthModule { }
