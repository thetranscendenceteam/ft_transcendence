import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SendMessageInput {
    @Field(() => String)
    message: string;

    @Field(() => String)
    username: string;

    @Field(() => String)
    chatId: string;
}
