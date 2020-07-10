import prisma from "../../../../utils/prisma";

export default {
  Mutation: {
    deleteBookMark: async (_, { postId }, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const userId = ctx.state.user.id;
      try {
        const bookMarkId = await prisma.bookMark.findMany({
          where: {
            authorId: userId,
            postId,
          },
          select: {
            id: true,
          },
        });
        if (bookMarkId && bookMarkId.length > 0) {
          await prisma.bookMark.delete({
            where: {
              id: bookMarkId[0].id,
            },
          });
          return true;
        }
        return true;
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
