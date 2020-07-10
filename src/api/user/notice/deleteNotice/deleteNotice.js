import prisma from "../../../../utils/prisma";

export default {
  Mutation: {
    deleteNotice: async (_, { id }, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const userId = ctx.state.user.id;
      try {
        await prisma.notice.deleteMany({
          where: {
            id,
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
