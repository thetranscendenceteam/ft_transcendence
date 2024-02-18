import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { UserChatStatus } from '@prisma/client';

@ObjectType()
export class UsersInBanList {
    @Field(() => String, { nullable: true })
    userId: string;

    @Field(() => String, { nullable: true })
    chatId: string;

    @Field(() => UserChatStatus)
    status: UserChatStatus;

    @Field(() => Date, { nullable: true })
    lastChange: Date;

		@Field(() => String, { nullable: true })
		username: string;

		@Field(() => String, { nullable: true })
		avatar: string;
}

registerEnumType(UserChatStatus, {
    name: 'UserChatStatus'
})
