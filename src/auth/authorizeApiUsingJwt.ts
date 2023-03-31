import passport from 'passport';
import { NextFunction, Request, Response } from 'express';

function authorizeApiUsingJwt(request: Request, response: Response, next: NextFunction) {
  passport.authenticate('jwt', { session: false }, async (error, token) => {
    if (error || !token) {
      response.status(401).json({ message: 'Unauthorized api ' });
    }
    next();
  })(request, response, next);
}
export default authorizeApiUsingJwt;
