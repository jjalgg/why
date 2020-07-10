import prisma from "../../../../utils/prisma";

export default {
  Mutation: {
    banPost: async (_, { postId }, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const { id: userId } = ctx.state.user;
      try {
        const banner = await prisma.post.findOne({
          where: { id: postId },
          select: {
            authorId: true,
          },
        });

        if (banner.authorId === userId) throw Error("itsyou");
        if (banner.authorId === null) return true;

        const result = await prisma.user.findOne({
          where: {
            id: userId,
          },
          select: {
            banList: true,
          },
        });

        const oldBanList = result.banList;
        const newBanList = [...oldBanList, banner.authorId];

        await prisma.user.update({
          where: { id: userId },
          data: {
            banning: {
              connect: {
                id: banner.authorId,
              },
            },
            banList: {
              set: newBanList,
            },
          },
        });
        return true;
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
