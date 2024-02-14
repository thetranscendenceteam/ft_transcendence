import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { UserChatRole } from '@prisma/client';

@InputType()
export class UpdateUserInChat {
    @Field(() => String)
    userId: string;

    @Field(() => String)
    chatId: string;

    @Field(() => UserChatRole, { nullable: true })
    role: UserChatRole;
}

registerEnumType(UserChatRole, {
    name: 'UserChatRole'
})