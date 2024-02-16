import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateChatInput {
    @Field(() => String, { nullable: true })
    name: string;

    @Field(() => String)
    id: string;

    @Field(() => Boolean, { nullable: true })
    isPrivate: boolean;

    @Field(() => Boolean, { nullable: true })
    isWhisper: boolean;
}