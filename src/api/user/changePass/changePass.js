import prisma from "../../../utils/prisma";
import bcrypt from "bcrypt";
import { cleaner } from "../../../utils/utils";
import logger from "../../../config/winston";

export default {
  Mutation: {
    changePass: async (_, args) => {
      const { logInId, email: rawEmail, password: rawPassword, code } = args;
      const email = cleaner(rawEmail);
      const password = cleaner(rawPassword);

      const emailField = {
        email: `${email}@naver.com`,
      };

      const logInIdField = {
        logInId,
      };

      try {
        const result = await prisma.codeConfirm.findOne({
          where: rawEmail ? emailField : logInIdField,
          select: {
            code: true,
          },
        });
        if (result === null) return false;
        if (result.code === code) {
          const exist = await prisma.user.findOne({
            where: rawEmail ? emailField : logInIdField,
          });
          if (exist) {
            const hashedPass = await bcrypt.hash(password, 11);
            await prisma.user.update({
              where: rawEmail ? emailField : logInIdField,
              data: {
                password: hashedPass,
              },
            });
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } catch (err) {
        logger.error(err);
        throw Error(err);
      }
    },
  },
};
