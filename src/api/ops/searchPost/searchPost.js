import { isAdmin } from "../../../utils/utils";
import prisma from "../../../utils/prisma";

export default {
  Mutation: {
    searchPost: async (_, { postNumber }, { ctx, isAuthenticated }) => {
      //   isAuthenticated(ctx);
      //   isAdmin(ctx);
      try {
        if (isNaN(postNumber)) {
          return null;
        }
        const editNumber = Number(postNumber);
        const result = await prisma.post.findMany({
          where: {
            postNumber: editNumber,
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

        if (result.length > 0) {
          return result[0];
        } else {
          return null;
        }
      } catch {
        return null;
      }
    },
  },
};
