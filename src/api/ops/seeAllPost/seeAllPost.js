import prisma from "../../../utils/prisma";
import { isAdmin } from "../../../utils/utils";
import logger from "../../../config/winston";

export default {
  Query: {
    seeAllPost: (_, __, { ctx }) => {
      //   isAdmin(ctx);
      try {
        return prisma.post.findMany({
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            createdAt: true,
            title: true,
            text: true,
            category: true,
            penalty: true,
            published: true,
          },
        });
      } catch (err) {
        logger.error(err);
        return null;
      }
    },
  },
};
