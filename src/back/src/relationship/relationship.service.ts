import { Inject, Injectable } from '@nestjs/common';
import { RelationshipStatus, UsersRelationships } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { RelationshipForUser } from './dto/RelationshipForUser.entity';
import { RelationshipInput } from './dto/Relationship.input';
import { SortedUsers } from './dto/sortedUsersIds.entity';
import { InternalAddRelationshipInput } from './dto/InternalAddRelationship.input';
import { DetailRelationship } from './dto/DetailRelationship.entity';
import { RelationshipRequest } from './dto/RelationshipRequest.entity';
import { FriendRequestForSub } from './dto/FriendRequest';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';

const NEW_FRIENDREQUEST = 'newFriendRequest_';

@Injectable()
export class RelationshipService {
	constructor(private prisma: PrismaService, @Inject(PUB_SUB) private pubSub: RedisPubSub) {}

	async getUserRelationship(userId: string) {
		try {
			const res = await this.prisma.usersRelationships.findMany({
				where: {
					OR: [{ firstId: userId }, { secondId: userId }],
				},
			});
			return await this.mapUser(userId, res);
		} catch (e) {
			console.log('Error on getUserRelationship query');
			throw e;
		}
	}

	async mapUser(userId: string, input: UsersRelationships[]) {
		let res: RelationshipForUser[] = [];
		await Promise.all(
			input.map(async (r) => {
				let t = new RelationshipForUser();
				t.userId = userId;
				if (r.firstId != userId) t.relationId = r.firstId;
				else t.relationId = r.secondId;
				t.status = r.status;
				t.createdAt = r.createdAt;
				t.updatedAt = r.updatedAt;
				await this.internalGetUsernameById(t.relationId).then((r) => {
					t.relationUsername = r;
				});
				await this.internalGetAvatarById(t.relationId).then((r) => {
					t.avatar = r;
				});
				res.push(t);
			}),
		);
		return res;
	}

	async internalGetAvatarById(relationId: string) {
		try {
			const res = await this.prisma.users.findFirst({
				where: {
					id: relationId,
				},
				select: {
					avatar: true,
				},
			});
			return res?.avatar;
		} catch (e) {
			console.log('Error on internalGetAvatarById');
			throw e;
		}
	}

	async internalGetUsernameById(relationId: string) {
		try {
			const res = await this.prisma.users.findFirst({
				where: {
					id: relationId,
				},
				select: {
					pseudo: true,
				},
			});
			console.log(res);
			return res?.pseudo;
		} catch (e) {
			console.log('Error on internalGetUsernameById');
			throw e;
		}
	}

	async addFriend(input: RelationshipInput): Promise<boolean> {
		const usersIds = await this.sortUsersIds(input.userId, input.targetId);
		let internalInput: InternalAddRelationshipInput =
			new InternalAddRelationshipInput();
		internalInput.firstId = usersIds.smallerId;
		internalInput.secondId = usersIds.biggerId;
		if (await this.determinePendingInvite(input.userId, usersIds))
			internalInput.status = RelationshipStatus.pending_first_to_second;
		else internalInput.status = RelationshipStatus.pending_second_to_first;
		try {
			const res = await this.internalAddRelationship(internalInput);

			const user = await this.prisma.users.findFirst({
				where: {
					id: input.userId,
				},
				select: {
					pseudo: true,
				},
			});
			if (user) {
				const resSub: FriendRequestForSub = new FriendRequestForSub();
				resSub.userId = input.userId;
				resSub.username = user.pseudo;
				this.pubSub.publish(NEW_FRIENDREQUEST + input.targetId, { newPendingRequest: resSub });
			}

			return res;
		} catch (e) {
			console.log('Error on addFriend');
			throw e;
		}
	}

	async addBlocked(input: RelationshipInput): Promise<boolean> {
		const usersIds = await this.sortUsersIds(input.userId, input.targetId);
		let internalInput: InternalAddRelationshipInput =
			new InternalAddRelationshipInput();
		internalInput.firstId = usersIds.smallerId;
		internalInput.secondId = usersIds.biggerId;
		if (await this.determinePendingInvite(input.userId, usersIds))
			internalInput.status = RelationshipStatus.block_first_to_second;
		else internalInput.status = RelationshipStatus.block_second_to_first;
		try {
			const res = await this.internalAddRelationship(internalInput);
			return res;
		} catch (e) {
			console.log('Error on addFriend');
			throw e;
		}
	}

	async internalAddRelationship(
		input: InternalAddRelationshipInput,
	): Promise<boolean> {
		try {
			const res = await this.prisma.usersRelationships.create({
				data: {
					firstId: input.firstId,
					secondId: input.secondId,
					status: input.status,
					updatedAt: new Date().toISOString(),
				},
			});
			if (res) return true;
			return false;
		} catch (e) {
			console.log('Error on internalAddFriend');
			throw e;
		}
	}

	async determinePendingInvite(baseUser: string, sorted: SortedUsers) {
		if (baseUser === sorted.smallerId) return true;
		else return false;
	}

	async sortUsersIds(user1: string, user2: string): Promise<SortedUsers> {
		let res: SortedUsers = new SortedUsers();
		if (user1 < user2) {
			res.smallerId = user1;
			res.biggerId = user2;
		} else {
			res.smallerId = user2;
			res.biggerId = user1;
		}
		return res;
	}

	async removeRelationship(input: RelationshipInput): Promise<boolean> {
		try {
			const users = await this.sortUsersIds(input.userId, input.targetId);
			// Find if there is a relationship between those users
			const relation = await this.prisma.usersRelationships.findFirst({
				where: {
					firstId: users.smallerId,
					secondId: users.biggerId,
				},
			});
			if (!relation) return false;
			// Delete relationship if it exists
			const res = await this.prisma.usersRelationships.delete({
				where: {
					id: relation.id,
				},
			});
			// Delete whisper channel if thoses users had one
			const chan = await this.prisma.chats.findFirst({
				where: {
					isWhisper: true,
					users: {
						some: {
							OR: [{ userId: input.userId }, { userId: input.targetId }],
						},
					},
				},
			});
			console.log(chan);
			if (!chan) return true;
			await this.prisma.chats.delete({
				where: {
					id: chan.id,
				},
			});
			return true;
		} catch (e) {
			console.log('Error on removeFriends');
			throw e;
		}
	}

	async findRelationshipBetweenUsers(
		input: RelationshipInput,
	): Promise<DetailRelationship> {
		try {
			const users = await this.sortUsersIds(input.userId, input.targetId);
			const query = await this.prisma.usersRelationships.findFirst({
				where: {
					firstId: users.smallerId,
					secondId: users.biggerId,
				},
			});
			if (!query) return new DetailRelationship();
			console.log(query);
			let res: DetailRelationship = new DetailRelationship();
			res.user1 = query.firstId;
			res.user2 = query.secondId;
			res.status = query.status;
			return res;
		} catch (e) {
			console.log('Error on findRelationshipBetweenUsers');
			throw e;
		}
	}

	async findPendingFriendForUser(userId: string): Promise<string[]> {
		try {
			const query = await this.prisma.usersRelationships.findMany({
				where: {
					firstId: userId,
					status: RelationshipStatus.pending_second_to_first,
				},
			});
			const query2 = await this.prisma.usersRelationships.findMany({
				where: {
					secondId: userId,
					status: RelationshipStatus.pending_first_to_second,
				},
			});
			let res: string[] = [];
			query.forEach((q) => {
				res.push(q.secondId);
			});
			query2.forEach((q) => {
				res.push(q.firstId);
			});
			return res;
		} catch (e) {
			console.log('Error on findPendingFriendForUser');
			throw e;
		}
	}

	async findPendingRequest(userId: string): Promise<RelationshipRequest[]> {
		try {
			const query = await this.prisma.usersRelationships.findMany({
				where: {
					secondId: userId,
					status: RelationshipStatus.pending_first_to_second,
				},
			});
			const res: RelationshipRequest[] = [];
			for (const q of query) {
				const user = await this.prisma.users.findFirst({
					where: {
						id: q.firstId,
					},
				});
				if (user) {
					const r = {
						userId: q.firstId,
						username: user?.pseudo,
					};
					res.push(r);
				}
			}
			return res;
		} catch (e) {
			console.log('Error on findPendingFriendForUser');
			throw e;
		}
	}

	async acceptOrRefusePending(accept: boolean, input: RelationshipInput): Promise<boolean> {
		try {
			const users = await this.sortUsersIds(input.userId, input.targetId);
			const query = await this.prisma.usersRelationships.findFirst({
				where: {
					firstId: users.smallerId,
					secondId: users.biggerId,
				},
			});
			if (!query) return false;
			if (accept) {
				const res = await this.prisma.usersRelationships.update({
					where: {
						id: query.id,
					},
					data: {
						status: RelationshipStatus.friends,
					},
				});
				if (!res) return false;
				await this.createWhisperChat(input);
			}
			else {
				const res = await this.prisma.usersRelationships.delete({
					where: {
						id: query.id,
					},
				});
			}
			return true;
		}
		catch (e) {
			console.log("Error on acceptOrRefusePending");
			throw e;
		}
	}

	async createWhisperChat(input: RelationshipInput) {
		try {
			let name = "Whisper_";
			name = name + await this.internalGetUsernameById(input.userId) + "_" + await this.internalGetUsernameById(input.targetId);
			const res = await this.prisma.chats.create({
				data: {
					name: name,
					isPrivate: false,
					isWhisper: true,
					users: {
						create: [
							{ userId: input.userId },
							{ userId: input.targetId },
						],
					},
				},
			});
		}
		catch (e) {
			console.log("Error on createWhisperChat");
			throw e;
		}
	}
}
