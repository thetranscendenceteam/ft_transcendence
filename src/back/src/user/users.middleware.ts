import { NestMiddleware } from "@nestjs/common";
import { Response, NextFunction } from 'express';
import { AuthService } from "src/auth/auth.service";
import { RequestWithUser } from "./dto/requestwithuser.interface";
import { UserService } from "./user.service";

export class AuthMiddleware implements NestMiddleware {
    constructor(
            private userService: UserService,
            private authService: AuthService,
    ){}
    
    async use(req: RequestWithUser, res: Response, next: NextFunction) {
        const jwtName = 'jwt';
        const token = req.cookies[jwtName];
        if(!token) {
            return res.status(401).send({ message: 'Unauthorized, no token found.'})
        }
        let decodedToken;

        try {
            if (token) {
                decodedToken = this.authService.verifyToken(JSON.parse(token).jwtToken)
                console.log('decodedToken', decodedToken);
            }
            const user = await this.userService.getUserById(decodedToken.sub);

            if (user) {
                req.user = user;
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}