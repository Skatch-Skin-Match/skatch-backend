import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

type FileNameCallback = (error: Error | null, filename: string) => void

export const multerConfig = {
  storage : multer.diskStorage({
    destination: 'tmp/',
    filename: function (req: Request, file: Express.Multer.File, cb: FileNameCallback) {
      cb(null, file.originalname);
    }
  }),
  
  fileFilter :(req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
      return cb(null, false);
    }
    cb(null, true);
  }
}
export const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'text/csv'

  ) {
      callback(null, true)
  } else {

      callback(null, false)
  }
}

