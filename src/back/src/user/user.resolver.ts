import { Args, Mutation, Query, Resolver, Int, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/createUser.input';
import { GetUserInput } from './dto/getUser.input';
import { User } from './dto/user.entity';
import { UpdateUser } from './dto/updateUser.input';
import { EditUserInput } from './dto/editUser.input';
import { SearchUser, SearchUserInput } from './dto/searchUser.input';
import { UserPrivate } from './dto/userPrivate.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guards';
import { RequestWithUser } from './dto/requestwithuser.interface';

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

  @Query(returns => [UserPrivate])
	@UseGuards(GqlAuthGuard)
  friendsLeaderboard(
		@Context('req') req: RequestWithUser,
		@Args('userId', { type: () => String, nullable: false }) userId: string
  ): Promise<UserPrivate[]> {
		const user = req.user;
		if (user.id !== userId) throw new Error("Unauthorized");
	  return this.userService.friendsLeaderboard(userId);
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
	@UseGuards(GqlAuthGuard)
  editUser(
    @Context('req') req: RequestWithUser,
    @Args('editUserInput') editUserInput: EditUserInput,
  ): Promise<User> {
    const user = req.user;
    if (user.id !== editUserInput.id) throw new Error('Unauthorized');
    try {
      console.log("EditUser query for UserId : " + editUserInput.pseudo);
      const res = this.userService.editUser(editUserInput);
      return res;
    } catch (e) {
      throw e;
    }
  }

  @Mutation(returns => User)
	@UseGuards(GqlAuthGuard)
  updateUser(
		@Context('req') req: RequestWithUser,
    @Args('updateUserInput') updateUser: UpdateUser
  ): Promise<User | null> {
		const user = req.user;
		if (user.id !== updateUser.id) throw new Error("Unauthorized");
    console.log("UpdateUser query for UserId : " + updateUser.id);
    return this.userService.updateUser(updateUser);
  }

}
