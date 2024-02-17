import { Injectable } from '@nestjs/common';
import { RelationshipStatus, UsersRelationships } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { RelationshipForUser } from './dto/RelationshipForUser.entity';
import { RelationshipInput } from './dto/Relationship.input';
import { SortedUsers } from './dto/sortedUsersIds.entity';
import { InternalAddRelationshipInput } from './dto/InternalAddRelationship.input';

@Injectable()
export class RelationshipService {
    constructor(private prisma: PrismaService) { }

    async getUserRelationship(userId: string) {
        try {
            const res = await this.prisma.usersRelationships.findMany({
                where: {
                    OR: [
                        { firstId: userId },
                        { secondId: userId },
                    ],
                },
            });
            return await this.mapUser(userId, res);
        }
        catch (e) {
            console.log("Error on getUserRelationship query");
            throw e;
        }
    }

    async mapUser(userId: string, input: UsersRelationships[]) {
        let res: RelationshipForUser[] = [];
        await Promise.all(input.map(async (r) => {
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
        }));
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
				}
			});
			return res?.avatar;
		}
		catch (e) {
			console.log("Error on internalGetAvatarById");
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
		}
		catch (e) {
			console.log("Error on internalGetUsernameById");
			throw e;
		}
	}

    async addFriend(input: RelationshipInput): Promise<boolean> {
        const usersIds = await this.sortUsersIds(input.userId, input.targetId);
        let internalInput: InternalAddRelationshipInput = new InternalAddRelationshipInput();
        internalInput.firstId = usersIds.smallerId;
        internalInput.secondId = usersIds.biggerId;
        if (await this.determinePendingInvite(input.userId, usersIds))
            internalInput.status = RelationshipStatus.pending_first_to_second;
        else
            internalInput.status = RelationshipStatus.pending_second_to_first;
        try {
            const res = await this.internalAddRelationship(internalInput);
            return res;
        }
        catch (e) {
            console.log("Error on addFriend");
            throw e;
        }
    }

    async addBlocked(input: RelationshipInput): Promise<boolean> {
        const usersIds = await this.sortUsersIds(input.userId, input.targetId);
        let internalInput: InternalAddRelationshipInput = new InternalAddRelationshipInput();
        internalInput.firstId = usersIds.smallerId;
        internalInput.secondId = usersIds.biggerId;
        if (await this.determinePendingInvite(input.userId, usersIds))
            internalInput.status = RelationshipStatus.block_first_to_second;
        else
            internalInput.status = RelationshipStatus.block_second_to_first;
        try {
            const res = await this.internalAddRelationship(internalInput);
            return res;
        }
        catch (e) {
            console.log("Error on addFriend");
            throw e;
        }
    }

    async internalAddRelationship(input: InternalAddRelationshipInput): Promise<boolean> {
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
        }
        catch (e) {
            console.log("Error on internalAddFriend");
            throw e;
        }
    }

    async determinePendingInvite(baseUser: string, sorted: SortedUsers) {
        if (baseUser === sorted.smallerId)
            return true;
        else
            return false;
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
            const relation = await this.prisma.usersRelationships.findFirst({
                where: {
                    firstId: users.smallerId,
                    secondId: users.biggerId,
                },
            });
            if (!relation) return false;
            const res = await this.prisma.usersRelationships.delete({
                where: {
                    id: relation.id,
                },
            });
            return true;
        }
        catch (e) {
            console.log("Error on removeFriends");
            throw e;
        }
    }

    async findRelationshipBetweenUsers(input: RelationshipInput): Promise<RelationshipStatus | undefined> {
        try {
            const users = await this.sortUsersIds(input.userId, input.targetId);
            const res = await this.prisma.usersRelationships.findFirst({
                where: {
                    firstId: users.smallerId,
                    secondId: users.biggerId,
                },
                select: {
                    status: true,
                },
            });
            return res?.status;
        }
        catch (e) {
            console.log("Error on findRelationshipBetweenUsers");
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
            })
            return res;
        }
        catch (e) {
            console.log("Error on findPendingFriendForUser");
            throw e;
        }
    }

}
