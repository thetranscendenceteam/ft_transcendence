import { Field, ObjectType } from '@nestjs/graphql';
import { UserChatRole, UserChatStatus } from '@prisma/client';

@ObjectType()
export class ChatUserInfo {
    @Field(() => String, { nullable: true })
    idChat: string;

    @Field(() => String, { nullable: true })
    name: string

    @Field(() => String, { nullable: true })
    role: UserChatRole;

    @Field(() => String, { nullable: true })
    status: UserChatStatus;

    @Field(() => Date, { nullable: true })
    joinedAt: Date;
}