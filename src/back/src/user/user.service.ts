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

  async getGithubJwt(code: String): Promise<string> {
    const ftTokenUrl = 'https://api.intra.42.fr/oauth/token';
    const githubClientId = ""; // tmp local
    const githubClientSecret = ""; // tmp local
  
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          ftTokenUrl,
          {
            client_id: githubClientId,
            client_secret: githubClientSecret,
            code: code
          },
          {
            headers: {
              Accept: 'application/json'
            }
          }
        );
        console.log("response: ", response);
        if (response.data.error) {
          throw new Error('Error obtaining 42 access token: ' + response.data.error);
        }
        const accessToken = response.data.access_token;
        resolve(accessToken);
      } catch (error) {
        reject(error);
      }
    });
  }

  // TODO : async getGithubUser(code: String): Promise<string> {


  async getJwt(inputCode: String): Promise<String | null> {

    const githubJwt = await this.getGithubJwt(inputCode);
    console.log(githubJwt);
    // TODO: getGithubUser()
    // TODO: Stocker infos users

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
