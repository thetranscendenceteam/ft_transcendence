import { Inject, Injectable } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { SendMessageInput } from './dto/inputMessage.input';
import { PrismaService } from 'src/prisma.service';
import { MessageForSub } from './dto/MessageForSub.entity';

const NEW_MESSAGE = 'newMessage_';

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService, @Inject(PUB_SUB) private pubSub: RedisPubSub) { }

    async supprOldestMessage(chatId: string) {
        try {
            const oldestMessage = await this.prisma.messages.findFirst({
                where: {
                    chatId: chatId,
                },
                orderBy: {
                    timestamp: 'asc',
                },
            });
            if (!oldestMessage) return;
            await this.prisma.messages.delete({
                where: {
                    id: oldestMessage.id,
                },
            })
        }
        catch (e) {
            console.log("Error on supprOldestMessage");
            throw e;
        }
    }

    async addMessage(input: SendMessageInput) {
        try {
            const date = new Date().toISOString();
            const nMessage = await this.prisma.messages.count({
                where: {
                    chatId: input.chatId,
                }
            })
            if (nMessage > 19) this.supprOldestMessage(input.chatId);
            const update = await this.prisma.messages.create({
                data: {
                    message: input.message,
                    username: input.username,
                    timestamp: date,
                    chatId: input.chatId,
                },
                select: {
                    id: true,
                    message: true,
                    username: true,
                    timestamp: true,
                    chatId: true,
                }
            })
            if (!update) return false;
            const res: MessageForSub = new MessageForSub();
            res.message = update.message;
            res.timestamp = update.timestamp.toISOString();
            res.username = update.username;
            this.pubSub.publish(NEW_MESSAGE + input.chatId, { newMessage: res });
            return true;
        }
        catch (e) {
            console.log("Error on addMessage Mutation");
            throw e;
        }
    }

    async getMessageHistoryOfChat(chatId: string) {
        try {
            const res = await this.prisma.messages.findMany({
                where: {
                    chatId: chatId,
                },
            });
            if (!res) return null;
            return res;
        }
        catch (e) {
            console.log("Error on getMessageHistoryOfChat");
            throw e;
        }
    }

}
