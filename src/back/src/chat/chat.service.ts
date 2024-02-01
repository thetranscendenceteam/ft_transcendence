import { Injectable } from '@nestjs/common';
import { Chats } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { GetChatInput } from './dto/getChat.input';
import { CreateChatInput } from './dto/createChat.input';
import { UpdateChatInput } from './dto/updateChat.input';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) { }

    async getAllChats(max: number | undefined): Promise<Chats[]> {
        return await this.prisma.chats.findMany({
            take: max,
            orderBy: { name: 'asc' },
        });
    }

    async getChat(chatInput: GetChatInput): Promise<Chats | null> {
        const chat = await this.prisma.chats.findFirst({
            where: chatInput,
        });
        if (chat) return chat;
        return null;
    }

    async createChat(createChatInput: CreateChatInput): Promise<Chats> {
        const newChat = this.prisma.chats.create({
            data: {
                name: createChatInput.name,
                password: createChatInput.password,
            },
        });
        return newChat;
    }

    async updateChat(updateChatInput: UpdateChatInput): Promise<Chats> {
        const updateChat = this.prisma.chats.update({
            where: {
                id: updateChatInput.id,
            },
            data: updateChatInput.var
        });
        return updateChat;
    }

}
