import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MatchService } from './match.service';
import { MatchHistory } from './dto/MatchHistory.entity';
import { CreateOrFindMatchInput } from './dto/CreateOrFindMatch.input';
import { Match } from './dto/Match.entity';
import { CreateMatchInput } from './dto/CreateMatch.input';
import { SetMatchScoreInput } from './dto/SetMatchScore.input';
import { User } from 'src/user/dto/user.entity';
import { UserPrivate } from 'src/user/dto/userPrivate.entity';
import { AddUserInMatch } from './dto/AddUserInMatch.input';
import { SettingsOfMatch } from './dto/SettingsOfMatch.entity';
import { AddXpInput } from './dto/AddXp.input';
import { FindUsers } from './dto/FindUsers.entity';

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

	@Mutation(returns => Boolean)
	addXpPostMatch(
	@Args('addXpInput') input: AddXpInput
	): Promise<boolean> {
		return this.matchService.addXpPostMatch(input);
	}

    // @Query(returns => [Match])
    // findUnstartedMatches(): Promise<Match[]> {
    //     return this.matchService.findUnstartedMatches();
    // }

    // @Query(returns => [Match])
    // findUngoingMatches(): Promise<Match[]> {
    //     return this.matchService.findUngoingMatches();
    // }

    // @Query(returns => [Match])
    // findFinishedMatches(): Promise<Match[]> {
    //     return this.matchService.findFinishedMatches();
    // }

    // @Query(returns => [Match])
    // findUnstartedMatchesForUser(
    //     @Args('userId', { type: () => String, nullable: false }) userId: string,
    // ): Promise<Match[]> {
    //     return this.matchService.findUnstartedMatchesForUser(userId);
    // }

    // @Query(returns => [Match])
    // findUngoingMatchesForUser(
    //     @Args('userId', { type: () => String, nullable: false }) userId: string,
    // ): Promise<Match[]> {
    //     return this.matchService.findUngoingMatchesForUser(userId);
    // }

    // @Query(returns => [Match])
    // findFinishedMatchesForUser(
    //     @Args('userId', { type: () => String, nullable: false }) userId: string,
    // ): Promise<Match[]> {
    //     return this.matchService.findFinishedMatchesForUser(userId);
    // }

    // @Mutation(returns => Match)
    // createMatch(
    //     @Args('createMatchInput') input: CreateMatchInput
    // ): Promise<Match> {
    //     return this.matchService.createMatch(input);
    // }

    // @Mutation(returns => Match)
    // setMatchAsStarted(
    //     @Args('matchId', { type: () => String, nullable: false }) matchId: string,
    // ): Promise<Match> {
    //     return this.matchService.setMatchAsStarted(matchId);
    // }

    // @Mutation(returns => Match)
    // setMatchAsFinished(
    //     @Args('matchId', { type: () => String, nullable: false }) matchId: string,
    // ): Promise<Match> {
    //     return this.matchService.setMatchAsFinished(matchId);
    // }

    // @Mutation(returns => Match)
    // setMatchScore(
    //     @Args('setMatchScoreInput') input: SetMatchScoreInput
    // ): Promise<Match> {
    //     return this.matchService.setMatchScore(input);
    // }

/*     @Query(returns => [FindUsers])
     findUsersInMatch(
         @Args('matchId', { type: () => String, nullable: false }) matchId: string,
     ): Promise<FindUsers[]> {
         return this.matchService.findUsersInMatch(matchId);
    }*/

    // @Mutation(returns => Match)
    // addUserInMatch(
    //     @Args('addUserInMatch') input: AddUserInMatch
    // ): Promise<Match> {
    //     return this.matchService.addUserInMatch(input);
    // }

    @Query(returns => SettingsOfMatch)
    getSettingsOfMatch(
        @Args('matchId', { type: () => String, nullable: false }) matchId: string,
    ): Promise<SettingsOfMatch> {
        return this.matchService.getSettingsOfMatch(matchId);
    }
}
