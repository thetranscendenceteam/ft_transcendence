import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserInMatch } from './dto/UserInMatch.entity';
import { MatchHistory } from './dto/MatchHistory.entity';
import { CreateOrFindMatchInput } from './dto/CreateOrFindMatch.input';
import { Match } from './dto/Match.entity';
import { CreateMatchInput } from './dto/CreateMatch.input';
import { SetMatchScoreInput } from './dto/SetMatchScore.input';
import { AddUserInMatch } from './dto/AddUserInMatch.input';
import { SettingsOfMatch } from './dto/SettingsOfMatch.entity';
import { AddXpInput } from './dto/AddXp.input';
import { FindUsers } from './dto/FindUsers.entity';

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
				//this.startMatch(findMatch.id, input.userId);
				this.addUserInMatch({ matchId: findMatch.id, userId: input.userId });
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

	// async saveOrUpdateMatch(input: SaveOrUpdateMatchInput): Promise<Match> {
	//     try {
	//         const date = new Date();
	//         const res = await this.prisma.matchs.update({
	//             where: {
	//                 id: input.id,
	//             },
	//             data: {
	//                 score: {
	//                     update: {
	//                         where: {
	//                             matchId: input.id,
	//                         },
	//                         data: {
	//                             winnerScore: input.score.winnerScore,
	//                             looserScore: input.score.looserScore,
	//                         },
	//                     },
	//                 },
	//                 finishedAt: date.toISOString(),
	//                 users: {
	//                     update: {
	//                         where: {
	//                             userId_matchId: {
	//                                 matchId: input.id,
	//                                 userId: input.winnerId,
	//                             }
	//                         },
	//                         data: {
	//                             isWin: true,
	//                         },
	//                     },
	//                 }
	//             },
	//             include: {
	//                 score: true,
	//             }
	//         })
	//         return res;
	//     }
	//     catch (e) {
	//         console.log("Error on saveOrUpdateMatch query");
	//         throw e;
	//     }
	// }

	async findUnstartedMatches(): Promise<Match[]> {
		try {
			const res = await this.prisma.matchs.findMany({
				where: {
					startedAt: null,
				},
				include: {
					score: true,
				}
			});
			return res;
		}
		catch (e) {
			console.log("Error on findUnstartedMatches query");
			throw e;
		}
	}

	async findUngoingMatches(): Promise<Match[]> {
		try {
			const res = await this.prisma.matchs.findMany({
				where: {
					NOT: [{ startedAt: null, },],
					finishedAt: null,
				},
				include: {
					score: true,
				},
			});
			return res;
		}
		catch (e) {
			console.log("Error on findUngoingMatches query");
			throw e;
		}
	}

	async findFinishedMatches(): Promise<Match[]> {
		try {
			const res = await this.prisma.matchs.findMany({
				where: {
					NOT: [
						{ startedAt: null },
						{ finishedAt: null },
					],
				},
				include: {
					score: true,
				}
			});
			return res;
		}
		catch (e) {
			console.log("Error on findFinishedMatches query");
			throw e;
		}
	}

	async findUnstartedMatchesForUser(userId: string): Promise<Match[]> {
		try {
			const res = await this.prisma.usersInMatchs.findMany({
				where: {
					userId: userId,
					match: {
						startedAt: null,
					},
				},
				include: {
					match: {
						include: {
							score: true,
						},
					},
				},
			});
			let matches: Match[] = [];
			res.forEach(um => {
				matches.push(um.match);
			});
			return matches;
		}
		catch (e) {
			console.log("Error on findUnstartedMatches query");
			throw e;
		}
	}

	async findUngoingMatchesForUser(userId: string): Promise<Match[]> {
		try {
			const res = await this.prisma.usersInMatchs.findMany({
				where: {
					userId: userId,
					match: {
						NOT: [{ startedAt: null, },],
						finishedAt: null,
					},
				},
				include: {
					match: {
						include: {
							score: true,
						},
					},
				},
			});
			let matches: Match[] = [];
			res.forEach((um) => {
				matches.push(um.match);
			});
			return matches;
		}
		catch (e) {
			console.log("Error on findUngoingMatches query");
			throw e;
		}
	}

	async findFinishedMatchesForUser(userId: string): Promise<Match[]> {
		try {
			const res = await this.prisma.usersInMatchs.findMany({
				where: {
					userId: userId,
					match: {
						NOT: [
							{ startedAt: null },
							{ finishedAt: null },
						],
					},
				},
				include: {
					match: {
						include: {
							score: true,
						},
					},
				},
			});
			let matches: Match[] = [];
			res.forEach((um) => {
				matches.push(um.match);
			});
			return matches;
		}
		catch (e) {
			console.log("Error on findFinishedMatches query");
			throw e;
		}
	}

	async createMatch(input: CreateMatchInput): Promise<Match> {
		try {
			const res = await this.prisma.matchs.create({
				data: {
					difficulty: input.difficulty,
					score: {
						create: {
							bestOf: input.bestOf,
						},
					},
				},
				include: {
					score: true,
				}
			});
			return res;
		}
		catch (e) {
			console.log("Error on createMatch");
			throw e;
		}
	}

	async setMatchAsStarted(matchId: string): Promise<Match> {
		try {
			const res = await this.prisma.matchs.update({
				where: {
					id: matchId,
				},
				data: {
					startedAt: new Date().toISOString(),
				},
				include: {
					score: true,
				}
			});
			return res;
		}
		catch (e) {
			console.log("Error on setMatchAsStarted");
			throw e;
		}
	}

	async setMatchAsFinished(matchId: string): Promise<Match> {
		try {
			const res = await this.prisma.matchs.update({
				where: {
					id: matchId,
				},
				data: {
					finishedAt: new Date().toISOString(),
				},
				include: {
					score: true,
				},
			});
			return res;
		}
		catch (e) {
			console.log("Error on setMatchAsFinished");
			throw e;
		}
	}

	async setMatchScore(input: SetMatchScoreInput): Promise<Match> {
		try {
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
					users: {
						update: {
							where: {
								userId_matchId: {
									userId: input.winnerId,
									matchId: input.id,
								},
							},
							data: {
								isWin: true,
							},
						},
					},
				},
				include: {
					score: true,
				}
			});
			return res;
		}
		catch (e) {
			console.log("Error on setMatchScore");
			throw e;
		}
	}

	async findUsersInMatch(matchId: string): Promise<FindUsers[]> {
		try {
			const query = await this.prisma.usersInMatchs.findMany({
				where: {
					matchId: matchId,
				},
				include: {
					user: true,
				},
			});
			let res: FindUsers[] = [];
			query.forEach((q) => {
				let temp: FindUsers = new FindUsers();
				temp.userId = q.user.id;
				temp.username = q.user.pseudo;
				res.push(temp);
			});
			return res;
		}
		catch (e) {
			console.log("Error on findUsersInMatch");
			throw e;
		}
	}

	async addUserInMatch(input: AddUserInMatch): Promise<Match> {
		try {
			const res = await this.prisma.matchs.update({
				where: {
					id: input.matchId,
				},
				data: {
					users: {
						connectOrCreate: {
							where: {
								userId_matchId: {
									matchId: input.matchId,
									userId: input.userId,
								},
							},
							create: {
								userId: input.userId,
							},
						},
					},
				},
				include: {
					score: true,
				}
			});
			return res;
		}
		catch (e) {
			console.log("Error on addUserInMatch");
			throw e;
		}
	}

	async getSettingsOfMatch(matchId: string): Promise<SettingsOfMatch> {
		try {
			const query = await this.prisma.matchs.findFirst({
				where: {
					id: matchId,
				},
				select: {
					difficulty: true,
					score: true,
				},
			});
			let res: SettingsOfMatch = new SettingsOfMatch();
			res.bestOf = query?.score?.bestOf;
			res.difficulty = query?.difficulty;
			return res;
		}
		catch (e) {
			console.log("Error on getSettingsOfMatch");
			throw e;
		}
	}

	async addXpPostMatch(input: AddXpInput): Promise<boolean> {
		try {
			const res = await this.prisma.users.update({
				where: {
					id: input.userId,
				},
				data: {
					xp: {
						increment: input.xp,
					},
					modifiedAt: new Date().toISOString(),
					count: {
						increment: 1,
					}
				},
			});
			if (!res) return false;
			return true;
		}
		catch (e) {
			console.log("Error on addXpPostMatch");
			throw e;
		}
	}

	async deleteMatch(matchId: string): Promise<boolean> {
		try {
			const res = await this.prisma.matchs.delete({
				where: {
					id: matchId,
				}
			});
			if (!res) return false;
			return true;
		}
		catch (e) {
			console.log("Error on deleteMatch");
			throw e;
		}
	}
}
