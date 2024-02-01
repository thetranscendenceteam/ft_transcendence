import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Chat } from './dto/chat.entity';
import { Chats } from '@prisma/client';
import { GetChatInput } from './dto/getChat.input';
import { CreateChatInput } from './dto/createChat.input';
import { UpdateChatInput } from './dto/updateChat.input';

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

}
