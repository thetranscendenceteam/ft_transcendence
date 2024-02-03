import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { PrismaService } from '../prisma.service';
import { UsersInChatsModule } from 'src/users-in-chats/users-in-chats.module';

@Module({
  providers: [ChatService, ChatResolver, PrismaService]
})
export class ChatModule { }
