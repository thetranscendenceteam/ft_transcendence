import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @Field()
  id: string;

  @Field(() => Int)
  ftId: number;

  @Field()
  pseudo: string;

  @Field()
  mail: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  avatar: string;

  @Field(() => Int)
  xp: number;

  @Field()
  createdAt: Date;

  @Field()
  modifiedAt: Date;

  @Field(() => Int)
  count: number;
}
