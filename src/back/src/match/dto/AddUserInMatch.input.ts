import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddUserInMatch {
    @Field(() => String)
    matchId: string;

    @Field(() => String)
    userId: string;
}
