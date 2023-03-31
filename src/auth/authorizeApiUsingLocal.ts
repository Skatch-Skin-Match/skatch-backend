import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { generateAccessToken } from '../utils/auth';
import AuthService from '@services/auth.service';
import { User, signUpUserData } from '@/interfaces/users.interface';
function authorizeApiUsingLocal(req: Request, res: Response, next: NextFunction) {
  let authService = new AuthService();
  passport.authenticate('local', { session: false }, async (error, user) => {

    if (error || !user) {
      res.status(401).json({ statusCode: 401, message: 'Incorrect email or password ' });
    }
    try {
      let signUpUserData: signUpUserData = await authService.login(user);
      let dataToBeDisplayed: signUpUserData =
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

      !error ? res.status(signUpUserData?Number(signUpUserData.statusCode):200).json(dataToBeDisplayed) : res.status(500).json({ statusCode: 500, message: error });
    } catch (error) {
      res.status(500).json({ statusCode: 500, message: error });
    }
  })(req, res, next);
}
export default authorizeApiUsingLocal;
