import { Field, ObjectType } from '@nestjs/graphql'
import { Users } from '@prisma/client';
import { User } from 'src/user/dto/user.entity';

@ObjectType()
export class Chat {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field(() => String, { nullable: true })
    password: String | null;

    @Field()
    createdAt: Date;

    @Field(() => [User], { nullable: true })
    users: User[];
}