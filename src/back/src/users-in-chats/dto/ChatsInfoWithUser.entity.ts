import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserChatInfo } from './UserChatInfo.entity';
import { UserChatRole, UserChatStatus } from '@prisma/client';

@ObjectType()
export class ChatsInfoWithUser {
    @Field(() => String, { nullable: true })
    idChat: string;

    @Field(() => UserChatInfo, { nullable: true })
    userInfo: UserChatInfo;

    @Field(() => String, { nullable: true })
    name: string

    @Field(() => Boolean, { nullable: true })
    isPrivate: boolean;

    @Field(() => Boolean, { nullable: true })
    isWhisper: boolean;

    @Field(() => UserChatRole, { nullable: true })
    role: UserChatRole;

    @Field(() => UserChatStatus, { nullable: true })
    status: UserChatStatus;
}

registerEnumType(UserChatRole, {
    name: 'UserChatRole'
})

registerEnumType(UserChatStatus, {
    name: 'UserChatStatus'
})
