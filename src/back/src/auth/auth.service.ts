const jwt = require('jsonwebtoken');

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import axios from 'axios';
import { authUser } from './dto/user.entity';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }
      
    async ftLogin(inputCode: string): Promise<authUser | null> {
      console.log('ftLogin', inputCode);
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
}
