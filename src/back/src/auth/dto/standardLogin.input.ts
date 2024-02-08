import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class StandardLoginInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;

  @Field(() => String, { nullable: true })
  twoFactorCode: string | null;
}
