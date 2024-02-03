import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => Int, { nullable: true })
  ftId: number;

  @Field(() => String, { nullable: true })
  pseudo: string;

  @Field(() => String, { nullable: true })
  mail: string;

  @Field(() => String, { nullable: true })
  password: string | null;

  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => String, { nullable: true })
  avatar: string;

  @Field(() => Int, { nullable: true })
  xp: number;

  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  modifiedAt: Date;

  @Field(() => Int, { nullable: true })
  count: number;
}
