import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SortedUsers {
    @Field(() => String)
    smallerId: string;

    @Field(() => String)
    biggerId: string;
}