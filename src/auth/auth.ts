import LocalStrategy from 'passport-local';
import { Strategy as JWTstrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJWT } from 'passport-jwt';
import { User } from '@/interfaces/users.interface';

const authMiddlewareController = passport => {
  passport.use(
    'local',
    new LocalStrategy.Strategy({ usernameField: 'email', passwordField: 'password' }, async (email: String, password: String, done: any) => {
      done(null, { email, password });
    }),
  );
  passport.serializeUser(function (user: User, cb: any) {
    process.nextTick(function () {
      cb(null, { id: user.id });
    });
  });

  passport.deserializeUser(function (user: User, cb: any) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  passport.use(
    new JWTstrategy(
      {
        secretOrKey:  JSON.parse(process.env.SKATCH_SECRETS).SKATCH_JWT_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      },
      async (token: any, done: any) => {
        try {
          return done(null, token.user);
        } catch (error) {
          done(error);
        }
      },
    ),
  );
};

export default authMiddlewareController;
