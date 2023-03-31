import { EnumType } from '@mikro-orm/core';

export interface selectedColorObj {
  id: number;
  colorCode: string;
  colorName: string;
}

export interface ConfigData {
  presetColor: {
    id: number;
    colorCode: string;
    colorName: string;
    hsv: string[];
  }[];
  selectedColor: {
    id?: number;
    colorCode?: string;
    colorName?: string;
    hsv?: string[];
  };
  history: { id: number; colorName: string; hsv: string[] }[];
}

export interface User {
  id?: any;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  deleted?: boolean;
  strategy?: string;
  config?: any;
  photoId?: string;
  profilePicture?: string;
}

export interface signUpUserData {
  statusCode: Number;
  data?: any;
  message: string;
  token?: string;
}

export interface ResponseMessage {
  statusCode: Number;
  data?: any;
  message: string;
}

export interface UserInput {
  photoId?: any;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
}
