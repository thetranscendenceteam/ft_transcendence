import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FriendRequestForSub {
    @Field(() => String, { nullable: true })
    userId: string;

    @Field(() => String, { nullable: true })
    username: string;
}