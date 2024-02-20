import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestWithUser } from '../user/dto/requestwithuser.interface';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Response } from 'express';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async use(req: RequestWithUser, res: Response) {
    const jwtName = 'jwt';
    const token = req.cookies[jwtName];
    if (!token) {
      throw new Error('Unauthorized, no token found.');
    }
    let decodedToken;

    try {
      if (token) {
        decodedToken = this.authService.verifyToken(JSON.parse(token).jwtToken);
      }
      if (!decodedToken) {
        throw new Error('Unauthorized, invalid token.');
      }
      const user = await this.userService.getUserById(decodedToken.id);

      if (user) {
        req.user = user;
      }
    } catch (error) {
      res.cookie(jwtName, '', {
        expires: new Date(),
        httpOnly: true,
        secure: true,
      });
      //res.redirect('/login');
      throw new Error(error);
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as RequestWithUser;
    const response = context.switchToHttp().getResponse();
    const next = context.switchToHttp().getNext();

    await this.use(request, response);

    return !!request.user;
  }
}
