import { Field, ObjectType } from '@nestjs/graphql'
import { UserPrivate } from 'src/user/dto/userPrivate.entity';
import { UsersInBanList } from './UsersInBanLists.entity';

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

    @Field(() => [UserPrivate], { nullable: true })
    users: UserPrivate[];

    @Field(() => [UsersInBanList], { nullable: true })
    UsersInBanLists: UsersInBanList[];
}