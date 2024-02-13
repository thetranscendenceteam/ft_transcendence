import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Chat } from './dto/chat.entity';
import { Chats } from '@prisma/client';
import { GetChatInput } from './dto/getChat.input';
import { CreateChatInput } from './dto/createChat.input';
import { UpdateChatInput } from './dto/updateChat.input';
import { AddInBanList } from './dto/AddInBanList.input';
import { UsersInBanList } from './dto/UsersInBanLists.entity';
import { UserPrivate } from 'src/user/dto/userPrivate.entity';
import { UpdateUserInChat } from './dto/UpdateUserInChat.input';

@Resolver()
export class ChatResolver {
    constructor(private chatService: ChatService) { }

    @Query(returns => [Chat])
    getAllChats(
        @Args('max', { type: () => Int, nullable: true }) max: number | undefined,
    ): Promise<Chats[]> {
        return this.chatService.getAllChats(max);
    }

    @Query(returns => Chat)
    async getChat(
        @Args('ChatInput') chatInput: GetChatInput,
    ): Promise<Chats | null> {
        return this.chatService.getChat(chatInput);
    }

    @Mutation(returns => Chat)
    createChat(
        @Args('createChatInput') createChatInput: CreateChatInput,
    ): Promise<Chats> {
        return this.chatService.createChat(createChatInput);
    }

    @Mutation(returns => Chat)
    updateChat(
        @Args('updateChatInput') updateChatInput: UpdateChatInput,
    ): Promise<Chats> {
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

}
