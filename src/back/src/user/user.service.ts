const jwt = require('jsonwebtoken');

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Users } from '@prisma/client';
import { GetUserInput } from './dto/getUser.input';
import { CreateUserInput } from './dto/createUser.input';
import { AddXp } from './dto/addXp.input';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async getAllUser(max: number | undefined): Promise<Users[]> {
    try {
      return await this.prisma.users.findMany({
        take: max,
        orderBy: { xp: 'desc' },
      });
    }
    catch (e) {
      console.log("Error on getAllUser query" + e);
      throw e;
    }
  }

  async getUser(userInput: GetUserInput): Promise<Users | null> {
    try {
      const user = await this.prisma.users.findFirst({
        where: userInput,
      });
      if (user) return user;
      return null;
    }
    catch (e) {
      console.log("Error on getUser query" + e);
      throw e;
    }
  }

  async getUserById(id: string): Promise<Users | null> {
    try {
      return await this.prisma.users.findUnique({ where: { id: id } });
    }
    catch (e) {
      console.log("Error on getUserById query" + e);
      throw e;
    }
  }

  async createUser(createUserInput: CreateUserInput): Promise<Users> {
    try {
      const newUser = this.prisma.users.create({
        data: {
          password: 'toto',
          mail: createUserInput.mail,
          firstName: createUserInput.firstName,
          lastName: createUserInput.lastName,
          ftId: createUserInput.ftId,
          pseudo: createUserInput.pseudo,
          avatar: createUserInput.avatar,
        },
      });
      return newUser;
    }
    catch (e) {
      console.log("Error on createUser query" + e);
      throw e;
    }
  }

  async addXpByNickname(input: AddXp): Promise<Users> {
    const xpToAdd = Number(input.xp);

    if (isNaN(xpToAdd)) {
      throw new Error('Invalid xp value');
    }
    try {
      return this.prisma.users.update({
        where: { id: input.id },
        data: {
          xp: {
            increment: xpToAdd,
          },
        },
      });
    }
    catch (e) {
      console.log("Error on addXpByNickname query" + e);
      throw e;
    }
  }

  // Work in progress after this line.

  async getFtAuth(code: string): Promise<string> {
    try {
      const data = new URLSearchParams();
      data.append('grant_type', 'authorization_code');
      data.append('client_id', process.env.NEXT_PUBLIC_CLIENT_ID ?? '');
      data.append('client_secret', process.env.CLIENT_SECRET ?? '');
      data.append('code', `${code}`);
      data.append('redirect_uri', 'process.env.NEXT_PRIVATE_REDIRECT' ?? '');

      const response = await axios.post(
        'https://api.intra.42.fr/oauth/token',
        data,
      );
      console.log('response.data: ', response.data);
      console.log(
        'response.data stringy ',
        JSON.stringify(response.data.access_token),
      );

      // Resolve the outer promise with the access_token
      return response.data.access_token;
    } catch (error) {
      console.error(error);
      // Reject the outer promise with the error
      throw error;
    }
  }

  async getFtMe(ftJwt: string): Promise<string> {
    try {
      const data = new URLSearchParams();
      data.append('Authorization', ftJwt ?? '');

      const response = await axios.post(
        'https://api.intra.42.fr/v2/me',
        data,
      );
      console.log('getMe: ', response.data);
      console.log(
        'getMe stringy: ',
        JSON.stringify(response.data.access_token),
      );

      // Resolve the outer promise with the access_token
      return response.data.access_token;
    } catch (error) {
      console.error(error);
      // Reject the outer promise with the error
      throw error;
    }
  }


  async getJwt(inputCode: string): Promise<string | null> {
    let ftJwt: string;
    try {
      ftJwt = await this.getFtAuth(inputCode);
      console.log('toto:', ftJwt);
    } catch (error) {
      console.error(error);
      return error;
    }

    let userMe: any; // TODO ANY
    try {
      userMe = this.getFtMe(ftJwt);
    } catch (error) {
      console.error(error);
      return error;
    }
    // TODO: add it to the database -> getFtMe(FtJwt)
    // TODO: Get the user from the database
    return userMe;
    return new Promise((resolve, reject) => {
      jwt.sign({ inputCode }, 'private-key' process.env.privateKey, { expiresIn: '1h' }, (err: any, token: any) => {
        if (err) {
          console.log('err: ', err);
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
  }
}
