import { Resolver, Query, Args } from '@nestjs/graphql';
import { RelationshipService } from './relationship.service';
import { RelationshipForUser } from './dto/RelationshipForUser.entity';

@Resolver()
export class RelationshipResolver {
    constructor(private relationshipService: RelationshipService) { }

    // @Query(returns => [RelationshipForUser])
    // getUserRelationship(
    //     @Args('userId', { type: () => String, nullable: false }) userId: string,
    // ): Promise<RelationshipForUser[]> {
    //     return this.relationshipService.getUserRelationship(userId);
    // }

}
