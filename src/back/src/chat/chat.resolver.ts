import { Args, Mutation, Query, Resolver, Int, Context } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/gql-auth.guards';
import { UseGuards } from '@nestjs/common';
import { RequestWithUser } from '../user/dto/requestwithuser.interface';
import { ChatService } from './chat.service';
import { Chat } from './dto/chat.entity';
import { GetChatInput } from './dto/getChat.input';
import { CreateChatInput } from './dto/createChat.input';
import { UpdateChatInput } from './dto/updateChat.input';
import { AddInBanList } from './dto/AddInBanList.input';
import { UsersInBanList } from './dto/UsersInBanLists.entity';
import { UserPrivate } from 'src/user/dto/userPrivate.entity';
import { UpdateUserInChat } from './dto/UpdateUserInChat.input';
import { RemoveUserInput } from './dto/RemoveUser.input';
import { InfoChatForUserInput } from 'src/users-in-chats/dto/getInfoChatForUser.input';

@Resolver()
export class ChatResolver {
  constructor(private chatService: ChatService) { }

  @Query(returns => [Chat])
  getAllChats(
    @Args('max', { type: () => Int, nullable: true }) max: number | undefined,
  ): Promise<Chat[]> {
    return this.chatService.getAllChats(max);
  }

  @Query(returns => Chat)
  async getChat(
    @Args('ChatInput') chatInput: GetChatInput,
  ): Promise<Chat | null> {
    return this.chatService.getChat(chatInput);
  }

  @Mutation(returns => Chat)
  createChat(
    @Args('createChatInput') createChatInput: CreateChatInput,
  ): Promise<Chat> {
    return this.chatService.createChat(createChatInput);
  }

  @Mutation(returns => Chat)
	@UseGuards(GqlAuthGuard)
  updateChat(
		@Context('req') req : RequestWithUser,
    @Args('updateChatInput') updateChatInput: UpdateChatInput,
  ): Promise<Chat> {
    return this.chatService.updateChat(updateChatInput, req.user.id);
  }

  @Query(returns => [UsersInBanList])
  getBanList(
    @Args('chatId') chatId: string,
  ): Promise<UsersInBanList[] | null> {
    return this.chatService.getBanList(chatId);
  }

  @Mutation(returns => String)
	@UseGuards(GqlAuthGuard)
  addInBanList(
    @Args('addInBanListInput') addInBanListInput: AddInBanList,
		@Context('req') req : RequestWithUser,
  ): Promise<string> {
		const user = req.user;
  	return this.chatService.addInBanList(addInBanListInput, user.id);
  }

	@Mutation(returns => Boolean)
	@UseGuards(GqlAuthGuard)
	removeFromBanList(
		@Args('userId') userId: string,
		@Args('chatId') chatId: string,
		@Context('req') req: RequestWithUser,
	): Promise<boolean> {
		const user = req.user;
		return this.chatService.removeFromBanList(userId, chatId, user.id);
	}

  @Mutation(returns => UserPrivate)
  updateUserInChat(
    @Args('addUserInChat') input: UpdateUserInChat,
  ): Promise<UserPrivate | null> {
    return this.chatService.addUserInChat(input);
  }

  @Mutation(returns => Boolean)
	@UseGuards(GqlAuthGuard)
  removeUserOfChat(
    @Args('removeUser') input: RemoveUserInput,
		@Context('req') req: RequestWithUser,
  ): Promise<boolean> {
		const user = req.user;
  	return this.chatService.removeUserOfChat(input, user.id);
  }

}
