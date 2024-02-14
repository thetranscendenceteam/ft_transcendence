/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

import { Injectable } from '@nestjs/common';
import { uid } from 'uid';
import * as nodemailer from 'nodemailer';
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
          campus: userFtMe.data.campus[0].name,
        },
        create: {
          ftId: userFtMe.data.id,
          pseudo: userFtMe.data.login,
          firstName: userFtMe.data.first_name,
          lastName: userFtMe.data.last_name,
          avatar: userFtMe.data.image.versions.small,
          mail: userFtMe.data.email,
          campus: userFtMe.data.campus[0].name,
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
      const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
      const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
      const OAUTH_REDIRECT_URL = process.env.OAUTH_REDIRECT_URL;
      const OAUTH_TOKEN_URL = process.env.OAUTH_TOKEN_URL;
      const OAUTH_USER_URL = process.env.OAUTH_USER_URL;
      const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
      // .env not working, using this temporary. do not commit id and secret ! replace by process.env.NEXT_PUBLIC_CLIENT_ID later

      if (!OAUTH_CLIENT_ID || !OAUTH_CLIENT_SECRET || !OAUTH_REDIRECT_URL || !OAUTH_TOKEN_URL || !OAUTH_USER_URL || !JWT_PRIVATE_KEY) {
        throw new Error('Missing env variables');
      }
      const tokenResponse = await axios.post(OAUTH_TOKEN_URL, {
        grant_type: 'authorization_code',
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
        code: inputCode,
        redirect_uri: OAUTH_REDIRECT_URL,
      });
      const userFtMe = await axios.get(OAUTH_USER_URL, {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
        },
      });

      const payload = {
        ftId: userFtMe.data.id,
        username: userFtMe.data.login,
      };

      const secretKey = JWT_PRIVATE_KEY;
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

    const payload = (input: { username:string, id: string | null }) => {
      return {
        username: input.username,
        id: input.id,
      }
    };
    try {
      const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
      if (!JWT_PRIVATE_KEY) {
        throw new Error('Missing env variables');
      }
      const secretKey = JWT_PRIVATE_KEY;
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
          jwtToken: jwt.sign(payload({username: user.pseudo, id: user.id}), secretKey, options),
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
    try {
      const user = await this.prisma.users.findFirst({where: {id: id}});
      if (user && user.twoFASecret) {
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

  async generateEmailResetLink(email: string): Promise<boolean> {
    try {
      //const pwdResetSecret = uid();
      //const pwdExpireDate = new Date();

      /*this.prisma.users.update({
        where: {mail: email},
        data: {
          pwdResetSecret: pwdResetSecret,
          pwdExpireDate: pwdExpireDate
        },
      });*/

      //const resetLink = `http://localhost:3000/resetPassword/validate/${pwdResetSecret}`;
      //const resend = new Resend('re_esAkHVsq_QBjMnbL7UkW7KBKHohD58Gh5'); //TODO put that in .env
      // console.log(email,pwdExpireDate, resetLink);

      const transport = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 465,
        auth: {
          user: "apikey", // TODO env
          pass: "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" // TODO env
        }
      });

      const message = {
        from: "resetpassword@transcendance-pomy.ch",
        to: "alain.huber91@gmail.com",
        subject: "Hello!",
        html: "<tr><img src='https://cdn.discordapp.com/attachments/472445775549562881/1207370278863114360/ft_pomy_small.png?ex=65df6632&is=65ccf132&hm=3bf2103dbe78d66c24e58e1822970224fef1cb8f4bec45ba90cdb47d958226c0&'><td style='padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;' height='100%' valign='top' bgcolor='' role='module-content'><div><div style='font-family: inherit; text-align: left'><span style='font-size: 18px; font-family: verdana, geneva, sans-serif'>Hi !</span></div><div style='font-family: inherit; text-align: inherit'><span style='font-family: verdana, geneva, sans-serif'>A reset password have been asked for your account.</span></div><div style='font-family: inherit; text-align: inherit'><span style='font-family: verdana, geneva, sans-serif'>If you did not asked for a password reset please ignore this e-mail.</span></div><div style='font-family: inherit; text-align: inherit'><br></div><div style='font-family: inherit; text-align: inherit'><span style='font-family: verdana, geneva, sans-serif'>You can reset your password </span><a href='http://www.google.ch%22%3E/'><span style='font-family: verdana, geneva, sans-serif'>here</span></a><span style='font-family: verdana, geneva, sans-serif'>.</span></div><div style='font-family: inherit; text-align: inherit'><br></div><div style='font-family: inherit; text-align: inherit'><span style='font-family: verdana, geneva, sans-serif'>Best regards,</span></div><div style='font-family: inherit; text-align: inherit'><span style='font-family: verdana, geneva, sans-serif'>your transcendance-pomy team.</span></div><div></div></div></td></tr>"
      }


      transport.sendMail(message, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
      });

      return true;
    } catch (error) {
      console.error("generateEmailResetLink: ", error);
      return error;
    }
  };

  async resetPassword(email: string): Promise<boolean> {
    try {
      console.log(email);
      return true;
    } catch (error) {
      console.error("resetPassword: ", error);
      return error;
    }
  };

}
