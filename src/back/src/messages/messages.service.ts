import { Inject, Injectable } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { Message } from './dto/Messages.entity';
import { SendMessageInput } from './dto/inputMessage.input';

@Injectable()
export class MessagesService {
    constructor(@Inject(PUB_SUB) private pubSub: RedisPubSub) { }

    addMessage(message: SendMessageInput) {
        this.pubSub.publish('NEW_MESSAGE', { newMessage: message });
        return true;
    }

}
