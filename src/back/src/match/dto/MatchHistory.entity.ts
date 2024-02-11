import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MatchHistory {
    @Field(() => String, { nullable: true })
    matchId: string;

    @Field(() => Date, { nullable: true })
    createdAt: Date;

    @Field(() => Boolean, { nullable: true })
    isWin: boolean;

    @Field(() => Int, { nullable: true })
    userScore: number | null;

    @Field(() => Int, { nullable: true })
    adversaryScore: number | null;

    @Field(() => String, { nullable: true })
    adversaryUsername: Promise<string>;
}