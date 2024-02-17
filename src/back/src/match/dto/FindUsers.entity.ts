import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FindUsers {
	@Field(() => String)
	userId: string;

	@Field(() => String)
	username: string;
}
