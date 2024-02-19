/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GetUserInput } from './dto/getUser.input';
import { CreateUserInput } from './dto/createUser.input';
import { CreateClassicUserInput } from './dto/createClassicUser.input';
import { User } from './dto/user.entity';
import { UpdateUser } from './dto/updateUser.input';
import { uid } from 'uid';
import { EditUserInput } from './dto/editUser.input';
import { UserPrivate } from './dto/userPrivate.entity';
import { SearchUser, SearchUserInput } from './dto/searchUser.input';
import { hashPassword } from 'src/utils/bcrypt';
import { RelationshipStatus } from '@prisma/client';

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
			const user = await this.prisma.users.findUnique({
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
					response.push({ name: user.pseudo, id: user.id });
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
			if (!id)
				throw new Error('Error no id provided')
			const user = await this.prisma.users.findUnique({ where: { id: id } });
			if (!user)
				throw new Error('Error no user find for this id')
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
					password: await hashPassword(uid(21)),
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
			if (!this.sanitizeCreate(createUserInput)) return new User();
			const secret = speakeasy.generateSecret({
				name: 'Ft_transcendence_Pomy',
			});
			const newUser = this.prisma.users.create({
				data: {
					ftId: null,
					password: await hashPassword(createUserInput.password),
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

	sanitizeCreate(input: CreateClassicUserInput) {
		if (input.firstName && (input.firstName.length < 1 || input.firstName.length > 15 || !input.firstName.match(/^[a-zA-Z]+$/))) return false;
		if (input.lastName && (input.lastName.length < 1 || input.lastName.length > 15 || !input.lastName.match(/^[a-zA-Z]+$/))) return false;
		if (input.pseudo && (input.pseudo.length < 4 || input.pseudo.length > 10 || !input.pseudo.match(/[^a-zA-Z0-9]/))) return false;
		if (input.password && (input.password.length < 6 || input.password.length > 20 || !input.password.match(/[^a-zA-Z0-9]/) || !input.password.match(/[@#$]/))) return false;
		if (input.mail && (!input.mail.includes('@') || !input.mail.includes('.') || !input.mail.match(/[^a-zA-Z0-9@.]/))) return false;
		return true;
	}

	async editUser(editUserInput: EditUserInput): Promise<User> {
		try {
			if (!this.sanitizeInput(editUserInput)) return new User();
			const userToUpdate = {
				...(editUserInput.mail && { mail: editUserInput.mail }),
				...(editUserInput.password && { password: await hashPassword(editUserInput.password) }),
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

	sanitizeInput(input: EditUserInput) {
		if (input.firstName && (input.firstName.length < 1 || input.firstName.length > 15 || !input.firstName.match(/^[a-zA-Z]+$/))) return false;
		if (input.lastName && (input.lastName.length < 1 || input.lastName.length > 15 || !input.lastName.match(/^[a-zA-Z]+$/))) return false;
		if (input.pseudo && (input.pseudo.length < 4 || input.pseudo.length > 10 || !input.pseudo.match(/[^a-zA-Z0-9]/))) return false;
		if (input.password && (input.password.length < 6 || input.password.length > 20 || !input.password.match(/[^a-zA-Z0-9]/) || !input.password.match(/[@#$]/))) return false;
		if (input.mail && (!input.mail.includes('@') || !input.mail.includes('.') || !input.mail.match(/[^a-zA-Z0-9@.]/))) return false;
		return true;
	}

	async updateUser(updateUser: UpdateUser): Promise<User | null> {
		try {
			const date = new Date();
			if (!updateUser.password) {
				throw new Error('Password is required');
			}
			const res = await this.prisma.users.update({
				where: {
					id: updateUser.id,
				},
				data: {
					pseudo: updateUser.pseudo,
					password: await hashPassword(updateUser.password),
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

	async friendsLeaderboard(userId: string): Promise<UserPrivate[]> {
		try {
			const query = await this.prisma.usersRelationships.findMany({
				where: {
					OR: [
						{ firstId: userId },
						{ secondId: userId },
					],
					status: RelationshipStatus.friends,
				},
			});
			const friendsIds = query.map((f) => {
				if (f.firstId === userId) return f.secondId;
				else return f.firstId;
			});
			const users : UserPrivate[] = [];
			for (const f of friendsIds) {
				const l = await this.prisma.users.findFirst({
					where: {
						id: f,
					},
					select: {
						pseudo: true,
						firstName: true,
						lastName: true,
						avatar: true,
						xp: true,
						createdAt: true,
						modifiedAt: true,
						count: true,
						campus: true,
					},
				});
				if (l) users.push(l);
			}
			const thisUser = await this.prisma.users.findFirst({
				where: {
					id: userId,
				},
				select: {
					pseudo: true,
					firstName: true,
					lastName: true,
					avatar: true,
					xp: true,
					createdAt: true,
					modifiedAt: true,
					count: true,
					campus: true,
				},
			});
			if (thisUser) users.push(thisUser);
			const res = users.sort((a,b) => b.xp.toString().localeCompare(a.xp.toString()));
			return res;
		}
		catch (e) {
			console.log("Error on friendsLeaderboard");
			throw e;
		}
	}

}
