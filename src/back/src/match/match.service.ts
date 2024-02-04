import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserInMatch } from './dto/UserInMatch.entity';
import { MatchHistory } from './dto/MatchHistory.entity';

@Injectable()
export class MatchService {
    constructor(private prisma: PrismaService) { }

    async getUserMatchHistory(userId: string): Promise<MatchHistory[] | null> {
        try {
            const prismaMatch = await this.prisma.usersInMatchs.findMany({
                where: {
                    userId: userId,
                },
                include: {
                    match: {
                        include: {
                            score: true,
                        }
                    }
                }
            })
            if (!prismaMatch) return null;
            return await Promise.all(prismaMatch.map((m) => this.convertResultMatch(m)));

        }
        catch (e) {
            console.log("Error on getUserMatchHistory query" + e);
            throw e;
        }
    }

    async convertResultMatch(match: UserInMatch): Promise<MatchHistory> {
        let hMatch: MatchHistory = new MatchHistory;
        hMatch.matchId = match.matchId;
        hMatch.startedAt = match.match.startedAt;
        hMatch.isWin = match.isWin;
        hMatch.adversaryUsername = this.getAdversaryUsername(match.matchId, match.userId);
        if (match.match.score) {
            if (match.isWin) {
                hMatch.userScore = match.match.score.winnerScore;
                hMatch.adversaryScore = match.match.score.looserScore;
            } else {
                hMatch.userScore = match.match.score.looserScore;
                hMatch.adversaryScore = match.match.score.winnerScore;
            }
        }
        return hMatch;
    }

    async getAdversaryUsername(matchId: string, userId: string): Promise<string> {
        try {
            const user = await this.prisma.usersInMatchs.findFirst({
                where: {
                    matchId: matchId,
                    NOT: {
                        userId: userId,
                    }
                },
                include: {
                    user: true,
                }
            })
            if (!user) return "opponent not found";
            return user.user.pseudo;
        }
        catch (e) {
            console.log("Error in getAdversaryUsername" + e);
            throw e;
        }
    }

}
