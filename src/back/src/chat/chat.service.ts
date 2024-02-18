import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetChatInput } from './dto/getChat.input';
import { CreateChatInput } from './dto/createChat.input';
import { UpdateChatInput } from './dto/updateChat.input';
import { AddInBanList } from './dto/AddInBanList.input';
import { UpdateUserInChat } from './dto/UpdateUserInChat.input';
import { Chat } from './dto/chat.entity';
import { RemoveUserInput } from './dto/RemoveUser.input';
import { UsersInBanList } from './dto/UsersInBanLists.entity';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) { }

    async getAllChats(max: number | undefined): Promise<Chat[]> {
        try {
            return await this.prisma.chats.findMany({
                where: {
                    isPrivate: false,
                    isWhisper: false,
                },
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
                    isPrivate: updateChatInput.isPrivate,
                    isWhisper: updateChatInput.isWhisper,
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
            const find = await this.prisma.usersInBanLists.findMany({
                where: {
                    chatId: chatId,
                },
            });
						let res : UsersInBanList[] = [];
						for (const i of find) {
							let add : UsersInBanList = new UsersInBanList();
							const j = await this.prisma.users.findFirst({
								where: {
									id: i.userId,
								},
							});
							add.userId = i.userId;
							add.chatId = i.chatId;
							add.status = i.status;
							add.lastChange = i.lastChange;
							if (j) {
								add.username = j.pseudo;
								add.avatar = j.avatar;
							}
							res.push(add);
						}
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
            const isChanEmpty = await this.prisma.chats.findFirst({
                where: {
                    id: input.chatId,
                },
                include: {
                    users: true,
                },
            });
            if (isChanEmpty) {
                if (isChanEmpty.users.length == 0) {
                    await this.deleteChannel(input.chatId);
                }
            }
            if (!test) return true;
            return false;
        }
        catch (e) {
            console.log("Error on removeUserOfChat mutation");
            throw e;
        }
    }

    async deleteChannel(chatId: string) {
        try {
            await this.prisma.chats.delete({
                where: {
                    id: chatId,
                },
            });
        }
        catch (e) {
            console.log("Error on deleteChannel method");
            throw e;
        }
    }

}
