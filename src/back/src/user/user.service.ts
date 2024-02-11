/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GetUserInput } from './dto/getUser.input';
import { CreateUserInput } from './dto/createUser.input';
import { CreateClassicUserInput } from './dto/createClassicUser.input';
import { AddXp } from './dto/addXp.input';
import { User } from './dto/user.entity';
import { UpdateUser } from './dto/updateUser.input';
import { uid } from 'uid';
import { EditUserInput } from './dto/editUser.input';
import { UserPrivate } from './dto/userPrivate.entity';
import { SearchUser, SearchUserInput } from './dto/searchUser.input';

const speakeasy = require('speakeasy');

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async getAllUser(max: number | undefined): Promise<UserPrivate[]> {
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

  public async getUser(userInput: GetUserInput): Promise<User | null> {
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

  public async searchUser(userInput: SearchUserInput): Promise<SearchUser[] | null> {
    try {
      if (userInput.name == null) return null;
      const users = await this.prisma.users.findMany({
        where: {
          pseudo: {
            contains: userInput.name,
          },
        },
        take: (5),
        orderBy: { xp: 'desc' },
      });
      if (users) {
        const response = [];
        for (const user of users) {
          response.push({name: user.pseudo, id: user.id});
        }
        return response;
      }
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

  // TODO: remove this function when JWT is implemented
  async getUserByUserName(pseudo: string): Promise<User | undefined> {
    try {
      const user = await this.prisma.users.findFirst({ where: { pseudo: pseudo } });
      if (user == null) return undefined
      return user;
    }
    catch (e) {
      console.log("Error on getUserByUserName query" + e);
      throw e;
    }
  }

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    try {
      const secret = speakeasy.generateSecret({
        name: 'Ft_transcendence_Pomy',
      });
      const newUser = this.prisma.users.create({
        data: {
          password: uid(21),
          mail: createUserInput.mail,
          firstName: createUserInput.firstName,
          lastName: createUserInput.lastName,
          ftId: createUserInput.ftId,
          pseudo: createUserInput.pseudo,
          avatar: createUserInput.avatar,
          twoFASecret: secret.base32,
          twoFAOtpAuthUrl: secret.otpauth_url,
        },
      });
      return newUser;
    }
    catch (e) {
      console.log("Error on createUser query" + e);
      throw e;
    }
  }

  async createClassicUser(createUserInput: CreateClassicUserInput): Promise<User> {
    try {
      const secret = speakeasy.generateSecret({
        name: 'Ft_transcendence_Pomy',
      });
      const newUser = this.prisma.users.create({
        data: {
          ftId: null,
          password: createUserInput.password,
          mail: createUserInput.mail,
          firstName: createUserInput.firstName,
          lastName: createUserInput.lastName,
          pseudo: createUserInput.pseudo,
          avatar: "https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg",
          twoFASecret: secret.base32,
          twoFAOtpAuthUrl: secret.otpauth_url,
        },
      });
      return newUser;
    }
    catch (e) {
      console.log("Error on createUser query" + e);
      throw e;
    }
  }

  async editUser(editUserInput: EditUserInput): Promise<User> {
    try {

      const userToUpdate = {
        ...(editUserInput.mail && { mail: editUserInput.mail }),
        ...(editUserInput.password && { password: editUserInput.password }),
        ...(editUserInput.firstName && { firstName: editUserInput.firstName }),
        ...(editUserInput.lastName && { lastName: editUserInput.lastName }),
        ...(editUserInput.avatar && { avatar: editUserInput.avatar }),
        ...(editUserInput.pseudo && { pseudo: editUserInput.pseudo }),
      };

      return this.prisma.users.update({
        where: { id: editUserInput.id },
        data: userToUpdate
      });
    }
    catch (e) {
      console.log("Error on editUser query" + e);
      throw e;
    }
  }

  async addXpByNickname(input: AddXp): Promise<User> {
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
