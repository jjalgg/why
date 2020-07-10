import prisma from "../../../../utils/prisma";
import logger from "../../../../config/winston";

export default {
  Query: {
    seePost: async (_, { postNumber }) => {
      try {
        if (postNumber === null) return;
        const result = await prisma.post.findMany({ where: { postNumber } });
        return result[0];
      } catch (err) {
        logger.error(err);
      }
    },
  },
};
