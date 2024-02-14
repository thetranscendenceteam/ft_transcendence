import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RelationshipForUser {
    @Field(() => String, { nullable: true })
    userId: string;

    @Field(() => String, { nullable: true })
    relationId: string;

    @Field(() => String, { nullable: true })
    status: string;

    @Field(() => Date, { nullable: true })
    createdAt: Date;

    @Field(() => Date, { nullable: true })
    updatedAt: Date;
}