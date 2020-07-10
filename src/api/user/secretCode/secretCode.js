import prisma from "../../../utils/prisma";
import { secretGenerator, cleaner } from "../../../utils/utils";
import logger from "../../../config/winston";

export default {
  Mutation: {
    secretCode: async (_, args) => {
      const { email: rawEmail, logInId } = args;

      const secret = secretGenerator();
      try {
        if (rawEmail) {
          const email = cleaner(rawEmail);
          const lowerCaseEamil = `${email.toLowerCase()}@naver.com`;
          const result = await prisma.codeConfirm.findOne({
            where: { email: lowerCaseEamil },
          });
          if (result) {
            await prisma.codeConfirm.update({
              where: { email: result.email },
              data: {
                code: secret,
              },
            });
            // jjgg에서 현재 이메일로 가입을 시도하였습니다.
            // 이미 아이디가 존재합니다.
            // 비밀번호를 잊으셨다면 비밀번호 찾기를 이용해주세요.
          } else if (result === null) {
            await prisma.codeConfirm.create({
              data: { email: lowerCaseEamil, code: secret },
            });
          }
          return "success";
        } else if (logInId) {
          if (logInId.length < 6) return "fail";

          const result = await prisma.codeConfirm.findOne({
            where: { logInId },
          });
          if (result) {
            await prisma.codeConfirm.update({
              where: { logInId: result.logInId },
              data: {
                code: secret,
              },
            });
          } else if (result === null) {
            await prisma.codeConfirm.create({
              data: { logInId, code: secret },
            });
          }
          return secret;
        }
      } catch (err) {
        logger.error(err);
        throw Error(err);
      }
    },
  },
};
