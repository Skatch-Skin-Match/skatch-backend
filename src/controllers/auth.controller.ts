import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User, signUpUserData , UserInput } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { generateAccessToken } from '../utils/auth';

class AuthController {
  public authService = new AuthService();
  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: UserInput = req.body;
      const signUpUserData: signUpUserData = await this.authService.signup(userData);
      let dataToBeDisplayed =
        signUpUserData?.statusCode === 200
          ? {
              statusCode: signUpUserData.statusCode,
              data: {
                ...signUpUserData.data,
                token: generateAccessToken({
                  id: signUpUserData.data?.userData?.id,
                  email: signUpUserData.data?.userData?.email,
                  strategy: signUpUserData.data?.userData?.strategy,
                }),
              },
              message: signUpUserData.message,
            }
          : {
              statusCode: signUpUserData.statusCode,
              message: signUpUserData.message,
            };

      res.status(signUpUserData?Number(signUpUserData.statusCode):200).json(dataToBeDisplayed);
    } catch (error) {
      res.status(500).json({ statusCode: 500, message: error });
    }
  };
}

export default AuthController;
