import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Inject } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { Message } from './dto/Messages.entity';
import { SendMessageInput } from './dto/inputMessage.input';

@Resolver()
export class MessagesResolver {
    constructor(private messageService: MessagesService, @Inject(PUB_SUB) private pubSub: RedisPubSub) { }

    @Subscription(returns => Message)
    newMessage() {
        console.log("new subscription");
        return this.pubSub.asyncIterator('NEW_MESSAGE');
    }

    @Mutation(returns => Boolean)
    addMessage(@Args('message') message: SendMessageInput) {
        return this.messageService.addMessage(message);
    }

}
