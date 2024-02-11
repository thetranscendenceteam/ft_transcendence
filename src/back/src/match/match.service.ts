import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserInMatch } from './dto/UserInMatch.entity';
import { MatchHistory } from './dto/MatchHistory.entity';
import { CreateOrFindMatchInput } from './dto/CreateOrFindMatch.input';
import { SaveOrUpdateMatchInput } from './dto/SaveOrUpdateMatch.input';
import { Match } from './dto/Match.entity';

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
        hMatch.createdAt = match.match.createdAt;
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

    async isUserInMatch(userId: string): Promise<string | null> {
        try {
            const res = await this.prisma.matchs.findFirst({
                where: {
                    OR: [
                        { startedAt: null },
                        { finishedAt: null },
                    ],
                    users: {
                        some: {
                            userId: userId,
                        }
                    }
                },
            });
            if (!res) return null;
            return res.id;
        }
        catch (e) {
            console.log("Error on isUserInMatch");
            throw e;
        }
    }

    async createOrFindMatch(input: CreateOrFindMatchInput): Promise<string> {
        try {
            // Find match with searched parameter
            const findMatch = await this.prisma.matchs.findFirst({
                where: {
                    startedAt: null,
                    difficulty: input.difficulty,
                    score: {
                        bestOf: input.bestOf,
                    }
                },
            });
            if (findMatch) {
                this.startMatch(findMatch.id, input.userId);
                return findMatch.id;
            }
            // Create Match if not match found
            const newMatch = await this.prisma.matchs.create({
                data: {
                    difficulty: input.difficulty,
                    score: {
                        create: {
                            bestOf: input.bestOf,
                        }
                    },
                    users: {
                        create: {
                            userId: input.userId
                        }
                    }
                }
            })
            return newMatch.id;
        }
        catch (e) {
            console.log("Error on createOrFindMatch");
            throw e;
        }
    }

    async startMatch(matchId: string, joinUserId: string) {
        try {
            const date = new Date();
            await this.prisma.matchs.update({
                where: {
                    id: matchId,
                },
                data: {
                    startedAt: date.toISOString(),
                    users: {
                        create: {
                            userId: joinUserId,
                        },
                    },
                },
                include: {
                    users: true,
                }
            });
        }
        catch (e) {
            console.log("Error on startMatch query");
            throw e;
        }
    }

    async saveOrUpdateMatch(input: SaveOrUpdateMatchInput): Promise<Match> {
        try {
            const date = new Date();
            const res = await this.prisma.matchs.update({
                where: {
                    id: input.id,
                },
                data: {
                    score: {
                        update: {
                            where: {
                                matchId: input.id,
                            },
                            data: {
                                winnerScore: input.score.winnerScore,
                                looserScore: input.score.looserScore,
                            },
                        },
                    },
                    finishedAt: date.toISOString(),
                    users: {
                        update: {
                            where: {
                                userId_matchId: {
                                    matchId: input.id,
                                    userId: input.winnerId,
                                }
                            },
                            data: {
                                isWin: true,
                            },
                        },
                    }
                },
                include: {
                    score: true,
                }
            })
            return res;
        }
        catch (e) {
            console.log("Error on saveOrUpdateMatch query");
            throw e;
        }
    }

}
