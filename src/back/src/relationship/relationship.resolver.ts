import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { RelationshipService } from './relationship.service';
import { RelationshipForUser } from './dto/RelationshipForUser.entity';
import { RelationshipInput } from './dto/Relationship.input';
import { DetailRelationship } from './dto/DetailRelationship.entity';
import { RelationshipStatus } from '@prisma/client';
import { RelationshipRequest } from './dto/RelationshipRequest.entity';

@Resolver()
export class RelationshipResolver {
  constructor(private relationshipService: RelationshipService) {}

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

  @Mutation((returns) => Boolean)
  acceptOrRefusePending(
    @Args('acceptOrNot', { type: () => Boolean, nullable: false })
    accept: boolean,
    @Args('relationshipInput') input: RelationshipInput,
  ): Promise<boolean> {
    return this.relationshipService.acceptOrRefusePending(accept, input);
  }
}
