import prisma from "../../../../utils/prisma";

export default {
  Query: {
    myComment: (_, args, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const userId = ctx.state.user.id;
      const { volume, cursor } = args;
      const cursorObject = {
        id: cursor,
      };
      try {
        return prisma.comment.findMany({
          where: { authorId: userId },
          orderBy: {
            createdAt: "desc",
          },
          cursor: cursor ? cursorObject : undefined,
          take: volume,
          select: {
            id: true,
            createdAt: true,
            text: true,
            likeCounts: true,
          },
        });
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
