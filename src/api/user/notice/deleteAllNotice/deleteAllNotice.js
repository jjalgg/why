import prisma from "../../../../utils/prisma";

export default {
  Mutation: {
    deleteAllNotice: async (_, __, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const userId = ctx.state.user.id;
      try {
        await prisma.notice.deleteMany({
          where: {
            ownerId: userId,
          },
        });
        return true;
      } catch {
        return false;
      }
    },
  },
};
