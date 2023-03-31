import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { ResponseMessage, selectedColorObj, User } from '@interfaces/users.interface';
import { IUserRequest } from '../interfaces/auth.interface';
import userService from '@services/users.service';
import AWS from 'aws-sdk';
import { DI } from '@databases';

AWS.config.update({ region: 'us-west-2' });

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}
class UsersController {
  public userService = new userService();

  public configUpdate = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const selectedColorObj: selectedColorObj = req.body;
    try {
      const responseFromDb: ResponseMessage = await this.userService.updateConfig(selectedColorObj, req.user.id);

      if (responseFromDb.statusCode === 200) {
        res.status(200).json(responseFromDb);
      } else if (responseFromDb.statusCode === 400) {
        res.status(400).json(responseFromDb);
      } else {
        res.status(500).json(responseFromDb);
      }
    } catch (error) {
      console.log('errorrrrrrrrrrrrrrrrrrrrrrrrrr', error);
      res.status(500).json(error);
    }
  };
  public getUserData = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    console.log('ssssssssssssssss', req.user.id);
    try {
      const responseFromDb: ResponseMessage = await this.userService.getUserData(req.user.id);

      if (responseFromDb.statusCode === 200) {
        res.status(200).json(responseFromDb);
      } else if (responseFromDb.statusCode === 400) {
        res.status(400).json(responseFromDb);
      } else {
        res.status(500).json(responseFromDb);
      }
    } catch (error) {
      console.log('error');
      res.status(500).json(error);
    }
  };

  public setUserProfilePic = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user.id) return res.status(400).json({ statusCode: '400', message: 'user doesnt exist' });
      const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
      });

      // Initialize bucket
      // await this.photoService.initBucket(s3, process.env.AWS_S3_BUCKET_FOR_PROFILE_PIC);
      const uploadRes = await this.userService.uploadToS3(s3, req.file);

      if (uploadRes.success) {
        const responseFromDb = await this.userService.uploadDataToDb(req.user.id, s3, uploadRes.data,uploadRes.imageName);
        console.log('ressssss', responseFromDb);
        res.status(responseFromDb.statusCode).json(responseFromDb);
      } else {
        res.status(400).json(uploadRes);
      }
    } catch (error) {
      console.log('error');
      res.status(500).json(error);
    }
  };

  public deleteProfilePhoto = async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
      const userId: string = req.user.id;
      const responseFromDb = await this.userService.deleteProfilePhoto(userId);
      if (responseFromDb.statusCode === 200) {
        res.status(200).json(responseFromDb);
      } else if (responseFromDb.statusCode === 400) {
        res.status(400).json(responseFromDb);
      } else {
        res.status(500).json(responseFromDb);
      }
    } catch (error) {
      console.log('error');
      res.status(500).json(error);
    }
  };

  public pingUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json('ping');
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
