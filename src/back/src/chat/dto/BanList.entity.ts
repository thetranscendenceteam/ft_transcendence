import { Field, ObjectType } from '@nestjs/graphql'
import { UsersInBanList } from './UsersInBanLists.entity';

@ObjectType()
export class BanList {
    @Field(() => String, { nullable: true })
    id: string;

    @Field(() => String, { nullable: true })
    chatId: string;

    @Field(() => Date, { nullable: true })
    lastChange: Date;

    @Field(() => [UsersInBanList], { nullable: true })
    UsersInBanLists: UsersInBanList[];
}