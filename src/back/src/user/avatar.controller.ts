import { Controller, Get, Param, Post, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request, Response } from 'express';
import path, { extname } from 'path';
import { UserService } from './user.service';


export const storage = {
    storage: diskStorage({
      destination: './uploads', // Specify your upload folder here
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  };

@Controller('avatar')
export class AvatarController {
    constructor(
        private readonly userService: UserService,
      ) {
    }
  
    @Get(':imgname')
    async getAvatar(
      @Res() res: Response,
      @Param('imgname') img: string,
      ){
        console.log("🚀 ~ AvatarController ~ getAvatar ~ img", img)
        res.sendFile((`/app/uploads/${img}`));
      }
  
    @Post()
    @UseInterceptors(FileInterceptor('avatar', storage))
    async uploadImage(
      @UploadedFile() file: Express.Multer.File,
      @Query('username') username: string,  // TODO take id from JWT
      @Req() req: Request,
      @Res() res: Response,
      ){
        console.log("🚀 ~ AppController ~ uploadImage ~ username", username)
        let user = await this.userService.getUserByUserName(username);
        if (!user) {
            res.status(400).send('User not found');
            return;
        }
        console.log("🚀 ~ AppController ~ uploadImage ~ user", user)
        let id = user.id;
        console.log("🚀 ~ AppController ~ uploadImage ~ file:", file);
        console.log("🚀 ~ AppController ~ uploadImage ~ file:", __filename);
        // Handle the uploaded file here, e.g., save it to a database or return its details.
        let editedUser = await this.userService.editUser({
            id: id,
            mail: null,
            password: null,
            firstName: null,
            lastName: null,
            avatar: `https://localhost:8443/avatar/${file.filename}`, // TODO change to env var
            pseudo: null,
        }
        );
        console.log("🚀 ~ AppController ~ uploadImage ~ editedUser:", editedUser);
        if (editedUser) {
            res.status(200).send('Avatar updated');
            return;
        }
        res.status(400).send('Error updating avatar');
      return;
    }
  }
  