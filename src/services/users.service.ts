import { DI } from "@databases";
import { isEmpty } from "@utils/util";
import { wrap } from "@mikro-orm/core";
import { S3 } from "aws-sdk";
import fs from "fs";
import sharp from "sharp";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { selectedColorObj } from "@/interfaces/users.interface";

class UserService {
  public async updateConfig(
    selectedColorObj: selectedColorObj,
    userId: string
  ) {
    try {
      if (isEmpty(selectedColorObj))
        return { statusCode: 400, message: `object not provided` };

      const updateUserById = await DI.userRepository.findOne({ id: userId });
      console.log("updateUserById24", updateUserById);

      if (!updateUserById)
        return { statusCode: 400, message: `Provided user not found` };
      if (updateUserById.id !== userId)
        return {
          statusCode: 400,
          message: `Data does not belong to this user`,
        };

      const updatedVal = wrap(updateUserById).assign({
        ...updateUserById,
        config: {
          selectedColor: selectedColorObj,
        },
      });
      await DI.em.persistAndFlush(updatedVal);

      if (!updateUserById)
        return { statusCode: 400, message: `data does not exist` };

      return {
        statusCode: 200,
        message: "Updated the Data Successfully",
        data: {
          userData: {
            // firstName: updatedVal?.firstName,
            // lastName: updatedVal?.lastName,
            profilePicture: updatedVal.profilePicture,
            email: updatedVal?.email,
            strategy: updatedVal?.strategy,
            id: updatedVal?.id,
          },
          configData: updatedVal.config,
        },
      };
    } catch (error) {
      return { statusCode: 500, message: error };
    }
  }

  public async getUserData(userId: string) {
    try {
      if (isEmpty(userId))
        return { statusCode: 400, message: `Id not provided` };

      const getData = await DI.userRepository.findOne({ id: userId });

      console.log("data inside dbKKKKKKKKKKKKKKK", getData);

      return {
        statusCode: 200,
        message: "Got the data Successfully",
        data: {
          userData: {
            // firstName: getData?.firstName,
            // lastName: getData?.lastName,
            email: getData?.email,
            // strategy: getData?.strategy,
            profilePicture: getData.profilePicture,
            id: getData?.id,
          },
          configData: {
            presetColor: getData.config.presetColor,
            selectedColor: getData.config.selectedColor,
            history: getData.config.history,
          },
        },
      };
    } catch (error) {
      return { statusCode: 500, message: error };
    }
  }

  public async uploadDataToDb(userId, s3: S3, originalKey, imageName) {
    const params = {
      Bucket: JSON.parse(process.env.SKATCH_SECRETS)
        .AWS_S3_BUCKET_FOR_PROFILE_PIC,
      Key: originalKey,
    };
    // const originalUrl: string = `${process.env.CLOUDFRONT_PROFILE_PIC_URL}/${originalKey}`;
    const originalUrl: string = `${
      JSON.parse(process.env.SKATCH_SECRETS).CLOUDFRONT_PROFILE_PIC_URL
    }/${originalKey}`;

    // const originalUrl: string = `https://d30ukgyabounne.cloudfront.net/face.jpeg`;

    try {
      let response = await axios.post(
        "https://35bbmbbmb2.execute-api.us-west-2.amazonaws.com/staging",
        {
          url: originalUrl,
        }
      );
      console.log("responseeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", response.data.body);

      const findUser = await DI.userRepository.findOne({ id: userId });
      //get hsv by calling lambda api
      let data = response.data.body;
      let finalArr = [
        `${Math.round((data?.[0] / 360) * 1000)}°,${Math.round(
          (data?.[1] / 255) * 100
        )}%,${Math.round((data?.[2] / 255) * 100)}%`,
      ];
      console.log("finalArrrrrrrrrrrrr", finalArr);
      if (finalArr[0].includes("NaN")) {
        return {
          statusCode: 500,
          message: "Please Upload a Valid Image",
          //   profilePicture: originalUrl,
          //   imageName: imageName,
        };
      }
      let newHistory = { id: uuidv4(), hsv: finalArr, imageName: imageName };
      let newConfig = {
        ...findUser.config,
        history: [...findUser.config.history, newHistory],
        selectedColor: newHistory,
      };

      console.log("newConfig in upload to Db", newConfig);

      const updatedVal = wrap(findUser).assign({
        ...findUser,
        profilePicture: originalUrl,
        config: newConfig,
      });

      let val = await DI.em.persistAndFlush(updatedVal);
      console.log("val of pp", val);

      return {
        statusCode: 200,
        message: "Profile Pic updated  successfully",
        profilePicture: originalUrl,
        imageName: imageName,
      };
    } catch (error) {
      console.log("errorr", error);

      await this.deletePhotoFromS3(s3, params);
      console.log("res deleteddddd");
      return { statusCode: 500, message: error };
    }
  }

  public async deleteProfilePhoto(userId: string) {
    try {
      if (isEmpty(userId))
        return { statusCode: 400, message: `Id not provided` };

      const updateUserById = await DI.userRepository.findOne({ id: userId });
      if (updateUserById.id !== userId)
        return { statusCode: 400, message: `something went wrong` };

      let updatedPhotoValue = wrap(updateUserById).assign({
        ...updateUserById,
        profilePicture: "",
      });
      await DI.em.persistAndFlush(updatedPhotoValue);
      console.log("jjjj", updatedPhotoValue);

      return {
        statusCode: 200,
        message: "Deleted Successfully",
      };
    } catch (error) {
      return { statusCode: 500, message: error };
    }
  }

  public async uploadToS3(s3: S3, fileData?: Express.Multer.File) {
    try {
      if (fileData.mimetype === "text/csv") {
        return {
          success: false,
          message: "Image should be in format jpg,jpeg,png",
        };
      }
      const fileContent = fs.readFileSync(fileData!.path);
      console.log("cccccccccccccc", fileContent);
      const imageName = uuidv4();
      const mimeTypeArray = fileData.originalname.split(".");
      const mimetype = mimeTypeArray[mimeTypeArray.length - 1];
      const resizeImage = await sharp(fileContent).toBuffer();

      try {
        const params = {
          Bucket: JSON.parse(process.env.SKATCH_SECRETS)
            .AWS_S3_BUCKET_FOR_PROFILE_PIC,
          Key: `${imageName}.${mimetype}`,
          Body: resizeImage,
          // Body: fileContent,
          ContentType: fileData?.mimetype,
        };
        console.log("Paramsssssssss", params);

        const res = await s3.upload(params).promise();

        console.log("File Uploaded  Successfully", res);
        fs.unlinkSync(fileData!.path);

        return {
          success: true,
          message: "File Uploaded  Successfull",
          data: params.Key,
          imageName: fileData.originalname,
        };
      } catch (error) {
        fs.unlinkSync(fileData!.path);

        return {
          success: false,
          message: "Unable to Upload the file",
          data: error,
        };
      }
    } catch (error) {
      console.log(error);
      fs.unlinkSync(fileData!.path);
      return {
        success: false,
        message: "Unable to access this file",
        data: {},
      };
    }
  }

  public async deletePhotoFromS3(s3: S3, params) {
    try {
      const res = await s3.deleteObject(params).promise();

      console.log("resss i from delete", res);

      return res;
    } catch (error) {
      console.log("errorr", error);
      return error;
    }
  }
}

export default UserService;
