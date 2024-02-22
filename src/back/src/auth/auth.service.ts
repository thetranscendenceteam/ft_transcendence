/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

import { Injectable } from '@nestjs/common';
import { uid } from 'uid';
import * as nodemailer from 'nodemailer';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';
import { PrismaService } from '../prisma.service';
import axios from 'axios';
import { authUser } from './dto/user.entity';
import { UserService } from 'src/user/user.service';
import { StandardRegisterInput } from './dto/standardRegister.input';
import { StandardLoginInput } from './dto/standardLogin.input';

type ftUser = {
  id: string;
  username: string;
  realname: string;
  email: string;
  campus: any;
  avatar_url: string;
  twoFA: boolean;
};
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private userService: UserService) { }

  async ftLoginUpsert(userFtMe: any) {
    try {
      const secret = speakeasy.generateSecret({
        name: 'Ft_transcendence_Pomy',
      });
      const userMe = await this.prisma.users.upsert({
        where: {
          ftId: userFtMe.id,
        },
        update: {
          campus: userFtMe.campus[0].name,
        },
        create: {
          ftId: userFtMe.id,
          pseudo: userFtMe.login,
          firstName: userFtMe.first_name,
          lastName: userFtMe.last_name,
          avatar: userFtMe.image.versions.small,
          mail: userFtMe.email,
          campus: userFtMe.campus[0].name,
          twoFASecret: secret.base32,
          twoFAOtpAuthUrl: secret.otpauth_url,
        },
      });
      return {
        id: userMe.id,
        username: userMe.pseudo,
        realname: userMe.firstName + ' ' + userMe.lastName,
        email: userMe.mail,
        campus: userFtMe.campus[0].name,
        avatar_url: userMe.avatar,
        twoFA: userMe.twoFA,
      };
    } catch (error) {
      return("Username already taken");
    }
  };

  async ftLogin(inputCode: string): Promise<authUser | null> {
    const FtInsertDB = async (userFtMe: any): Promise<ftUser | string> => {
      try {
        const user = await this.ftLoginUpsert(userFtMe.data);
        if (user === "Username already taken") {
          const user_ft = await this.ftLoginUpsert({...userFtMe.data, login: `${userFtMe.data.login}_ft`});
          return user_ft;
        }
        return user;
      } catch (error) {
        throw new Error("ftLoginUpsert failed");
      }
    };

    try {
      const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
      const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
      const OAUTH_REDIRECT_URL = process.env.OAUTH_REDIRECT_URL;
      const OAUTH_TOKEN_URL = process.env.OAUTH_TOKEN_URL;
      const OAUTH_USER_URL = process.env.OAUTH_USER_URL;
      const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

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

      const userTmp = await FtInsertDB(userFtMe);

      if (userTmp instanceof Object) {
        const payload = {
          id: userTmp.id,
          username: userFtMe.data.login,
        };

        const secretKey = JWT_PRIVATE_KEY;
        const options = {
          expiresIn: '1h',
        };
        const ourJwt = jwt.sign(payload, secretKey, options);

        if ((await userTmp).twoFA) {
          throw new Error(`2FA is enabled - ${(await userTmp).username}`); // dont ever modify this error
        }
        const resTmp = await userTmp;
        return ({...resTmp, jwtToken: ourJwt});
      }
      return null;
    } catch (error) {
      return error;
    }
  }

  async ftLoginTwoFA(username: string, twoFA?: string): Promise<authUser | null> {
    try {
      const user = await this.prisma.users.findFirst({ where: { pseudo: username } });
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
          id: user.id,
        };
        const PRIVATE_KEY = "secretKeyPlaceHolder";
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

  verifyToken(token: string) {
    try {
      const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
      if (!PRIVATE_KEY) {
        throw new Error('Missing env variables');
      }
      return jwt.verify(token, PRIVATE_KEY);
    } catch (error) {
      console.error("verifyToken: ", error);
      return false;
    }
  }

  async classicRegister(input: StandardRegisterInput): Promise<boolean> {
    try {
      if (input.mail.includes('@student.42lausanne.ch')) {
        throw new Error("42 mail are not allowed");
      }
      await this.userService.createClassicUser({
        mail: input.mail,
        password: input.password,
        firstName: input.firstname,
        lastName: input.lastname,
        avatar: null,
        pseudo: input.username,
      });
      return true;
    } catch (error) {
      console.log("Error on classicRegister");
      throw error;
    }
  }

  async classicLogin(input: StandardLoginInput): Promise<authUser | null> {

    const payload = (input: { username: string, id: string | null }) => {
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
      const user = await this.prisma.users.findUnique({
        where: {
          pseudo: input.username,
        },
      });
      if (input.username === "" || input.password === "") {
        throw new Error("Empty input");
      }
      if (user && await comparePassword(input.password, user.password) === false) {
        throw new Error("Wrong password");
      }
      if (user) {
        if (user.twoFA) {
          const twoFAVerification = speakeasy.totp.verify({
            secret: user.twoFASecret,
            encoding: 'base32',
            token: input.twoFactorCode as string,
          });
          if (!twoFAVerification) {
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
          jwtToken: jwt.sign(payload({ username: user.pseudo, id: user.id }), secretKey, options),
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
      const user = await this.prisma.users.findFirst({ where: { id: id } });
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
          where: { id: id },
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
          where: { id: id },
          data: { twoFA: toggleTwoFA },
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
      const pwdResetSecret = uid();

      await this.prisma.users.update({
        where: { mail: email },
        data: {
          pwdResetSecret: pwdResetSecret
        },
      });

      const smtp_url = process.env.SMTP_URL ? process.env.SMTP_URL : "";
      const resetLink = `${smtp_url}${pwdResetSecret}`;
      const smtp_user = process.env.SMTP_USER ? process.env.SMTP_USER : "";
      const smtp_pass = process.env.SMTP_API_KEY ? process.env.SMTP_API_KEY : "";

      const transport = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 465,
        auth: {
          user: smtp_user,
          pass: smtp_pass,
        }
      });

      const message = {
        from: "resetpassword@transcendance-pomy.ch",
        to: email,
        subject: "Password Reset request - Transcendance Pomy",
        html: `<tr>
                  <img src='https://cdn.discordapp.com/attachments/472445775549562881/1207370278863114360/ft_pomy_small.png?ex=65df6632&is=65ccf132&hm=3bf2103dbe78d66c24e58e1822970224fef1cb8f4bec45ba90cdb47d958226c0&'>
                  <td style='padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;' height='100%' valign='top' bgcolor='' role='module-content'>
                      <div>
                          <div style='font-family: inherit; text-align: left'>
                              <span style='font-size: 18px; font-family: verdana, geneva, sans-serif'>Hi !</span>
                          </div>
                          <div style='font-family: inherit; text-align: inherit'>
                              <span style='font-family: verdana, geneva, sans-serif'>A reset password has been requested for your account.</span>
                          </div>
                          <div style='font-family: inherit; text-align: inherit'>
                              <span style='font-family: verdana, geneva, sans-serif'>If you did not request a password reset, please ignore this email.</span>
                          </div>
                          <div style='font-family: inherit; text-align: inherit'>
                              <br>
                          </div>
                          <div style='font-family: inherit; text-align: inherit'>
                              <span style='font-family: verdana, geneva, sans-serif'>You can reset your password <a href='${resetLink}'>here</a>.</span>
                          </div>
                          <div style='font-family: inherit; text-align: inherit'>
                              <br>
                          </div>
                          <div style='font-family: inherit; text-align: inherit'>
                              <span style='font-family: verdana, geneva, sans-serif'>Best regards,</span>
                          </div>
                          <div style='font-family: inherit; text-align: inherit'>
                              <span style='font-family: verdana, geneva, sans-serif'>your transcendance-pomy team.</span>
                          </div>
                          <div></div>
                      </div>
                  </td>
              </tr>`
      };


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
      throw error;
    }
  };

  async resetPassword(username: string, code: string, password: string): Promise<boolean> {
    try {
      if (!code)
        throw new Error("Invalid reset code");
      const user = await this.prisma.users.findUnique({
        where: { pseudo: username },
      });
      if (!user) {
        throw new Error("User not found");
      }
      if (user.pwdResetSecret !== code) {
        throw new Error("Invalid reset code");
      }

      await this.prisma.users.update({
        where: { pseudo: user.pseudo },
        data: {
          password: await hashPassword(password),
          pwdResetSecret: null,
        },
      });

      return true;
    } catch (error) {
      console.error("resetPassword: ", error);
      throw error;
    }
  };

}
