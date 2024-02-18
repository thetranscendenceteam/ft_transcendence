import { Field, ObjectType } from '@nestjs/graphql';
import { UserChatRole, UserChatStatus } from '@prisma/client';

@ObjectType()
export class UserChatInfo {
    @Field(() => String, { nullable: true })
    idUser: string;

    @Field(() => String, { nullable: true })
    pseudo: string;

    @Field(() => String, { nullable: true })
    role: UserChatRole;

    @Field(() => String, { nullable: true })
    status: UserChatStatus;

    @Field(() => Date, { nullable: true })
    joinedAt: Date;

    @Field(() => String, { nullable: true })
    avatar: string;
}
