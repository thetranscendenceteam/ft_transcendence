import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Inject } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { Message } from './dto/Messages.entity';
import { SendMessageInput } from './dto/inputMessage.input';
import { MessageForSub } from './dto/MessageForSub.entity';

const NEW_MESSAGE = 'newMessage';

@Resolver()
export class MessagesResolver {
    constructor(private messageService: MessagesService, @Inject(PUB_SUB) private pubSub: RedisPubSub) { }

    @Subscription(() => MessageForSub)
    newMessage() {
        return this.pubSub.asyncIterator(NEW_MESSAGE);
    }

    @Mutation(returns => Boolean)
    addMessage(
        @Args('message') message: SendMessageInput
    ): Promise<Boolean> {
        return this.messageService.addMessage(message);
    }

    @Query(returns => [Message])
    getMessageHistoryOfChat(
        @Args('chatId', { type: () => String }) chatId: string,
    ): Promise<Message[] | null> {
        return this.messageService.getMessageHistoryOfChat(chatId);
    }

}
