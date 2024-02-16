import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { MatchDifficulty } from '@prisma/client';

@ObjectType()
export class SettingsOfMatch {
    @Field(() => MatchDifficulty)
    difficulty: MatchDifficulty | undefined;

    @Field(() => Int)
    bestOf: number | undefined;
}

registerEnumType(MatchDifficulty, {
    name: 'MatchDifficulty'
})