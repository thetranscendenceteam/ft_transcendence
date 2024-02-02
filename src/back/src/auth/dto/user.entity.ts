import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class authUser {
  @Field(() => String)
  id: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  realname: string;

  @Field(() => String)
  avatar_url: string;

  @Field(() => String)
  jwtToken: string;

}
