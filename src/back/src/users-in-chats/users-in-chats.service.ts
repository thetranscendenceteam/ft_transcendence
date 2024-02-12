import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserChatInfo } from './dto/UserChatInfo.entity';
import { ChatUserInfo } from './dto/ChatUserInfo.entity';

@Injectable()
export class UsersInChatsService {
    constructor(private prisma: PrismaService) { }

    async getAllUsersByChatId(idChat: string): Promise<UserChatInfo[]> {
        try {
            const usersInChats = await this.prisma.usersInChats.findMany({
                where: {
                    chatId: idChat,
                }
            });
            const results = await Promise.all(usersInChats
                .map((u) => this.getUserChatInfoByIdUserAndIdChat(u.userId, idChat)))
            return results.filter((u): u is UserChatInfo => u !== null);
        }
        catch (e) {
            console.log("Error on getAllUsersByChatId query" + e);
            throw e;
        }
    }

    async getUserChatInfoByIdUserAndIdChat(userId: string, chatId: string): Promise<UserChatInfo | null> {
        try {
            let user: UserChatInfo = new UserChatInfo;
            const chat = await this.prisma.usersInChats.findFirst({
                where: {
                    chatId: chatId,
                    userId: userId,
                },
                include: {
                    user: true,
                }
            });
            if (!chat) return null;
            if (!chat.user) return null;
            user.idUser = chat.user.id;
            user.pseudo = chat.user.pseudo;
            user.role = chat.role;
            user.joinedAt = chat.joinedAt;
            return user;
        }
        catch (e) {
            console.log("Error in getUserChatInfoByIdUserAndIdChat" + e);
            throw e;
        }
    }

    async getAllChatByUserId(idUser: string): Promise<ChatUserInfo[]> {
        try {
            const chats = await this.prisma.usersInChats.findMany({
                where: {
                    userId: idUser,
                }
            });
            const results = await Promise.all(chats
                .map((c) => this.getChatInfoByUserIdAndChatId(idUser, c.chatId)));
            return results.filter((c): c is ChatUserInfo => c !== null);
        }
        catch (e) {
            console.log("Error in getAllChatByUserId" + e);
            throw e;
        }
    }

    async getChatInfoByUserIdAndChatId(userId: string, chatId: string): Promise<ChatUserInfo | null> {
        try {
            let chat: ChatUserInfo = new ChatUserInfo;
            const chats = await this.prisma.usersInChats.findFirst({
                where: {
                    chatId: chatId,
                    userId: userId,
                },
                include: {
                    chat: true,
                }
            });
            if (!chats) return null;
            if (!chats.chat) return null;
            chat.idChat = chats.chatId;
            chat.name = chats.chat.name;
            chat.role = chats.role;
            chat.joinedAt = chats.joinedAt;
            return chat;
        }
        catch (e) {
            console.log("Error in getChatInfoByUserIdAndChatId" + e);
            throw e;
        }
    }

}