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
}
