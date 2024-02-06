import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateUser {
    @Field(() => String)
    id: string;

    @Field(() => String, { nullable: true })
    pseudo: string;

    @Field(() => String, { nullable: true })
    password: string | null;

    @Field(() => String, { nullable: true })
    avatar: string;

    @Field(() => Int, { nullable: true })
    xp: number;

    @Field(() => String, { nullable: true })
    campus: string | null;

    @Field(() => Boolean, { nullable: true })
    twoFA: boolean;
}
