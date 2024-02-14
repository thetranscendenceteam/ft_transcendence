import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetChatInput } from './dto/getChat.input';
import { CreateChatInput } from './dto/createChat.input';
import { UpdateChatInput } from './dto/updateChat.input';
import { AddInBanList } from './dto/AddInBanList.input';
import { UpdateUserInChat } from './dto/UpdateUserInChat.input';
import { Chat } from './dto/chat.entity';
import { RemoveUserInput } from './dto/RemoveUser.input';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) { }

    async getAllChats(max: number | undefined): Promise<Chat[]> {
        try {
            return await this.prisma.chats.findMany({
                take: max,
                orderBy: { name: 'asc' },
            })
        }
        catch (e) {
            console.log("Error on getAllChats query" + e);
            throw e;
        }
    }

    async getChat(chatInput: GetChatInput) {
        try {
            const chat = await this.prisma.chats.findFirst({
                where: chatInput,
            });
            if (chat) return chat;
            return null;
        }
        catch (e) {
            console.log("Error on getChat query" + e);
            throw e;
        }
    }

    async createChat(createChatInput: CreateChatInput) {
        try {
            const newChat = this.prisma.chats.create({
                data: {
                    name: createChatInput.name,
                    isPrivate: createChatInput.isPrivate,
                },
            });
            return newChat;
        }
        catch (e) {
            console.log("Error on createChat query" + e);
            throw e;
        }
    }

    async updateChat(updateChatInput: UpdateChatInput) {
        try {
            const updateChat = this.prisma.chats.update({
                where: {
                    id: updateChatInput.id,
                },
                data: {
                    name: updateChatInput.name,
                },
            });
            return updateChat;
        }
        catch (e) {
            console.log("Error on updateChat query" + e);
            throw e;
        }
    }

    async getBanList(chatId: string) {
        try {
            const res = await this.prisma.usersInBanLists.findMany({
                where: {
                    chatId: chatId,
                },
            });
            return res;
        }
        catch (e) {
            console.log("Error on getBanList query");
            throw e;
        }
    }

    async addInBanList(input: AddInBanList) {
        try {
            const res = await this.prisma.usersInBanLists.upsert({
                where: {
                    userId_chatId: {
                        userId: input.userId,
                        chatId: input.chatId,
                    }
                },
                update: {
                    status: input.status,
                    lastChange: new Date().toISOString(),
                },
                create: {
                    userId: input.userId,
                    chatId: input.chatId,
                    status: input.status,
                    lastChange: new Date().toISOString(),
                }
            });
            return res.userId;
        }
        catch (e) {
            console.log("Error on addInBanList mutation");
            throw e;
        }
    }

    async addUserInChat(input: UpdateUserInChat) {
        try {
            const res = await this.prisma.chats.update({
                where: {
                    id: input.chatId,
                },
                data: {
                    users: {
                        upsert: {
                            where: {
                                userId_chatId: {
                                    userId: input.userId,
                                    chatId: input.chatId,
                                },
                            },
                            create: {
                                userId: input.userId,
                                role: input.role,
                            },
                            update: {
                                userId: input.userId,
                                role: input.role,
                            },
                        },
                    },
                },
            });
            if (!res) return null;
            return await this.prisma.users.findFirst({
                where: {
                    id: input.userId,
                },
                select: {
                    pseudo: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    xp: true,
                    createdAt: true,
                    modifiedAt: true,
                    count: true,
                    campus: true,
                }
            });
        }
        catch (e) {
            console.log("Error on addUserInChat mutation");
            throw e;
        }
    }

    async removeUserOfChat(input: RemoveUserInput) {
        try {
            await this.prisma.usersInChats.delete({
                where: {
                    userId_chatId: {
                        userId: input.userId,
                        chatId: input.chatId,
                    },
                },
            });
            const test = await this.prisma.usersInChats.findFirst({
                where: {
                    chatId: input.chatId,
                    userId: input.userId,
                },
            });
            if (!test) return true;
            return false;
        }
        catch (e) {
            console.log("Error on removeUserOfChat mutation");
            throw e;
        }
    }

}
