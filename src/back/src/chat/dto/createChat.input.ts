import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateChatInput {
    @Field(() => String)
    name: string;

    @Field(() => String, { nullable: true })
    password: string;
}