import { Field, ObjectType } from '@nestjs/graphql';
import { UserChatInfo } from './UserChatInfo.entity';

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
}
