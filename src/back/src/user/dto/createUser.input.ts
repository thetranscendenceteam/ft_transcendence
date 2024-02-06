import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => Int)
  ftId: number;

  @Field(() => String)
  mail: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  avatar: string;

  @Field(() => String)
  pseudo: string;

  @Field(() => String, { nullable: true })
  campus: string | null;
}
