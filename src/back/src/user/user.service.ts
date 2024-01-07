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

  async getFtAuth(code: String): Promise<String> {
  
    return new Promise(async (resolve, reject) => {

      const data = new URLSearchParams();
      data.append('grant_type', 'authorization_code');
      data.append('client_id', 'u-s4t2ud-f97a3530618ab3e0cc910ba217ca31f706687ef41267dcf2ebfd4eaed2737672' ?? 'toto'); // to move to .env
      data.append('client_secret', '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' ?? 'toto'); // to move to .env
      data.append('code', `${code}`);
      data.append('redirect_uri', 'http://localhost:3002/callback' ?? 'toto'); // to move to .env

      axios.post('https://api.intra.42.fr/oauth/token', data)
        .then(response => {
          console.log('response.data: ', response.data);
          console.log('response.data stringy ', JSON.stringify(response.data.access_token));
          return(response.data.access_token);
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  // TODO : async getGithubUser(code: String): Promise<string> {

  async getJwt(inputCode: String): Promise<String | null> {
    try {
      const FtJwt = await this.getFtAuth(inputCode);
      console.log('debug');
      console.log('toto:', FtJwt);
      return FtJwt;  // Resolve the promise with the obtained value
    } catch (error) {
      console.error(error);
      return null;  // Reject the promise in case of an error
    }



    return new Promise((resolve, reject) => {
      jwt.sign({ inputCode }, 'private-key' /*process.env.privateKey*/, { expiresIn: '1h' }, (err: any, token: any) => {
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
