import { Field, ObjectType } from '@nestjs/graphql';
import { Match } from './Match.entity';

@ObjectType()
export class UserInMatch {
    @Field(() => String, { nullable: true })
    matchId: string;

    @Field(() => String, { nullable: true })
    userId: string;

    @Field(() => Boolean, { nullable: true })
    isWin: boolean;

    @Field(() => Match, { nullable: true })
    match: Match;
}