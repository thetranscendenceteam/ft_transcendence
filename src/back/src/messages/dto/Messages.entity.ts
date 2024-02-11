import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Message {
    @Field(() => String, { nullable: true })
    id: string;

    @Field(() => Date, { nullable: true })
    timestamp: Date;

    @Field(() => String, { nullable: true })
    message: string;

    @Field(() => String, { nullable: true })
    username: string;

    @Field(() => String, { nullable: true })
    chatId: string;
}