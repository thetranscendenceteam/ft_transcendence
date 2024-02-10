/* eslint-disable prettier/prettier */
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { authUser } from './dto/user.entity';
import { StandardLoginInput } from './dto/standardLogin.input';
import { StandardRegisterInput } from './dto/standardRegister.input';


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
  async getTwoFaQr(@Args('id') id: string): Promise<string> { // TODO take id from JWT
    const result = await this.userService.twoFaQr(id);
    if (result === null) {
      throw new Error('2FA QR generation failed');
    }
    return result;
  }

  @Mutation(returns => String)
  async toggleTwoFA(@Args('id') id: string, @Args('code') code: string, @Args('toggleTwoFA') toggleTwoFA: boolean): Promise<boolean> { // TODO take id from JWT
    const result = await this.userService.toggleTwoFA(id, code, toggleTwoFA);
    if (result === null) {
      throw new Error('2FA activation failed');
    }
    return result;
  }
}
