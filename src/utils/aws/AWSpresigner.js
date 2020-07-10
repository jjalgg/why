require("dotenv").config();

import AWS from "aws-sdk";

AWS.config = new AWS.Config({
  accessKeyId: process.env.S3_KEY, // stored in the .env file
  secretAccessKey: process.env.S3_SECRET, // stored in the .env file
  region: process.env.BUCKET_REGION, // This refers to your bucket configuration.
});

const s3 = new AWS.S3({ s3ForcePathStyle: true });
const Bucket = process.env.BUCKET_NAME;

export function generateGetUrl(Key) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket,
      Key,
      Expires: 120, // 2 minutes
    };
    // Note operation in this case is getObject
    s3.getSignedUrl("getObject", params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        // If there is no errors we will send back the pre-signed GET URL
        resolve(url);
      }
    });
  });
}

export function generatePutUrl(Key, ContentType) {
  return new Promise((resolve, reject) => {
    // Note Bucket is retrieved from the env variable above.
    const params = { Bucket, Key, ContentType, Expires: 300 };
    // Note operation in this case is putObject
    s3.getSignedUrl("putObject", params, function (err, url) {
      if (err) {
        reject(err);
      }
      // If there is no errors we can send back the pre-signed PUT URL
      resolve(url);
    });
  });
}

export function deleteObject(Key) {
  return new Promise((resolve, reject) => {
    const params = { Bucket, Key };
    s3.deleteObject(params, function (err, data) {
      if (err) {
        reject(err);
      }
      // If there is no errors we can send back the pre-signed PUT URL
      resolve();
    });
  });
}

export function deleteObjects(url) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket,
      Delete: {
        Objects: url,
      },
    };
    s3.deleteObjects(params, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
