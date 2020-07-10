import bcrypt from "bcrypt";

import { tokenGenerator, wcaGenerator } from "../../../utils/cookieGenerator";
import prisma from "../../../utils/prisma";
import { randomNickname } from "../../../utils/utils";

export default {
  Mutation: {
    logIn: async (_, args, { ctx }) => {
      const { logInId: rawLogInId, password: rawPassword } = args;
      const logInId = rawLogInId;
      const password = rawPassword;
      try {
        const result = await prisma.user.findOne({
          where: { logInId },
          select: {
            id: true,
            logInId: true,
            nick: true,
            lastLoggedIn: true,
            password: true,
            role: true,
            isForbidden: true,
            reportCounts: true,
          },
        });
        if (result) {
          let tokenNick = result.nick;
          const passResult = await bcrypt.compare(password, result.password);
          if (passResult) {
            const now = new Date().getTime();

            if (!result.isForbidden && result.reportCounts > 10) {
              await prisma.user.update({
                where: { id: result.id },
                data: {
                  isForbidden: true,
                  reportCounts: 0,
                },
              });
              await prisma.forbidden.create({
                data: {
                  subject: {
                    connect: {
                      id: result.id,
                    },
                  },
                  term: now + 3 * 24 * 3600 * 1000,
                  cause: "신고 누적",
                  realeased: false,
                  where: "",
                },
              });
              return {
                result: false,
                message: "forbidden",
              };
            }

            if (now - result.lastLoggedIn > 16 * 3600 * 1000) {
              const newNick = randomNickname();
              tokenNick = newNick;
              await prisma.user.update({
                where: { id: result.id },
                data: { nick: newNick, lastLoggedIn: now },
              });
            } else {
              await prisma.user.update({
                where: { id: result.id },
                data: { lastLoggedIn: now },
              });
            }

            const jetton = tokenGenerator(result.id, tokenNick, result.role);
            const wca = wcaGenerator(result.id);
            ctx.cookies.set("jetton", jetton, {
              maxAge: 1000 * 60 * 60 * 16,
              httpOnly: true,
              secure: false, //https 만 응답
            });
            if (result.isForbidden) {
              return {
                result: true,
                message: "forbidden",
                wca,
              };
            }
            return {
              result: true,
              message: `${tokenNick}`,
              wca,
            };
          } else {
            return { result: false, message: "incorrect" };
            // 비밀번호 불일치
          }
        } else {
          return { result: false, message: "incorrect" };
          // 계정 부재
        }
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
