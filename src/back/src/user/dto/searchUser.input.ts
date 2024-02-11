import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SearchUser {
  @Field(() => String)
  name: string;

  @Field(() => String)
  id: string;
}

@InputType()
export class SearchUserInput {
  @Field(() => String, { nullable: true })
  name: string | null;
}
