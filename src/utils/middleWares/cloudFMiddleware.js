// import jwt from "jsonwebtoken";
// require("dotenv").config();

// import { cloudCookie } from "../aws/AWSCloundF";
// import logger from "../../config/winston";

// const setCfCookie = (ctx, next) => {
//   const cookie = cloudCookie();

//   ctx.cookies.set("CloudFront-Key-Pair-Id", cookie["CloudFront-Key-Pair-Id"], {
//     httpOnly: true,
//     Path: "/",
//     Domain: ".d1hsasrgkzz4i4.cloudfront.net",
//   });

//   ctx.cookies.set("CloudFront-Policy", cookie["CloudFront-Policy"], {
//     httpOnly: true,
//     Path: "/",
//     Domain: ".d1hsasrgkzz4i4.cloudfront.net",
//   });

//   ctx.cookies.set("CloudFront-Signature", cookie["CloudFront-Signature"], {
//     httpOnly: true,
//     Path: "/",
//     Domain: ".d1hsasrgkzz4i4.cloudfront.net",
//   });
//   return next();
// };

// const bakerMiddleware = async (ctx, next) => {
//   try {
//     const hurdle = ctx.cookies.get("la_h");
//     if (!hurdle) {
//       setCfCookie(ctx, next);
//     } else {
//       const now = new Date().getTime();
//       const decoded = jwt.verify(hurdle, process.env.JWT_SECRET);
//       if (now - decoded.lastLoggedIn > 1000 * 3600 * 16) {
//         setCfCookie(ctx, next);
//       } else {
//         return next();
//       }
//     }
//   } catch (err) {
//     logger.error(err);
//     return next();
//   }
// };

// export default bakerMiddleware;
