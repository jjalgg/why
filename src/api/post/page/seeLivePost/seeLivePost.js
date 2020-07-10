import prisma from "../../../../utils/prisma";
import { dayRange } from "../../../../utils/utils";
import logger from "../../../../config/winston";

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
    seeLivePost: async (_, args, { ctx }) => {
      const { volume, cursor, day: wantDayNumber } = args;
      const { wantDayISO, plusDayISO } = dayRange(wantDayNumber);

      const cursorObject = {
        id: cursor,
      };
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
            cursor: cursor ? cursorObject : undefined,
            take: volume,
            orderBy: { createdAt: "desc" },
            where: {
              createdAt: {
                gte: wantDayISO,
                lte: plusDayISO,
              },
              published: true,
              authorId: {
                notIn: banList,
              },
            },
            select: selectFields,
          });
        } catch (err) {
          logger.error(err);
          return [];
        }
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
            cursor: cursor ? cursorObject : undefined,
            take: volume,
            orderBy: { createdAt: "desc" },
            select: selectFields,
          });
        } catch (err) {
          logger.error(err);
          return [];
        }
      }
    },
  },
};
