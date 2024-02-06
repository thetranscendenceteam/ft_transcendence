import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateClassicUserInput {
    @Field(() => String)
    mail: string;

    @Field(() => String)
    password: string;

    @Field(() => String)
    firstName: string;

    @Field(() => String)
    lastName: string;

    @Field(() => String, { nullable: true })
    avatar: string | null;

    @Field(() => String)
    pseudo: string;
}