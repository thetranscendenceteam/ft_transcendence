import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { MatchService } from './match.service';
import { MatchHistory } from './dto/MatchHistory.entity';
import { CreateOrFindMatchInput } from './dto/CreateOrFindMatch.input';
import { Match } from './dto/Match.entity';
import { SaveOrUpdateMatchInput } from './dto/SaveOrUpdateMatch.input';

@Resolver()
export class MatchResolver {
    constructor(private matchService: MatchService) { }

    @Query(returns => [MatchHistory])
    getUserMatchHistory(
        @Args('userId', { type: () => String, nullable: false }) userId: string,
    ): Promise<MatchHistory[] | null> {
        console.log("getUserMatchHistory with userId : " + userId);
        return this.matchService.getUserMatchHistory(userId);
    }

    @Query(returns => String, { nullable: true })
    isUserInMatch(
        @Args('userId', { type: () => String, nullable: false }) userId: string,
    ): Promise<String | null> {
        console.log("isUserInMatch query with userId : " + userId);
        return this.matchService.isUserInMatch(userId);
    }

    @Mutation(returns => String)
    createOrFindMatch(
        @Args('createMatchInput') createOrFindMatchInput: CreateOrFindMatchInput
    ): Promise<String> {
        console.log("createMatch query");
        return this.matchService.createOrFindMatch(createOrFindMatchInput);
    }

    @Mutation(returns => Match)
    saveOrUpdateMatch(
        @Args('saveOrUpdateMatchInput') saveOrUpdateMatchInput: SaveOrUpdateMatchInput
    ): Promise<Match> {
        console.log("saveOrUpdateMatch query");
        return this.matchService.saveOrUpdateMatch(saveOrUpdateMatchInput);
    }

}
