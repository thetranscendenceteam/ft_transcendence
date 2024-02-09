import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Inject } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';

@Resolver()
export class MessagesResolver {
    constructor(private messageService: MessagesService, @Inject(PUB_SUB) private pubSub: RedisPubSub) { }

    @Subscription(returns => String)
    newMessage() {
        console.log("new subscription");
        return this.pubSub.asyncIterator('NEW_MESSAGE');
    }

    @Mutation(returns => String)
    addMessage(@Args('message') message: string) {
        return this.messageService.addMessage(message);
    }

}
