import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserChatInfo } from './dto/UserChatInfo.entity';
import { ChatUserInfo } from './dto/ChatUserInfo.entity';
import { UserChatStatus } from '@prisma/client';
import { InfoChatForUserInput } from './dto/getInfoChatForUser.input';

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
                    user: {
                        select: {
                            id: true,
                            pseudo: true,
                            avatar: true,
                        },
                    },
                    chat: {
                        include: {
                            UsersInBanLists: {
                                where: {
                                    chatId: chatId,
                                    userId: userId,
                                },
                                select: {
                                    status: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!chat) return null;
            if (!chat.user) return null;
            user.idUser = chat.user.id;
            user.pseudo = chat.user.pseudo;
            user.role = chat.role;
            if (chat.chat.UsersInBanLists.length > 0)
                user.status = chat.chat.UsersInBanLists[0].status;
            else
                user.status = UserChatStatus.normal;
            user.joinedAt = chat.joinedAt;
            user.avatar = chat.user.avatar;
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
                    chat: {
                        select: {
                            id: true,
                            name: true,
                            UsersInBanLists: {
                                where: {
                                    chatId: chatId,
                                    userId: userId,
                                },
                                select: {
                                    status: true,
                                }
                            }
                        }
                    }
                },
            });
            if (!chats) return null;
            if (!chats.chat) return null;
            chat.idChat = chats.chatId;
            chat.userId = userId;
            chat.name = chats.chat.name;
            chat.role = chats.role;
            chat.joinedAt = chats.joinedAt;
            if (chats.chat.UsersInBanLists.length > 0)
                chat.status = chats.chat.UsersInBanLists[0].status;
            else
                chat.status = UserChatStatus.normal;
            return chat;
        }
        catch (e) {
            console.log("Error in getChatInfoByUserIdAndChatId" + e);
            throw e;
        }
    }

    async getInfoUser(input: InfoChatForUserInput): Promise<ChatUserInfo | null> {
        try {
            const query = await this.prisma.usersInChats.findFirst({
                where: {
                    chatId: input.chatId,
                    userId: input.userId,
                },
                select: {
                    userId: true,
                    chatId: true,
                    role: true,
                    joinedAt: true,
                    chat: {
                        select: {
                            name: true,
                            UsersInBanLists: {
                                where: {
                                    chatId: input.chatId,
                                    userId: input.userId,
                                },
                                select: {
                                    status: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!query) return null;
            let res: ChatUserInfo = new ChatUserInfo();
            res.idChat = query.chatId;
            res.userId = query.userId;
            res.name = query.chat.name;
            res.role = query.role;
            if (query.chat.UsersInBanLists.length > 0)
                res.status = query.chat.UsersInBanLists[0].status;
            else
                res.status = UserChatStatus.normal;
            res.joinedAt = query.joinedAt;
            return res;
        }
        catch (e) {
            console.log("Error on getInfoUser query");
            throw e;
        }
    }

}