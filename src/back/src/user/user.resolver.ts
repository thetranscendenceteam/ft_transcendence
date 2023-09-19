import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/createUser.input';
import { AddXp } from './dto/addXp.input';

@Resolver(of => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(returns => [User])
  user(): Promise<User[]> {
    return this.userService.getAllUser();
  }

  @Mutation(returns => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    if (!createUserInput.avatar) createUserInput.avatar = 'Default';
    return this.userService.createUser(createUserInput);
  }

  @Mutation(returns => User)
  addXpByNickname(@Args('addXp') addXp: AddXp): Promise<User> {
    return this.userService.addXpByNickname(addXp);
  }

  @Mutation(returns => String)
  async getJwt(@Args('input') inputCode: String): Promise<String | null> {
    try {
      const token = await this.userService.getJwt(inputCode);
      return token;
    } catch (error) {
      console.log('Error generating JWT:', error);
      return error;
    }
  }
}