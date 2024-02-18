import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ChatService, ChatResolver, PrismaService, AuthService, JwtService, UserService]
})
export class ChatModule { }
