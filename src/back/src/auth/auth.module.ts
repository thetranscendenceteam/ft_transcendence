import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from '../prisma.service';
import { UserService } from 'src/user/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
        secret: process.env.JWT_PRIVATE_KEY,
        signOptions: {
            expiresIn: 3600,
        },
    }),
  ],
  providers: [AuthService, AuthResolver, UserService, PrismaService, JwtService],
  exports: [AuthService],
})
export class AuthModule { }
