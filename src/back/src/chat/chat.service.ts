import { Injectable } from '@nestjs/common';
import { Chats } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { GetChatInput } from './dto/getChat.input';
import { CreateChatInput } from './dto/createChat.input';
import { UpdateChatInput } from './dto/updateChat.input';
import { AddInBanList } from './dto/AddInBanList.input';
import { UsersInBanList } from './dto/UsersInBanLists.entity';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) { }

    async getAllChats(max: number | undefined): Promise<Chats[]> {
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

    async getChat(chatInput: GetChatInput): Promise<Chats | null> {
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

    async createChat(createChatInput: CreateChatInput): Promise<Chats> {
        try {
            const newChat = this.prisma.chats.create({
                data: {
                    name: createChatInput.name,
                    password: createChatInput.password,
                },
            });
            return newChat;
        }
        catch (e) {
            console.log("Error on createChat query" + e);
            throw e;
        }
    }

    async updateChat(updateChatInput: UpdateChatInput): Promise<Chats> {
        try {
            const updateChat = this.prisma.chats.update({
                where: {
                    id: updateChatInput.id,
                },
                data: updateChatInput.var
            });
            return updateChat;
        }
        catch (e) {
            console.log("Error on updateChat query" + e);
            throw e;
        }
    }

    async getBanList(chatId: string): Promise<UsersInBanList[] | null> {
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

    async addInBanList(input: AddInBanList): Promise<string> {
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

}
