import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
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
    updateChat(
        @Args('updateChatInput') updateChatInput: UpdateChatInput,
    ): Promise<Chat> {
        return this.chatService.updateChat(updateChatInput);
    }

    @Query(returns => [UsersInBanList])
    getBanList(
        @Args('chatId') chatId: string,
    ): Promise<UsersInBanList[] | null> {
        return this.chatService.getBanList(chatId);
    }

    @Mutation(returns => String)
    addInBanList(
        @Args('addInBanListInput') addInBanListInput: AddInBanList,
    ): Promise<string> {
        return this.chatService.addInBanList(addInBanListInput);
    }

    @Mutation(returns => UserPrivate)
    updateUserInChat(
        @Args('addUserInChat') input: UpdateUserInChat,
    ): Promise<UserPrivate | null> {
        return this.chatService.addUserInChat(input);
    }

    @Mutation(returns => Boolean)
    removeUserOfChat(
        @Args('removeUser') input: RemoveUserInput,
    ): Promise<boolean> {
        return this.chatService.removeUserOfChat(input);
    }

}
