import { Inject, Injectable } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { SendMessageInput } from './dto/inputMessage.input';
import { PrismaService } from 'src/prisma.service';
import { MessageForSub } from './dto/MessageForSub.entity';
import { UserChatStatus } from '@prisma/client';
import { Message } from './dto/Messages.entity';

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
      	if (await this.userMuted(input)) return false;
        	const date = new Date().toISOString();
        	const nMessage = await this.prisma.messages.count({
            where: {
              chatId: input.chatId,
            },
          });
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
              },
          });
					const avatar = await this.prisma.users.findFirst({
						where: {
							pseudo: input.username,
						},
						select: {
							avatar: true,
						}
					});
					if (!update) return false;
					const res: MessageForSub = new MessageForSub();
					res.message = update.message;
					res.timestamp = update.timestamp.toISOString();
					res.username = update.username;
					res.link = input.link;
					if (avatar) res.avatar = avatar.avatar;
					else res.avatar = "";
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
						let obj : Message[] = [];
            const res = await this.prisma.messages.findMany({
                where: {
                    chatId: chatId,
                },
            });
            if (!res) return null;
						for (const i of res) {
							let j : Message = new Message();
							j.id = i.id;
							j.timestamp = i.timestamp;
							j.message = i.message;
							j.username = i.username;
							j.chatId = i.chatId;
							j.link = null;
							obj.push(j);
						}
						return obj;
        }
        catch (e) {
            console.log("Error on getMessageHistoryOfChat");
            throw e;
        }
    }

    async userMuted(input: SendMessageInput) {
        try {
            const user = await this.prisma.users.findFirst({
                where: {
                    pseudo: input.username,
                },
            });
            if (!user) return true;
            const res = await this.prisma.usersInBanLists.findFirst({
                where: {
                    chatId: input.chatId,
                    userId: user.id,
                },
            });
            if (!res) return false;
            if (res.status == UserChatStatus.muted) return true;
            return false;
        }
        catch (e) {
            console.log("Error on userMuted function");
            throw e;
        }
    }

}
