import prisma from "../../../utils/prisma";

export default {
  Mutation: {
    allowComments: async (_, { postId }, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const userId = ctx.state.user.id;
      try {
        const post = await prisma.post.findOne({
          where: {
            id: postId,
          },
          select: {
            authorId: true,
            allowComments: true,
          },
        });
        if (userId !== post.authorId) {
          throw Error("Unauthorized");
        } else {
          await prisma.post.update({
            where: {
              id: postId,
            },
            data: {
              allowComments: !post.allowComments,
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
