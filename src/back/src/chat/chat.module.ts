import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [ChatService, ChatResolver, PrismaService]
})
export class ChatModule { }
