import { Args, Mutation, Query, Resolver, Subscription, Context } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/gql-auth.guards';
import { RequestWithUser } from '../user/dto/requestwithuser.interface';
import { UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Inject } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { Message } from './dto/Messages.entity';
import { SendMessageInput } from './dto/inputMessage.input';
import { MessageForSub } from './dto/MessageForSub.entity';

const NEW_MESSAGE = 'newMessage_';

@Resolver()
export class MessagesResolver {
	constructor(
		private messageService: MessagesService,
		@Inject(PUB_SUB) private pubSub: RedisPubSub) 
		{ }

	@Subscription(() => MessageForSub)
	newMessage(
		@Args('chatId') chatId: string
	){
		return this.pubSub.asyncIterator(NEW_MESSAGE + chatId);
	}

	@Mutation(returns => Boolean)
	addMessage(
		@Args('message') message: SendMessageInput
	): Promise<Boolean> {
		return this.messageService.addMessage(message);
	}

	@Query(returns => [Message])
	@UseGuards(GqlAuthGuard)
	getMessageHistoryOfChat(
		@Context('req') req: RequestWithUser,
		@Args('chatId', { type: () => String }) chatId: string
	): Promise<Message[] | null> {
		const user = req.user;
		return this.messageService.getMessageHistoryOfChat(chatId, user.id);
	}

}
