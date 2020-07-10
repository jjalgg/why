// Load the AWS SDK for Node.js
import AWS from "aws-sdk";
// Set the region

AWS.config.update({
  accessKeyId: process.env.SES_ID,
  secretAccessKey: process.env.SES_KEY,
  region: process.env.SES_REGION,
});

// Create sendEmail params
const params = (toEmail, secret) => ({
  Destination: {
    /* required */
    //참조
    // CcAddresses: [
    //   "emailca@jjal.gg",
    //   /* more items */
    // ],
    ToAddresses: [
      `${toEmail}`,
      /* more items */
    ],
  },
  Message: {
    /* required */
    Subject: {
      Charset: "UTF-8",
      Data: "jjal.gg 인증코드 입니다",
    },
    Body: {
      /* required */
      Html: {
        Charset: "UTF-8",
        Data:
          "<html><body><h1>Hello  Charith</h1><p style='color:red'>Sample description</p> <p>Time 1517831318946</p></body></html>",
      },
      Text: {
        Charset: "UTF-8",
        Data: `인증코드 6자리 : ${secret}`,
      },
    },
    //"SENDER_EMAIL_ADDRESS"
  },
  //"SENDER_EMAIL_ADDRESS"
  Source: "email@jjal.gg" /* required */,
});

export const emailSender = (toEmail, secret) => {
  // Create the promise and SES service object
  const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params(toEmail, secret))
    .promise();

  // Handle promise's fulfilled/rejected states
  sendPromise
    .then(function (data) {
      console.log(data.MessageId);
    })
    .catch(function (err) {
      console.error(err, err.stack);
    });
};
