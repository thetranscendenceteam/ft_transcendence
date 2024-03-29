import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { ScoreInput } from './Score.input';

@InputType()
export class SetMatchScoreInput {
    @Field(() => String)
    id: string;

    @Field(() => ScoreInput, { nullable: true })
    score: ScoreInput;

    @Field(() => String)
    winnerId: string;
}
