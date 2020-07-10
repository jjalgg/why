require("dotenv").config();

import AWS from "aws-sdk";

const cloundFront = new AWS.CloudFront.Signer(
  process.env.CLOUD_KEY_PAIR_ID,
  process.env.CLOUD_PRIVATE_KEY
);

const policy = JSON.stringify({
  Statement: [
    {
      Resource: "http*://d1hsasrgkzz4i4.cloudfront.net/*", // http* => http and https
      Condition: {
        DateLessThan: {
          "AWS:EpochTime":
            Math.floor(new Date().getTime() / 1000) + 60 * 60 * 16, // Current Time in UTC + time in seconds, (60 * 60 * 1 = 1 hour)
        },
      },
    },
  ],
});

// const options = { url: "https://drzqcqekhvyen.cloudfront.net/*", policy };

export const cloudCookie = () => cloundFront.getSignedCookie({ policy });
