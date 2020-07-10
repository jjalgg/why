import prisma from "../../../../utils/prisma";
import { dayRange } from "../../../../utils/utils";

const selectFields = {
  id: true,
  postNumber: true,
  title: true,
  text: true,
  url: true,
  category: true,
  likeCounts: true,
  reportCounts: true,
  createdAt: true,
  postNumber: true,
  allowComments: true,
};

export default {
  Query: {
    seeRankPost: async (_, { day: wantDayNumber }, { ctx }) => {
      const { wantDayISO, plusDayISO } = dayRange(wantDayNumber);

      if (ctx.state.user) {
        try {
          const { banList } = await prisma.user.findOne({
            where: {
              id: ctx.state.user.id,
            },
            select: {
              banList: true,
            },
          });
          return prisma.post.findMany({
            where: {
              createdAt: {
                gte: wantDayISO,
                lte: plusDayISO,
              },
              authorId: {
                notIn: banList,
              },
              published: true,
            },
            orderBy: {
              likeCounts: "desc",
            },
            take: 77,
            select: selectFields,
          });
        } catch (err) {}
      } else {
        try {
          return prisma.post.findMany({
            where: {
              createdAt: {
                gte: wantDayISO,
                lte: plusDayISO,
              },
              published: true,
            },
            orderBy: {
              likeCounts: "desc",
            },
            take: 60,
            select: selectFields,
          });
        } catch (err) {
          return [];
        }
      }
    },
  },
};
