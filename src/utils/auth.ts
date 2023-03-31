import { User } from '@/interfaces/users.interface';
import jwt from 'jsonwebtoken';
export function generateAccessToken(data: User) {
  try {
    const token: String = jwt.sign(
      {
        user: data,
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
      },
      process.env.SKATCH_JWT_SECRET,
    );
    return token;
  } catch (error) {
    return error;
  }
}
