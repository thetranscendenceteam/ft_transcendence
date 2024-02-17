import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { RelationshipStatus } from '@prisma/client';

@ObjectType()
export class DetailRelationship {
    @Field(() => String, {nullable: true})
    user1: string;

    @Field(() => String, {nullable: true})
    user2: string;

    @Field(() => RelationshipStatus, {nullable: true})
    status: RelationshipStatus;
}

registerEnumType(RelationshipStatus, {
    name: 'RelationshipStatus'
})
