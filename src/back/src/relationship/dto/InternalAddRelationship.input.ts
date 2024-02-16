import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { RelationshipStatus } from '@prisma/client';

@ObjectType()
export class InternalAddRelationshipInput {
    @Field(() => String)
    firstId: string;

    @Field(() => String)
    secondId: string;

    @Field(() => RelationshipStatus)
    status: RelationshipStatus;
}

registerEnumType(RelationshipStatus, {
    name: 'RelationshipStatus'
})