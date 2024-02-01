import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Chat {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field(() => String, { nullable: true })
    password: String;

    @Field()
    createdAt: Date;
}