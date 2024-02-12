import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { UserChatStatus } from '@prisma/client';

@ObjectType()
export class UsersInBanList {
    @Field(() => String, { nullable: true })
    userId: string;

    @Field(() => String, { nullable: true })
    banListId: string;

    @Field(() => UserChatStatus)
    status: UserChatStatus;
}

registerEnumType(UserChatStatus, {
    name: 'UserChatStatus'
})