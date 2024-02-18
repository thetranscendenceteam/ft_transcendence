import { Resolver, Query, Args, Mutation, Subscription, Context } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guards';
import { RequestWithUser } from 'src/user/dto/requestwithuser.interface';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { RelationshipService } from './relationship.service';
import { RelationshipForUser } from './dto/RelationshipForUser.entity';
import { RelationshipInput } from './dto/Relationship.input';
import { DetailRelationship } from './dto/DetailRelationship.entity';
import { RelationshipRequest } from './dto/RelationshipRequest.entity';
import { RedisPubSub } from 'graphql-redis-subscriptions';

const NEW_FRIENDREQUEST = 'newFriendRequest_';

@Resolver()
export class RelationshipResolver {
	constructor(private relationshipService: RelationshipService, @Inject(PUB_SUB) private pubSub: RedisPubSub) { }

	@Query((returns) => [RelationshipForUser])
	@UseGuards(GqlAuthGuard)
	getUserRelationship(
		@Context('req') req: RequestWithUser,
		@Args('userId', { type: () => String, nullable: false }) userId: string
	): Promise<RelationshipForUser[]> {
		const user = req.user;
		if (user.id !== userId) throw new Error("Unauthorized");
		return this.relationshipService.getUserRelationship(userId);
	}

	@Mutation((returns) => Boolean)
	@UseGuards(GqlAuthGuard)
	addFriend(
		@Context('req') req: RequestWithUser,
		@Args('relationshipInput') input: RelationshipInput
	): Promise<boolean> {
		const user = req.user;
		if (user.id !== input.userId) throw new Error("Unauthorized");
		return this.relationshipService.addFriend(input);
	}

	@Mutation((returns) => Boolean)
	@UseGuards(GqlAuthGuard)
	addBlocked(
		@Context('req') req: RequestWithUser,
		@Args('relationshipInput') input: RelationshipInput
	): Promise<boolean> {
		const user = req.user;
		if (user.id !== input.userId) throw new Error("Unauthorized");
		return this.relationshipService.addBlocked(input);
	}

	@Mutation((returns) => Boolean)
	@UseGuards(GqlAuthGuard)
	removeRelationship(
		@Context('req') req: RequestWithUser,
		@Args('relationshipInput') input: RelationshipInput
	): Promise<boolean> {
		const user = req.user;
		if (user.id !== input.userId) throw new Error("Unauthorized");
		return this.relationshipService.removeRelationship(input);
	}

	@Query((returns) => DetailRelationship)
	@UseGuards(GqlAuthGuard)
	findRelationshipBetweenUsers(
		@Context('req') req: RequestWithUser,
		@Args('relationshipInput') input: RelationshipInput
	): Promise<DetailRelationship> {
		const user = req.user;
		if (user.id !== input.userId) throw new Error("Unauthorized");
		return this.relationshipService.findRelationshipBetweenUsers(input);
	}

	@Query((returns) => [String])
	@UseGuards(GqlAuthGuard)
	findPendingFriendForUser(
		@Context('req') req: RequestWithUser,
		@Args('userId', { type: () => String, nullable: false }) userId: string
	): Promise<string[]> {
		const user = req.user;
		if (user.id !== userId) throw new Error("Unauthorized");
		return this.relationshipService.findPendingFriendForUser(userId);
	}

	@Query((returns) => [RelationshipRequest])
	@UseGuards(GqlAuthGuard)
	findPendingRequest(
		@Context('req') req: RequestWithUser,
		@Args('userId', { type: () => String, nullable: false }) userId: string
	): Promise<RelationshipRequest[]> {
		const user = req.user;
		if (user.id !== userId) throw new Error("Unauthorized");
		return this.relationshipService.findPendingRequest(userId);
	}

	@Subscription(() => RelationshipRequest)
	newPendingRequest(
		@Args('userId', { type: () => String, nullable: false }) userId: string
	) {
		return this.pubSub.asyncIterator(NEW_FRIENDREQUEST + userId);
	}

	@Mutation((returns) => Boolean)
	@UseGuards(GqlAuthGuard)
	acceptOrRefusePending(
		@Context('req') req: RequestWithUser,
		@Args('acceptOrNot', { type: () => Boolean, nullable: false }) accept: boolean,
		@Args('relationshipInput') input: RelationshipInput
	): Promise<boolean> {
		const user = req.user;
		if (user.id !== input.userId) throw new Error("Unauthorized");
		return this.relationshipService.acceptOrRefusePending(accept, input);
	}
}
