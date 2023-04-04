import { DI } from '@databases';

import { ConfigData, User, UserInput } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';

import { v4 as uuidv4 } from 'uuid';

class AuthService {
  public async signup(userData: UserInput) {
    try {
      if (isEmpty(userData)) return { statusCode: 400, message: `provided data is empty` };

      const findUser: User = await DI.userRepository.findOne({ email: userData.email });
      if (findUser) return { statusCode: 400, message: `This email ${userData.email} already exists` };

      const configData: ConfigData = {
        presetColor: [
          { id: 1, colorCode: '#F9ECE6', colorName: 'pale', hsv: ['19°, 8%, 98%'] },
          { id: 2, colorCode: '#F0D3C5', colorName: 'fair', hsv: ['20°, 18%, 94%'] },
          { id: 3, colorCode: '#E3B38D', colorName: 'medium', hsv: ['27°, 38%, 89%'] },
          { id: 4, colorCode: '#BC8D57', colorName: 'olive', hsv: ['32°, 54%, 74%'] },
          { id: 5, colorCode: '#A96C4F', colorName: 'brown', hsv: ['19°, 53%, 66%'] },
          { id: 6, colorCode: '#704733', colorName: 'black', hsv: ['20°, 54%, 44%'] },
        ],
        selectedColor: {
          id: 6,
          colorCode: '#704733',
          colorName: 'black',
          hsv: ['20°, 54%, 44%'],
        },        // history: [{ id: 0, colorName: '', hsv: [''] }],
        history: [],
      };

      const createUserData: User = DI.userRepository.create({ ...userData, id: uuidv4(), strategy: 'local', config: configData });

      let val = await DI.em.persistAndFlush(createUserData);
      let dataToBeSentToEmail = {
        email: createUserData.email,
        name: createUserData.firstName || 'user',
      };

      return {
        statusCode: 200,
        data: {
          userData: {
            id: createUserData.id,
            email: createUserData.email,
            strategy: createUserData.strategy,
            firstName: createUserData.firstName || null,
            lastName: createUserData.lastName || null,
          },
          configData: createUserData.config,
        },
        message: 'Account created successfully',
      };
    } catch (error) {
      console.log('error in signup', error);

      return { statusCode: 500, message: error };
    }
  }

  public async createUserForStrategy(userData: User, photoId) {
    try {
      if (isEmpty(userData)) return { statusCode: 400, message: `provided data is empty` };

      const findUser: User = await DI.userRepository.findOne({ email: userData.email });
      console.log('findUser', findUser);

      if (findUser && findUser.strategy === userData.strategy)
        return {
          statusCode: 200,
          message: `Logged in `,
          data: {
            userData: { ...userData, id: findUser.id, firstName: findUser?.firstName },
          },
        };

      let cachedImageForId = '';
      let encodedImage = '';
      let authorFromId = '';

      if (findUser && findUser.strategy !== userData.strategy) return { statusCode: 400, message: `Please login with other method` };

      const createUserData: User = DI.userRepository.create({ ...userData, id: uuidv4() });

      await DI.em.persistAndFlush(createUserData);

      let dataToBeSentToEmail = {
        email: createUserData.email,
        name: createUserData.firstName || 'user',
      };

      return {
        statusCode: 200,
        data: {
          userData: {
            id: createUserData.id,
            email: createUserData.email,
            strategy: createUserData.strategy,
            firstName: createUserData.firstName || null,
            lastName: createUserData.lastName || null,
            profilePicture: createUserData.profilePicture || null,
          },
          configData: createUserData.config,
        },
        message: 'Account created successfully',
      };
    } catch (error) {
      console.log('error in signup', error);

      return { statusCode: 500, message: error };
    }
  }

  public async login(userData: User) {
    try {
      if (isEmpty(userData)) return { statusCode: 400, message: `provided data is empty` };
      const findUser: User = await DI.userRepository.findOne({ email: userData.email });
      console.log('hhhh', findUser);

      if (!findUser) return { statusCode: 404, message: `Incorrect email or password` };

      const isPasswordMatching: boolean = userData.password === findUser.password;

      if (!isPasswordMatching) return { statusCode: 400, message: `Incorrect email or password` };

      return {
        statusCode: 200,
        message: 'Login succesfull',
        data: {
          userData: {
            id: findUser.id,
            email: userData.email,
            strategy: 'local',
            firstName: findUser.firstName || null,
            lastName: findUser.lastName || null,
            profilePicture: findUser.profilePicture || null,
          },
          configData: findUser.config,
        },
      };
    } catch (error) {
      return { statusCode: 500, message: error };
    }
  }
}

export default AuthService;
