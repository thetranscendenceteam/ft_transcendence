import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class GetUserInput {
  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => Int, { nullable: true })
  ftId: number;

  @Field(() => String, { nullable: true })
  pseudo: string;

  @Field(() => String, { nullable: true })
  mail: string;

  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => Int, { nullable: true })
  xp: number;
}
