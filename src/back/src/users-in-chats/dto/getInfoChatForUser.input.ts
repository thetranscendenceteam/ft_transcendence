import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class InfoChatForUserInput {
    @Field(() => String)
    userId: string;

    @Field(() => String)
    chatId: string;
}
