import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { MatchDifficulty } from '@prisma/client';

@InputType()
export class CreateMatchInput {
    @Field(() => MatchDifficulty)
    difficulty: MatchDifficulty;

    @Field(() => Int)
    bestOf: number;
}

registerEnumType(MatchDifficulty, {
    name: 'MatchDifficulty'
});