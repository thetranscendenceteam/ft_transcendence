import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Users } from '@prisma/client';
import { GetUserInput } from './dto/getUser.input';
import { CreateUserInput } from './dto/createUser.input';
import { AddXp } from './dto/addXp.input';
import { User } from './dto/user.entity';
import { UpdateUser } from './dto/updateUser.input';
import { deflateSync } from 'zlib';

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

  public async getUser(userInput: GetUserInput): Promise<Users | null> {
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

  async getUserById(id: string): Promise<User | undefined> {
    try {
      const user = await this.prisma.users.findFirst({ where: { id: id } });
      if (user == null) return undefined
      return user;
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

  async updateUser(updateUser: UpdateUser): Promise<User | null> {
    try {
      const date = new Date();
      const res = await this.prisma.users.update({
        where: {
          id: updateUser.id,
        },
        data: {
          pseudo: updateUser.pseudo,
          password: updateUser.password,
          avatar: updateUser.avatar,
          xp: updateUser.xp,
          campus: updateUser.campus,
          twoFA: updateUser.twoFA,
          count: {
            increment: 1,
          },
          modifiedAt: date.toISOString(),
        },
      })
      if (res) return res;
      return null;
    }
    catch (e) {
      console.log("Error on updateUser query" + e);
      throw e;
    }
  }
}
