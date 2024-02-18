import { Args, Resolver, Query } from '@nestjs/graphql';
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
    getUsersByIdChat(
        @Args('chatId', { type: () => String, nullable: false }) chatId: string
    ): Promise<UserChatInfo[]> {
        console.log("getUsersByIdChat query with chatId : " + chatId);
        return this.usersInChatsService.getAllUsersByChatId(chatId);
    }

    @Query(returns => [ChatsInfoWithUser])
    async getChatsByIdUser(
        @Args('userId', { type: () => String, nullable: false }) userId: string
    ): Promise<ChatsInfoWithUser[]> {
        console.log("getChatsByIdUser query with userId : " + userId);
		const chats = await this.usersInChatsService.getAllChatByUserId(userId);
		for (const i of chats) {
			if (i.isPrivate) {
				const users = await this.usersInChatsService.getAllUsersByChatId(i.idChat);
				const user = users.filter((u) => u.idUser != userId);
				i.userInfo = user[0];
			}

		}
		return chats;
    }

	@Query(returns => ChatUserInfo)
    getInfoUserForIdChatAndIdUser(
        @Args('InfoChatForUserInput') input: InfoChatForUserInput,
    ): Promise<ChatUserInfo | null> {
        return this.usersInChatsService.getInfoUser(input);
    }
}
