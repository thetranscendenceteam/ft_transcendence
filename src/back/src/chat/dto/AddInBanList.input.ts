import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { UserChatStatus } from '@prisma/client';

@InputType()
export class AddInBanList {
    @Field(() => String)
    userId: string;

    @Field(() => String)
    chatId: string;

    @Field(() => UserChatStatus)
    status: UserChatStatus;

}

registerEnumType(UserChatStatus, {
    name: 'UserChatStatus'
})