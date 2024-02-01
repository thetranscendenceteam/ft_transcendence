import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { Users } from '@prisma/client';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/createUser.input';
import { AddXp } from './dto/addXp.input';
import { GetUserInput } from './dto/getUser.input';
import { User } from './dto/user.entity';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) { }

  @Query(returns => [User])
  getUsers(
    @Args('max', { type: () => Int, nullable: true }) max: number | undefined,
  ): Promise<Users[]> {
    return this.userService.getAllUser(max);
  }

  @Query(returns => User)
  async getUser(
    @Args('UserInput') userInput: GetUserInput,
  ): Promise<Users | null> {
    return this.userService.getUser(userInput);
  }

  @Mutation(returns => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<Users> {
    if (!createUserInput.avatar) createUserInput.avatar = 'Default';
    return this.userService.createUser(createUserInput);
  }

  @Mutation(returns => User)
  addXpByNickname(@Args('addXp') addXp: AddXp): Promise<Users> {
    return this.userService.addXpByNickname(addXp);
  }

  @Mutation(returns => String)
  async getFtAuth(@Args('code') code: string): Promise<string | null> {
    const result = await this.userService.getJwt(code);
    if (result === null) {
      throw new Error('Invalid code or null response');
    }
    return result;
  }
}
