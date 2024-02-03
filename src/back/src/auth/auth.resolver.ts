import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { authUser } from './dto/user.entity';


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
}
