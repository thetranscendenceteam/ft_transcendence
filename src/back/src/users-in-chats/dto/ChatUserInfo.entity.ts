import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserChatRole, UserChatStatus } from '@prisma/client';

@ObjectType()
export class ChatUserInfo {
    @Field(() => String, { nullable: true })
    idChat: string;

    @Field(() => String, { nullable: true })
    userId: string;

    @Field(() => String, { nullable: true })
    name: string

    @Field(() => UserChatRole, { nullable: true })
    role: UserChatRole;

    @Field(() => UserChatStatus, { nullable: true })
    status: UserChatStatus;

    @Field(() => Boolean, { nullable: true })
    isPrivate: boolean;

    @Field(() => Boolean, { nullable: true })
    isWhisper: boolean;

    @Field(() => Date, { nullable: true })
    joinedAt: Date;
}

registerEnumType(UserChatRole, {
    name: 'UserChatRole'
})

registerEnumType(UserChatStatus, {
    name: 'UserChatStatus'
})