import prisma from "../../../../utils/prisma";

export default {
  Query: {
    getNotice: (_, __, { ctx, isAuthenticated }) => {
      //   isAuthenticated(ctx);
      try {
        const userId = ctx.state.user.id;
        return prisma.notice.findMany({
          where: {
            ownerId: userId,
          },
          take: 50,
          select: {
            id: true,
            createdAt: true,
            text: true,
            title: true,
            postNumber: true,
            type: true,
          },
        });
      } catch {
        return [];
      }
    },
  },
};
