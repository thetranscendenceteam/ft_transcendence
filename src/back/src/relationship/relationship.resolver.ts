import { Resolver, Query, Args, Mutation, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
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
  constructor(private relationshipService: RelationshipService, @Inject(PUB_SUB) private pubSub: RedisPubSub) {}

  @Query((returns) => [RelationshipForUser])
  getUserRelationship(
    @Args('userId', { type: () => String, nullable: false }) userId: string,
  ): Promise<RelationshipForUser[]> {
    return this.relationshipService.getUserRelationship(userId);
  }

  @Mutation((returns) => Boolean)
  addFriend(
    @Args('relationshipInput') input: RelationshipInput,
  ): Promise<boolean> {
    return this.relationshipService.addFriend(input);
  }

  @Mutation((returns) => Boolean)
  addBlocked(
    @Args('relationshipInput') input: RelationshipInput,
  ): Promise<boolean> {
    return this.relationshipService.addBlocked(input);
  }

  @Mutation((returns) => Boolean)
  removeRelationship(
    @Args('relationshipInput') input: RelationshipInput,
  ): Promise<boolean> {
    return this.relationshipService.removeRelationship(input);
  }

  @Query((returns) => DetailRelationship)
  findRelationshipBetweenUsers(
    @Args('relationshipInput') input: RelationshipInput,
  ): Promise<DetailRelationship> {
    return this.relationshipService.findRelationshipBetweenUsers(input);
  }

  @Query((returns) => [String])
  findPendingFriendForUser(
    @Args('userId', { type: () => String, nullable: false }) userId: string,
  ): Promise<string[]> {
    return this.relationshipService.findPendingFriendForUser(userId);
  }

  @Query((returns) => [RelationshipRequest])
  findPendingRequest(
    @Args('userId', { type: () => String, nullable: false }) userId: string,
  ): Promise<RelationshipRequest[]> {
    return this.relationshipService.findPendingRequest(userId);
  }

  @Subscription(() => RelationshipRequest)
  newPendingRequest(
    @Args('userId', { type: () => String, nullable: false }) userId: string,
  ) {
    return this.pubSub.asyncIterator(NEW_FRIENDREQUEST + userId);
  }

  @Mutation((returns) => Boolean)
  acceptOrRefusePending(
    @Args('acceptOrNot', { type: () => Boolean, nullable: false })
    accept: boolean,
    @Args('relationshipInput') input: RelationshipInput,
  ): Promise<boolean> {
    return this.relationshipService.acceptOrRefusePending(accept, input);
  }
}
