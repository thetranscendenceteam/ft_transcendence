import { Field, ObjectType } from '@nestjs/graphql';
import { Score } from './Score.entity';
import { MatchDifficulty } from '@prisma/client';

@ObjectType()
export class Match {
    @Field(() => String, { nullable: true })
    id: string;

    @Field(() => Date, { nullable: true })
    createdAt: Date;

    @Field(() => Date, { nullable: true })
    startedAt: Date | null;

    @Field(() => Date, { nullable: true })
    finishedAt: Date | null;

    @Field(() => MatchDifficulty, { nullable: true })
    difficulty: MatchDifficulty;

    @Field(() => Score, { nullable: true })
    score: Score | null;
}
