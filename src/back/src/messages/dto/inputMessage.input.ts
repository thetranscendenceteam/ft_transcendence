import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SendMessageInput {
    @Field(() => String, { nullable: true })
    message: string;

    @Field(() => String, { nullable: true })
    username: string;
}
