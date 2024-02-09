/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import axios from 'axios';
import { authUser } from './dto/user.entity';
import { UserService } from 'src/user/user.service';
import { StandardRegisterInput } from './dto/standardRegister.input';
import { StandardLoginInput } from './dto/standardLogin.input';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private userService: UserService) { }
      
    async ftLogin(inputCode: string): Promise<authUser | null> {
      const FtInsertDB = async (userFtMe: any, ourJwt: string) => {
        const secret = speakeasy.generateSecret({
          name: 'Ft_transcendence_Pomy',
        });
          const userMe = await this.prisma.users.upsert({
            where: {
              ftId: userFtMe.data.id,
            },
            update: {
              ftId: userFtMe.data.id,
              pseudo: userFtMe.data.login,
              firstName: userFtMe.data.first_name,
              lastName: userFtMe.data.last_name,
              avatar: userFtMe.data.image.versions.small,
              mail: userFtMe.data.email,  
            },
            create: {
              ftId: userFtMe.data.id,
              pseudo: userFtMe.data.login,
              firstName: userFtMe.data.first_name,
              lastName: userFtMe.data.last_name,
              avatar: userFtMe.data.image.versions.small,
              mail: userFtMe.data.email,
              twoFASecret: secret.base32,
              twoFAOtpAuthUrl: secret.otpauth_url,
            },
          });
        return {
          id: userMe.id,
          username: userMe.pseudo,
          realname: userMe.firstName + ' ' + userMe.lastName,
          email: userMe.mail,
          campus: userFtMe.data.campus[0].name,
          avatar_url: userMe.avatar,
          jwtToken: ourJwt,
          twoFA: userMe.twoFA,
        };
      };

        try {
          const NEXT_PUBLIC_CLIENT_ID= "u-";
          const CLIENT_SECRET= "s-";
          const NEXT_PRIVATE_REDIRECT= "https://localhost:8443/callback";
          // .env not working, using this temporary. do not commit id and secret ! replace by process.env.NEXT_PUBLIC_CLIENT_ID later
  
          const tokenResponse = await axios.post('https://api.intra.42.fr/oauth/token', {
            grant_type: 'authorization_code',
            client_id: NEXT_PUBLIC_CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: inputCode,
            redirect_uri: NEXT_PRIVATE_REDIRECT,
          });
          const userFtMe = await axios.get('https://api.intra.42.fr/v2/me', {
            headers: {
              Authorization: `Bearer ${tokenResponse.data.access_token}`,
            },
          });
      
          const payload = {
            ftId: userFtMe.data.id,
            username: userFtMe.data.login,
          };
          const PRIVATE_KEY= "secretKeyPlaceHolder";
          // .env not working, using this temporary. do not commit ! replace by process.env.NEXT_PUBLIC_CLIENT_ID later
  
            const secretKey = PRIVATE_KEY;
            const options = {
              expiresIn: '1h',
            };
          const ourJwt = jwt.sign(payload, secretKey, options);

          const userTmp = FtInsertDB(userFtMe, ourJwt);

          if ((await userTmp).twoFA) {
            throw new Error(`2FA is enabled - ${(await userTmp).username}`); // dont ever modify this error
          }
          return userTmp;
        } catch (error) {
          console.error("getJwt: ", error);
          return error;
        }
      }

      async ftLoginTwoFA(username: string, twoFA?: string): Promise<authUser | null> {
        try {
          const user = await this.prisma.users.findFirst({where: {pseudo: username}});
          if (user) {
            const twoFAVerification = speakeasy.totp.verify({
              secret: user.twoFASecret,
              encoding: 'base32',
              token: twoFA as string,
            });
            if (!twoFAVerification) {
              throw new Error("2FA verification failed");
            }
            const payload = {
              username: user.pseudo,
              ftId: user.ftId,
            };
            const PRIVATE_KEY= "secretKeyPlaceHolder";
            const secretKey = PRIVATE_KEY;
            const options = {
              expiresIn: '1h',
            };
            const jwtToken = jwt.sign(payload, secretKey, options);
            return {
              username: user.pseudo,
              realname: user.firstName + ' ' + user.lastName,
              avatar_url: user.avatar,
              id: user.id,
              email: user.mail ? user.mail : "No email",
              campus: user.campus ? user.campus : "Not a 42 Student",
              jwtToken: jwtToken,
              twoFA: user.twoFA,
            };
          }
          return null;
        } catch (error) {
          console.error("ftLoginTwoFA: ", error);
          return error;
        }
      }

      async classicRegister(input: StandardRegisterInput): Promise<boolean> {
        try {
          this.userService.createClassicUser({
            mail: input.mail,
            password: input.password,
            firstName: input.firstname,
            lastName: input.lastname,
            avatar: null,
            pseudo: input.username,
          });
          return true;
        } catch (error) {
          console.error("classicRegister: ", error);
          return false;
        }
      }

      async classicLogin(input: StandardLoginInput): Promise<authUser | null> {

        const payload = (input: { username:string, ftId: number | null }) => {
          return {
            username: input.username,
            ftId: input.ftId,
          }
        };
        try {
          const PRIVATE_KEY= "secretKeyPlaceHolder";
          const secretKey = PRIVATE_KEY;
          const options = {
            expiresIn: '1h',
          };
          const user = await this.prisma.users.findFirst({
            where: {
              pseudo: input.username,
              password: input.password,
            },
          });
          if (user) {
            if (user.twoFA) {
              const twoFAVerification = speakeasy.totp.verify({
                secret: user.twoFASecret,
                encoding: 'base32',
                token: input.twoFactorCode as string,
              });
              if(!twoFAVerification) {
                throw new Error("Logging failed");
              }
            }
            return {
              username: user.pseudo,
              realname: user.firstName + ' ' + user.lastName,
              avatar_url: user.avatar,
              id: user.id,
              email: user.mail ? user.mail : "No email",
              campus: "Not a 42 Student",
              jwtToken: jwt.sign(payload({username: user.pseudo, ftId: null}), secretKey, options),
              twoFA: user.twoFA,
            };
          }
          throw new Error("Logging failed");
        }
        catch (e) {
          console.log("Error on classicLogin" + e);
          throw e;
        }

      }

      async twoFaQr(id: string): Promise<string | null> { // TODO take from JWT
        console.log("🚀 ~ AuthService ~ twoFaQr ~ id:", id);
        try {
          const user = await this.prisma.users.findFirst({where: {id: id}});
          console.log("🚀 ~ AuthService ~ twoFaQr ~ user:", user)
          if (user && user.twoFASecret) {
            console.log("🚀 ~ AuthService ~ twoFaQr ~ user.twoFASecret:", user.twoFASecret)
            const qrCode = await qrcode.toDataURL(user.twoFAOtpAuthUrl);
            return qrCode;
          }
          return null;
        } catch (error) {
          console.error("2FA QR generation failed: ", error);
          return error;
        }
      };

      async toggleTwoFA(id: string, code: string, toggleTwoFA: boolean): Promise<boolean | null> { // TODO take from JWT
        try {
          const userCurrent = await this.prisma.users.findFirst(
            {
              where: {id: id},
            },
          );
          if (userCurrent) {
            const twoFAVerification = speakeasy.totp.verify({
              secret: userCurrent.twoFASecret,
              encoding: 'base32',
              token: code as string,
            });
            if (!twoFAVerification) {
              throw new Error("2FA verification failed");
            }
          }

          const user = await this.prisma.users.update(
            {
              where: {id: id},
              data: {twoFA: toggleTwoFA},
            },
          );
          if (user) {
            return user.twoFA;
          }
          return null;
        } catch (error) {
          console.error("2FA QR generation failed: ", error);
          return error;
        }
      };
}
