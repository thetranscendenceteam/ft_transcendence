/* eslint-disable prettier/prettier */
import { Args, Mutation, Resolver, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authUser } from './dto/user.entity';
import { StandardLoginInput } from './dto/standardLogin.input';
import { StandardRegisterInput } from './dto/standardRegister.input';
import { GqlAuthGuard } from './gql-auth.guards';
import { RequestWithUser } from '../user/dto/requestwithuser.interface';


@Resolver()
export class AuthResolver {
  constructor(private userService: AuthService) { }

  @Mutation(returns => authUser, { nullable: true })
  async authAsFt(@Args('code') code: string): Promise<authUser | null> {
    const result = await this.userService.ftLogin(code);
    if (result === null) {
      throw new Error('Invalid code or null response');
    }
    return result;
  }

  @Mutation(returns => authUser, { nullable: true })
  async ftLoginTwoFA(@Args('username') username: string, @Args('twoFA') twoFA: string): Promise<authUser | null> {
    const result = await this.userService.ftLoginTwoFA(username, twoFA);
    if (result === null) {
      throw new Error('Invalid 2FA or null response');
    }
    return result;
  }

  @Mutation(returns => Boolean)
  async standardRegister(@Args('standardRegister') standardRegister: StandardRegisterInput): Promise<boolean> {
    const result = await this.userService.classicRegister(standardRegister);
    if (result === null) {
      throw new Error('Error: Could not register user');
    }
    return result;
  }

  @Mutation(returns => authUser, { nullable: true })
  async standardLogin(@Args('standardLogin') standardLogin: StandardLoginInput): Promise<authUser> {
    const result = await this.userService.classicLogin(standardLogin);
    if (result === null) {
      throw new Error('Error: Invalid user/password');
    }
    return result;
  }

  @Mutation(returns => String)
	@UseGuards(GqlAuthGuard)
  async getTwoFaQr(
		@Context('req') req: RequestWithUser,
		@Args('id') id: string
	): Promise<string> {
		const user = req.user;
		if (user.id !== id) throw new Error("Unauthorized");
    const result = await this.userService.twoFaQr(id);
    if (result === null) {
      throw new Error('2FA QR generation failed');
    }
    return result;
  }

  @Mutation(returns => String)
	@UseGuards(GqlAuthGuard)
  async toggleTwoFA(
		@Context('req') req: RequestWithUser,
		@Args('id') id: string,
		@Args('code') code: string,
		@Args('toggleTwoFA') toggleTwoFA: boolean

	): Promise<boolean> {
		const user = req.user;
		if (user.id !== id) throw new Error("Unauthorized");
    const result = await this.userService.toggleTwoFA(id, code, toggleTwoFA);
    if (result === null) {
      throw new Error('2FA activation failed');
    }
    return result;
  }

  @Mutation(returns => Boolean)
  async generatePasswordReset(@Args('email') email: string): Promise<boolean> {
    try {
      await this.userService.generateEmailResetLink(email);
      return true;
    } catch (error) {
      throw new Error('Failed to send password reset email');
    }
  }

  @Mutation(returns => Boolean)
  async resetPassword(
		@Context('req') req: RequestWithUser,
		@Args('user') user:string,
		@Args('code') code: string,
		@Args('password') password: string
	): Promise<boolean> {
    try {
			const user = req.user;
			if (user.username !== user) throw new Error("Unauthorized");
      await this.userService.resetPassword(user, code, password);
      return true;
    } catch (error) {
      throw new Error('Failed to send password reset email');
    }
  }
}
