import prisma from "../../../utils/prisma";
import { secretGenerator, cleaner } from "../../../utils/utils";

export default {
  Mutation: {
    checkCode: async (_, args) => {
      const { type, logInId, email: rawEmail, code: rawCode } = args;
      const email = cleaner(rawEmail);
      const code = cleaner(rawCode);

      try {
        const result = await prisma.codeConfirm.findOne({
          where: { email: `${email}@naver.com` },
          select: {
            code: true,
          },
        });
        if (result === null) return ["discord"];
        if (result.code !== code) {
          return ["discord"];
        } else if (result.code === code) {
          const secret = secretGenerator();
          if (type === "find") {
            await prisma.codeConfirm.update({
              where: { email: `${email}@naver.com` },
              data: {
                code: secret,
              },
            });
            const result = await prisma.user.findOne({
              where: {
                email: `${email}@naver.com`,
              },
              select: {
                logInId: true,
              },
            });
            if (result) {
              return ["found", secret, result.logInId];
            } else return ["notfound"];
          }
          if (type === "register") {
            if (!logInId) return ["recheck"];
            const exist = await prisma.user.findOne({
              where: { email: `${email}@naver.com` },
            });
            if (exist) {
              return ["exist"];
            } else {
              await prisma.user.update({
                where: { logInId },
                data: {
                  email: `${email}@naver.com`,
                  role: "USER",
                },
              });
              await prisma.codeConfirm.update({
                where: { email: `${email}@naver.com` },
                data: {
                  code: secret,
                },
              });
              return ["registered", secret];
            }
          }
          if (type === "delete") {
            try {
              if (logInId) {
                const exist = await prisma.user.findMany({
                  where: {
                    email: `${email}@naver.com`,
                    logInId,
                  },
                });
                if (exist.length > 0) {
                  await prisma.user.update({
                    where: { logInId },
                    data: {
                      email: null,
                      role: "VIEWER",
                    },
                  });
                  return ["deleted"];
                } else {
                  return ["recheck"];
                }
              }
            } catch (err) {
              throw Error(err);
            }
          }
          if (type === "change") {
            const exist = await prisma.user.findMany({
              where: {
                email: `${email}@naver.com`,
                logInId,
              },
              select: {
                id: true,
              },
            });
            await prisma.codeConfirm.update({
              where: { email: `${email}@naver.com` },
              data: {
                code: secret,
              },
            });
            if (exist.length > 0) {
              return ["success", secret];
            } else {
              return ["discord"];
            }
          }
        }
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
