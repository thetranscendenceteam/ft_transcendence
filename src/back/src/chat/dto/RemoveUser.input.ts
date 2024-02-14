import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RemoveUserInput {
    @Field(() => String)
    chatId: string;

    @Field(() => String)
    userId: string;
}