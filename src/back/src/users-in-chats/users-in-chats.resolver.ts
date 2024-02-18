import { Args, Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guards';
import { RequestWithUser } from 'src/user/dto/requestwithuser.interface';
import { UsersInChatsService } from './users-in-chats.service';
import { UserChatInfo } from './dto/UserChatInfo.entity';
import { ChatUserInfo } from './dto/ChatUserInfo.entity';
import { InfoChatForUserInput } from './dto/getInfoChatForUser.input';
import { ChatsInfoWithUser } from './dto/ChatsInfoWithUser.entity';
import { LIMIT_COMPOUND_SELECT } from 'sqlite3';

@Resolver()
export class UsersInChatsResolver {
	constructor(private usersInChatsService: UsersInChatsService) { }

	@Query(returns => [UserChatInfo])
	@UseGuards(GqlAuthGuard)
	getUsersByIdChat(
		@Context('req') req: RequestWithUser,
		@Args('chatId', { type: () => String, nullable: false }) chatId: string
	): Promise<UserChatInfo[]> {
		const user = req.user;
		console.log("getUsersByIdChat query with chatId : " + chatId);
		return this.usersInChatsService.getAllUsersByChatId(chatId, user.id);
	}

	@Query(returns => [ChatsInfoWithUser])
	@UseGuards(GqlAuthGuard)
	async getChatsByIdUser(
		@Context('req') req: RequestWithUser,
		@Args('userId', { type: () => String, nullable: false }) userId: string
	): Promise<ChatsInfoWithUser[]> {
		const reqUser = req.user;
		if (reqUser.id !== userId) throw new Error("Unauthorized");
		console.log("getChatsByIdUser query with userId : " + userId);
		const chats = await this.usersInChatsService.getAllChatByUserId(userId);
		for (const i of chats) {
			if (i.isWhisper) {
				const users = await this.usersInChatsService.getAllUsersByChatId(i.idChat, reqUser.id);
				const user = users.filter((u) => u.idUser != userId);
				i.userInfo = user[0];
			}
		}
		return chats;
	}

	@Query(returns => ChatUserInfo)
	@UseGuards(GqlAuthGuard)
	getInfoUserForIdChatAndIdUser(
		@Context('req') req: RequestWithUser,
		@Args('InfoChatForUserInput') input: InfoChatForUserInput
	): Promise<ChatUserInfo | null> {
		const user = req.user;
		if (user.id !== input.userId) throw new Error("Unauthorized");
		return this.usersInChatsService.getInfoUser(input);
	}
}
