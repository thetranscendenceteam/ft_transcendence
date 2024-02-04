import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { MatchService } from './match.service';
import { MatchHistory } from './dto/MatchHistory.entity';

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

}
