import { isAdmin } from "../../../../utils/utils";
import prisma from "../../../../utils/prisma";

export default {
  Query: {
    seeAdminPost: async (_, __, { ctx }) => {
      isAdmin(ctx);
      try {
        const post = await prisma.adminPost.findMany({
          take: 20,
          select: {
            id: true,
            title: true,
            text: true,
            createdAt: true,
            comment: true,
          },
        });
        return post;
      } catch {
        return [];
      }
    },
  },
};
