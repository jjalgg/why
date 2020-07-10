// import { hurdleGenerator } from "../cookieGenerator";

// const hurdleMiddleware = (ctx, next) => {
//   const now = new Date().getTime();
//   const hurdle = hurdleGenerator(now);
//   ctx.cookies.set("la_h", hurdle, {
//     maxAge: 1000 * 60 * 60 * 24 * 7,
//     httpOnly: true,
//     secure: false, //https 만 응답
//   });
//   return next();
// };

// export default hurdleMiddleware;
