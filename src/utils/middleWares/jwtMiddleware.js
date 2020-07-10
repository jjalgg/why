require("dotenv").config;

import jwt from "jsonwebtoken";
import { tokenGenerator } from "../cookieGenerator";
import { randomNickname } from "../utils";
import prisma from "../prisma";

const jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get("jetton");
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = {
      id: decoded.id,
      nick: decoded.nick,
      role: decoded.role,
    };
    // const now = Math.floor(Date.now() / 1000);
    // if (decoded.exp - now < 60 * 60 * 1) {
    //   const newNick = randomNickname();
    //   await prisma.user
    //     .update({
    //       where: {
    //         logInId: decoded.logInId,
    //       },
    //       data: {
    //         nick: newNick,
    //       },
    //     })
    //     .then(() => {
    //       const token = tokenGenerator(decoded.id, newNick, decoded.role);
    //       ctx.cookies.set("jetton", token, {
    //         maxAge: 1000 * 60 * 60 * 16,
    //         httpOnly: true,
    //         secure: false, //https 만 응답
    //       });
    //     });
    // }

    return next();
  } catch (e) {
    ctx.cookies.set("jetton");
    return next();
  }
};

export default jwtMiddleware;
