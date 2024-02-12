import { Field, ObjectType } from '@nestjs/graphql'
import { BigIntStatsListener } from 'fs';
import { UserPrivate } from 'src/user/dto/userPrivate.entity';
import { BanList } from './BanList.entity';

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

    @Field(() => BanList, { nullable: true })
    banList: BanList;
}