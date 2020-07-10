import { isAdmin } from "../../../utils/utils";
import prisma from "../../../utils/prisma";

export default {
  Query: {
    seeAllContent: async (_, args, { ctx }) => {
      //   isAdmin(ctx);
      const { volume, cursor, section } = args;
      const cursorObject = {
        id: cursor,
      };
      try {
        if (section === "post") {
          return prisma.post.findMany({
            take: volume,
            orderBy: {
              createdAt: "desc",
            },
            cursor: cursor ? cursorObject : undefined,
            select: {
              id: true,
              createdAt: true,
              title: true,
              text: true,
              category: true,
              penalty: true,
              published: true,
            },
          });
        } else {
          return prisma.comment.findMany({
            take: volume,
            orderBy: {
              createdAt: "desc",
            },
            cursor: cursor ? cursorObject : undefined,
            select: {
              id: true,
              createdAt: true,
              text: true,
              penalty: true,
              published: true,
            },
          });
        }
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
