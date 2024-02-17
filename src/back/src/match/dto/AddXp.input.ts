import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddXpInput {
	@Field(() => String)
	userId: string;

	@Field(() => Int)
	xp: number;
}
