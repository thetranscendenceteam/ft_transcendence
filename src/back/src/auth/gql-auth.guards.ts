import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { RequestWithUser } from "../user/dto/requestwithuser.interface";
import { AuthMiddleware } from "../user/users.middleware";
import { User } from "../user/dto/user.entity";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class GqlAuthGuard implements CanActivate {
  private authMiddleware: AuthMiddleware;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    this.authMiddleware = new AuthMiddleware(userService, authService);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as RequestWithUser;
    const response = context.switchToHttp().getResponse();
    const next = context.switchToHttp().getNext();

    await new Promise(resolve => this.authMiddleware.use(request, response, next));

    return !!request.user;
  } 
}
