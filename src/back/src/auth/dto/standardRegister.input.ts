import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class StandardRegisterInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  firstname: string;

  @Field(() => String)
  lastname: string;

  @Field(() => String)
  mail: string;

  @Field(() => String)
  password: string;
}
