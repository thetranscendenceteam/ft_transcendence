import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request as RequestType } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
				JwtStrategy.extractJWT,
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_PRIVATE_KEY,
    });
  }

	private static extractJWT(req: RequestType): string | null {
		if (
			req.cookies &&
			'jwt' in req.cookies &&
			req.cookies.jwt.length > 0
		) {
			console.log("Hello there");
			return req.cookies.jwt;
		}
		return null;
	}

  async validate(payload: any) {
		if (payload === null) {
			throw new UnauthorizedException();
		}
    return payload;
  }
}
