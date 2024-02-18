import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RelationshipRequest {
    @Field(() => String, { nullable: true })
    userId: string;

	@Field(() => String, { nullable: true})
	username: string;
}
