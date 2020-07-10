import prisma from "../../../utils/prisma";
import bcrypt from "bcrypt";

import { secretGenerator, randomNickname, cleaner } from "../../../utils/utils";
import logger from "../../../config/winston";

export default {
  Mutation: {
    signUp: async (_, args) => {
      const { logInId: rawLogInId, password: rawPassword } = args;
      const logInId = cleaner(rawLogInId);
      const password = cleaner(rawPassword);

      try {
        const exist = await prisma.user.findOne({
          where: { logInId },
        });
        if (exist) {
          return false;
        } else if (exist === null) {
          const nick = randomNickname();
          const hashedPass = await bcrypt.hash(password, 11);
          const user = await prisma.user.create({
            data: {
              logInId,
              nick,
              password: hashedPass,
              role: "VIEWER",
              lastLoggedIn: new Date().getTime(),
            },
          });
          return true;
        }
      } catch (err) {
        logger.error(err);
        throw Error("signupFail");
      }
    },
  },
};
