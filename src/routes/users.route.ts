import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authorizeApiUsingJwt from '../auth/authorizeApiUsingJwt';
import authMiddleware from '@/middlewares/auth.middleware';
import multer from 'multer';
import { multerConfig } from '../utils/multerConfig';
import { fileFilter } from '../utils/multerConfig';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();
  public upload = multer({ storage: multerConfig.storage, fileFilter });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/configupdate`, authMiddleware, this.usersController.configUpdate);
    this.router.get(`${this.path}/getuserdata`, authMiddleware, this.usersController.getUserData);
    this.router.post(`${this.path}/profilepic`, authMiddleware, this.upload.single('profile_pic'), this.usersController.setUserProfilePic);
    this.router.delete(`${this.path}/profilepic`, authMiddleware, this.usersController.deleteProfilePhoto);
    this.router.get(`/ping`, this.usersController.pingUser);
  }
}

export default UsersRoute;
