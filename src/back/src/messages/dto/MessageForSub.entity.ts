import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageForSub {
    @Field(() => String, { nullable: true })
    timestamp: string;

    @Field(() => String, { nullable: true })
    message: string;

    @Field(() => String, { nullable: true })
    username: string;
}