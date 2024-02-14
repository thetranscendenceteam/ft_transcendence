import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { RelationshipStatus } from '@prisma/client';

@ObjectType()
export class Relationship {
    @Field(() => String, { nullable: true })
    id: string;

    @Field(() => String, { nullable: true })
    firstId: string;

    @Field(() => String, { nullable: true })
    secondId: string;

    @Field(() => RelationshipStatus, { nullable: true })
    status: RelationshipStatus;

    @Field(() => Date, { nullable: true })
    createdAt: Date;

    @Field(() => Date, { nullable: true })
    updatedAt: Date;
}

registerEnumType(RelationshipStatus, {
    name: 'RelationshipStatus'
})