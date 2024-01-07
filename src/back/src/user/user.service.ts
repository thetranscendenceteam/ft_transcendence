const jwt = require('jsonwebtoken');

import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/createUser.input';
import { AddXp } from './dto/addXp.input';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAllUser(): Promise<User[]> {
    return this.userRepository.find(); // équivalent à : SELECT * USER
  }

  createUser(createUserInput: CreateUserInput): Promise<User> {
    const newUser = this.userRepository.create(createUserInput); // équivalent a un const newUser = new User() + newUser.nickname = createUserInput.nickname blabla
    return this.userRepository.save(newUser);
  }

  async addXpByNickname(input: AddXp): Promise<User> {
    const actualUser = await this.userRepository.find({
      where: {
        nickname: input.nickname,
      },
      take: 1,
    });
  
    if (!actualUser || actualUser.length === 0) {
      throw new Error('User not found');
    } else {
      const xpToAdd = Number(input.xp);
  
      if (isNaN(xpToAdd)) {
        throw new Error('Invalid xp value');
      }
  
      const totalXp = (actualUser[0]?.xp ?? 0) + xpToAdd;
      if (actualUser[0]) {
        actualUser[0].xp = totalXp;
        return this.userRepository.save(actualUser[0]);
      } else {
        throw new Error('User not found');
      }
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

    const response = await axios.post('https://api.intra.42.fr/oauth/token', data);
    console.log('response.data: ', response.data);
    console.log('response.data stringy ', JSON.stringify(response.data.access_token));

    // Resolve the outer promise with the access_token
    return response.data.access_token;
  } catch (error) {
    console.error(error);
    // Reject the outer promise with the error
    throw error;
  }
}

async getJwt(inputCode: string): Promise<string | null> {
  try {
    const FtJwt = await this.getFtAuth(inputCode);
    console.log('debug');
    console.log('toto:', FtJwt);
    return FtJwt;
  } catch (error) {
    console.error(error);
    return null;
  }


    /*return new Promise((resolve, reject) => {
      jwt.sign({ inputCode }, 'private-key' /*process.env.privateKey, { expiresIn: '1h' }, (err: any, token: any) => {
        if (err) {
          console.log('err: ', err);
          reject(err);
        } else {
          resolve(token);
        }
      });
    });*/
  }
}
