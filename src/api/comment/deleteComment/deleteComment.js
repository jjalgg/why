import prisma from "../../../utils/prisma";

export default {
  Mutation: {
    deleteComment: async (_, args, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const userId = ctx.state.user.id;
      const userRole = ctx.state.user.role;
      const { commentId, postId } = args;

      try {
        if (userRole === ("MARSHAL" || "ADMIN")) {
          await prisma.comment.delete({
            where: {
              id: commentId,
            },
          });
          return true;
        }

        const auth = await prisma.comment.findOne({
          where: {
            id: commentId,
          },
          select: {
            authorId: true,
          },
        });

        if (auth === null || auth.authorId === null) {
          return false;
        }

        if (auth.authorId === userId) {
          await prisma.comment.delete({
            where: {
              id: commentId,
            },
          });
          return true;
        } else if (auth.authorId !== userId) {
          const post = await prisma.post.findOne({
            where: { id: postId },
            select: { authorId: true },
          });
          if (post.authorId === userId) {
            await prisma.comment.delete({
              where: {
                id: commentId,
              },
            });
            return true;
          }
        } else {
          return false;
        }
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
