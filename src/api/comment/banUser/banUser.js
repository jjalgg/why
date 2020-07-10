import prisma from "../../../utils/prisma";

export default {
  Mutation: {
    banUser: async (_, { commentId }, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const { id: userId } = ctx.state.user;
      try {
        const { authorId } = await prisma.comment.findOne({
          where: { id: commentId },
        });

        if (authorId === userId) {
          throw Error("itsyou");
        } else {
          const result = await prisma.user.findOne({
            where: {
              id: userId,
            },
            select: {
              banList: true,
            },
          });

          const oldBanList = result.banList;
          const newBanList = [...oldBanList, authorId];

          await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              banning: {
                connect: {
                  id: authorId,
                },
              },
              banList: {
                set: newBanList,
              },
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
