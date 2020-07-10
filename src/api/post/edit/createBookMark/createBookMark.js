import prisma from "../../../../utils/prisma";

export default {
  Mutation: {
    createBookMark: async (_, { postId }, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      try {
        const userId = ctx.state.user.id;

        const exist = await prisma.bookMark.findMany({
          where: {
            postId,
            authorId: userId,
          },
        });

        if (exist.length > 0) {
          return false;
        } else {
          await prisma.bookMark.create({
            data: {
              author: {
                connect: {
                  id: userId,
                },
              },
              postId,
            },
          });
          return true;
        }
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
