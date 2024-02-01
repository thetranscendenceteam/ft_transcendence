import { Field, InputType } from '@nestjs/graphql'

@InputType()
class VarUpdateChatInput {
    @Field(() => String, { nullable: true })
    name: string;

    @Field(() => String, { nullable: true })
    password: string;
}

@InputType()
export class UpdateChatInput {
    @Field(() => VarUpdateChatInput)
    var: VarUpdateChatInput;

    @Field(() => String)
    id: string;
}