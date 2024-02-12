import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/createUser.input';
import { AddXp } from './dto/addXp.input';
import { GetUserInput } from './dto/getUser.input';
import { User } from './dto/user.entity';
import { UpdateUser } from './dto/updateUser.input';
import { EditUserInput } from './dto/editUser.input';
import { SearchUser, SearchUserInput } from './dto/searchUser.input';
import { UserPrivate } from './dto/userPrivate.entity';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) { }

  @Query(returns => [UserPrivate])
  getUsers(
    @Args('max', { type: () => Int, nullable: true }) max: number | undefined,
  ): Promise<UserPrivate[]> {
    console.log("getUsers with max arg : " + max);
    return this.userService.getAllUser(max);
  }

  @Query(returns => User)
  async getUser(
    @Args('UserInput') userInput: GetUserInput,
  ): Promise<User | null> {
    return this.userService.getUser(userInput);
  }

  @Query(returns => [SearchUser])
  async searchUser(
    @Args('UserInput') userInput: SearchUserInput,
  ): Promise<SearchUser[] | null> {
    return this.userService.searchUser(userInput);
  }

  @Mutation(returns => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User | null> {
    if (!createUserInput.avatar) createUserInput.avatar = 'Default';
    return this.userService.createUser(createUserInput);
  }

  @Mutation(returns => User)
  editUser(
    @Args('editUserInput') editUserInput: EditUserInput,
  ): Promise<User> {
    return this.userService.editUser(editUserInput);
  }

  @Mutation(returns => User)
  updateUser(
    @Args('updateUserInput') updateUser: UpdateUser,
  ): Promise<User | null> {
    console.log("UpdateUser query for UserId : " + updateUser.id);
    return this.userService.updateUser(updateUser);
  }

  @Mutation(returns => User)
  addXpByNickname(@Args('addXp') addXp: AddXp): Promise<User> {
    return this.userService.addXpByNickname(addXp);
  }

}
