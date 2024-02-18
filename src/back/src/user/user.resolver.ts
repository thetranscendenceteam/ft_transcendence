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
import { GqlAuthGuard } from 'src/gql-auth.guards';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) { }

  @Query(returns => [UserPrivate])
  @UseGuards(GqlAuthGuard)
  getUsers(
    @Args('max', { type: () => Int, nullable: true }) max: number | undefined,
  ): Promise<UserPrivate[]> {

    const cookieHeader = context.req.headers.cookie;
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
      // Find the jwt cookie
      const jwtCookie = cookies.find((cookie) => cookie.startsWith('jwt='));
      if (jwtCookie) {
        // Extract the value part
        const jwtValue = jwtCookie.split('=')[1];
        // Decode the JWT token
        const jwtToken = decodeURIComponent(jwtValue);
        console.log('JWT Token:', jwtToken);
        // Now you can use this JWT token as needed
      } else {
        console.log('JWT cookie not found');
      }
    } else {
      console.log('No cookies found in the request');
    }

    console.log('🚀 ~ UserResolver ~ context:', context.req.headers.cookie);
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

}
