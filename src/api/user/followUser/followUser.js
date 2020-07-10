import prisma from "../../../utils/prisma";

export default {
  Mutation: {
    followUser: async (_, { postId }, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      try {
        const userId = ctx.state.user.id;
        const { authorId } = await prisma.post.findOne({
          where: {
            id: postId,
          },
          select: {
            authorId: true,
          },
        });

        if (authorId === userId) throw Error("itsyou");

        const my = await prisma.user.findOne({
          where: {
            id: userId,
          },
          select: {
            followList: true,
          },
        });
        const exist = my.followList.includes(authorId);

        if (exist) {
          return true;
        } else {
          const newList = [...my.followList, authorId];

          await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              following: {
                connect: {
                  id: authorId,
                },
              },
              followList: {
                set: newList,
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
