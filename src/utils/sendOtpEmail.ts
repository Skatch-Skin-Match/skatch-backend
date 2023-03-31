import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-west-2' })

export async function sendOtpEmail(event) {
  console.log("hereeee", event);
  
    // const SES_CONFIG = {
    //     region: process.env.BUCKET_LOCATION,
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    // };
    const SES_CONFIG = {
      apiVersion: '2010– 12– 01'
    }
  
    const AWS_SES = new AWS.SES(SES_CONFIG);
    let params = {
        Source: '', // from .env
        Destination: {
          ToAddresses: [
            event.email
             // from event.email
            // recipientEmail
          ],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `Otp for reseting the  password is: ${event.otp}`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `Otp for reseting the password`,
          }
        },
      };
      try {
         await AWS_SES.sendEmail(params).promise();
         console.log("hereeee success",);

        return { message:'success'}

        
      } catch (error) {
        console.log("errorrr in email",error);
        
        return { message:'failure'}

        
      }
   
  }
  