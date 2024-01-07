import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddXp {
  @Field()
  nickname: string;

  @Field(type => Int)
  xp: number;
}
