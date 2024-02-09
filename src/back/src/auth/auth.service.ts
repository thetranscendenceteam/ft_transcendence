/* eslint-disable prettier/prettier */
const jwt = require('jsonwebtoken');

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
      console.log('ftLogin', inputCode);
        try {
          const NEXT_PUBLIC_CLIENT_ID= "u-s4t2ud-b732bcb13d06d5351f1864cdd7f3a8843ba12fcbe1b3080c494e8cc96d4cd7c7";
          const CLIENT_SECRET= "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";
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
            };

        } catch (error) {
          console.error("getJwt: ", error);
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
            return {
              username: user.pseudo,
              realname: user.firstName + ' ' + user.lastName,
              avatar_url: user.avatar,
              id: user.id,
              email: user.mail ? user.mail : "No email",
              campus: "Not a 42 Student",
              jwtToken: jwt.sign(payload({username: user.pseudo, ftId: null}), secretKey, options),
            };
          }
          return null;
        }
        catch (e) {
          console.log("Error on classicLogin" + e);
          throw e;
        }

      }
}
