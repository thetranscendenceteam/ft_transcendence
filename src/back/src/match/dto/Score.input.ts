import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ScoreInput {
    @Field(() => String, { nullable: true })
    id: string;

    @Field(() => Int, { nullable: true })
    winnerScore: number;

    @Field(() => Int, { nullable: true })
    looserScore: number;

    @Field(() => String, { nullable: true })
    matchId: string;

    @Field(() => Int, { nullable: true })
    bestOf: number;
}