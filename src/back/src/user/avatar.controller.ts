import { Controller, Get, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request, Response } from 'express';
import path, { extname } from 'path';
import { UserService } from './user.service';
import { RequestWithUser } from './dto/requestwithuser.interface';
import { GqlAuthGuard } from 'src/auth/gql-auth.guards';


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
        res.sendFile((`/app/uploads/${img}`));
      }
  
    @Post()
    @UseGuards(GqlAuthGuard)
    @UseInterceptors(FileInterceptor('avatar', storage))
    async uploadImage(
      @UploadedFile() file: Express.Multer.File,
      @Req() req: RequestWithUser,
      @Res() res: Response,
      ){
        console.log("req.user", req.user);
        const user = req.user;
        if (user  === undefined) {
          res.status(401).send('Unauthorized');
          return;
        }
        // Handle the uploaded file here, e.g., save it to a database or return its details.
        let editedUser = await this.userService.editUser({
            id: user.id,
            mail: null,
            password: null,
            firstName: null,
            lastName: null,
            avatar: 'https://' + process.env.DOMAIN_NAME + ':8443/avatar/${file.filename}', // TODO change to env var
            pseudo: null,
        }
        );
        if (editedUser) {
            res.status(200).send('Avatar updated');
            return;
        }
        res.status(400).send('Error updating avatar');
      return;
    }
  }
  
