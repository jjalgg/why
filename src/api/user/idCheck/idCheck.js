import prisma from "../../../utils/prisma";
import logger from "../../../config/winston";

export default {
  Mutation: {
    idCheck: async (_, args) => {
      const { logInId } = args;
      try {
        const result = await prisma.user.findOne({
          where: { logInId },
          select: { logInId: true },
        });
        if (result) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        logger.error(error);
        return false;
      }
    },
  },
};
