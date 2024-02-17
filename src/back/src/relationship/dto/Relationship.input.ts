import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RelationshipInput {
    @Field(() => String)
    userId: string;

    @Field(() => String)
    targetId: string;
}
