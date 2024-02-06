import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class EditUserInput {
  @Field(() => String, { nullable: true })
  id: string | undefined;

  @Field(() => String, { nullable: true })
  mail: string | null;

  @Field(() => String, { nullable: true })
  password: string | null;

  @Field(() => String, { nullable: true })
  firstName: string | null;

  @Field(() => String, { nullable: true })
  lastName: string | null;

  @Field(() => String, { nullable: true })
  avatar: string | null;

  @Field(() => String, { nullable: true })
  pseudo: string | null;
}
