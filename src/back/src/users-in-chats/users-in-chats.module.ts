import { Module } from '@nestjs/common';
import { UsersInChatsResolver } from './users-in-chats.resolver';
import { PrismaService } from '../prisma.service';
import { UsersInChatsService } from './users-in-chats.service';
import { UserModule } from 'src/user/user.module';

@Module({
    providers: [UsersInChatsService, UsersInChatsResolver, PrismaService],
})
export class UsersInChatsModule { }