import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddXp {
  @Field(() => String)
  id: string;

  @Field(() => Int)
  xp: number;
}
