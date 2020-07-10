import prisma from "../../../../utils/prisma";

export default {
  Query: {
    isLiked: async (_, { postId }, { ctx, isAuthenticated }) => {
      try {
        isAuthenticated(ctx);
        const userId = ctx.state.user.id;
        const result = await prisma.postLike.findMany({
          where: {
            AND: {
              postId,
              authorId: userId,
            },
          },
        });
        if (result.length === 0) {
          return false;
        } else {
          return true;
        }
      } catch {
        throw Error();
      }
    },
  },
};
