import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateChatInput {
    @Field(() => String)
    name: string;

    @Field(() => Boolean)
    isPrivate: boolean;
}