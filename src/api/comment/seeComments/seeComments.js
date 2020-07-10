import prisma from "../../../utils/prisma";

const selectFields = {
  id: true,
  nick: true,
  text: true,
  createdAt: true,
  likeCounts: true,
  reportCounts: true,
};

export default {
  Query: {
    seeComments: async (_, { postId }, { ctx }) => {
      if (ctx.state.user) {
        try {
          const { banList } = await prisma.user.findOne({
            where: { id: ctx.state.user.id },
            select: {
              banList: true,
            },
          });
          if (banList.length > 0) {
            return prisma.comment.findMany({
              where: {
                postId,
                published: true,
                authorId: {
                  notIn: banList,
                },
              },
              select: selectFields,
            });
          } else {
            return prisma.comment.findMany({
              where: { postId, published: true },
              select: selectFields,
              orderBy: {
                createdAt: "asc",
              },
            });
          }
        } catch (err) {
          throw Error();
        }
      } else {
        try {
          return prisma.comment.findMany({
            where: {
              postId,
              published: true,
            },
            select: selectFields,
          });
        } catch (err) {
          throw Error(err);
        }
      }
    },
  },
};
