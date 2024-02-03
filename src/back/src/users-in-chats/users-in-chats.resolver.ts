import { Args, Resolver, Query } from '@nestjs/graphql';
import { UsersInChatsService } from './users-in-chats.service';
import { UserChatInfo } from './dto/UserChatInfo.entity';
import { ChatUserInfo } from './dto/ChatUserInfo.entity';

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

    @Query(returns => [ChatUserInfo])
    getChatsByIdUser(
        @Args('userId', { type: () => String, nullable: false }) userId: string
    ): Promise<ChatUserInfo[]> {
        console.log("getChatsByIdUser query with userId : " + userId);
        return this.usersInChatsService.getAllChatByUserId(userId);
    }
}
