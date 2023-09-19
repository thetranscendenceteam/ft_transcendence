import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/createUser.input';
import { AddXp } from './dto/addXp.input';

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
    //const actualUser = await this.userRepository.findOne(input.nickname);

    const actualUser = await this.userRepository.find({
      where: {
        nickname: input.nickname,
      },
      take: 1,
    });

    if (!actualUser) {
      throw new Error('User not found');
    }

    // Make sure that the input.xp is converted to a number (if needed)
    const xpToAdd = Number(input.xp);

    if (isNaN(xpToAdd)) {
      throw new Error('Invalid xp value');
    }

    const totalXp = actualUser[0].xp + xpToAdd;
    actualUser[0].xp = totalXp;

    return this.userRepository.save(actualUser[0]);
  }

  initMockDB(): Promise<User> {
    const test = {
      nickname: 'toto',
      avatar: 'http://toto.png',
    };
    this.userRepository.create(test);
    return this.userRepository.save(test);
  }
}
