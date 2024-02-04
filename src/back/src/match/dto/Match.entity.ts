import { Field, ObjectType } from '@nestjs/graphql';
import { Score } from './Score.entity';

@ObjectType()
export class Match {
    @Field(() => String, { nullable: true })
    id: string;

    @Field(() => Date, { nullable: true })
    startedAt: Date;

    @Field(() => Score, { nullable: true })
    score: Score | null;
}