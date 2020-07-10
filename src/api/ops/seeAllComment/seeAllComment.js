import prisma from "../../../utils/prisma";
import { isAdmin } from "../../../utils/utils";

export default {
  Query: {
    seeAllComment: (_, __, { ctx }) => {
      // isAdmin(ctx);
      try {
        return prisma.comment.findMany({
          take: 30,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            createdAt: true,
            text: true,
            published: true,
            penalty: true,
          },
        });
      } catch (err) {
        return null;
      }
    },
  },
};
