import { Inject, Injectable } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';

@Injectable()
export class MessagesService {
    constructor(@Inject(PUB_SUB) private pubSub: RedisPubSub) { }

    addMessage(message: string) {
        this.pubSub.publish('NEW_MESSAGE', { newMessage: message });
    }

}
