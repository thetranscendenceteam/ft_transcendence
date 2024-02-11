import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserPrivate {
    @Field(() => String, { nullable: true })
    pseudo: string;

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

    @Field(() => String, { nullable: true })
    campus: string | null;
}
