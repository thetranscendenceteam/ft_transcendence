import { Module } from '@nestjs/common';
import { UsersInChatsResolver } from './users-in-chats.resolver';
import { PrismaService } from '../prisma.service';
import { UsersInChatsService } from './users-in-chats.service';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
    providers: [UsersInChatsService, UsersInChatsResolver, PrismaService, JwtService, AuthService, UserService],
})
export class UsersInChatsModule { }
