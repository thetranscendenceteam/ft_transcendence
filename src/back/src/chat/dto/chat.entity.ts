import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Chat {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    createdAt: Date;

    @Field(() => Boolean)
    isPrivate: boolean;
}