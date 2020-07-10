import prisma from "../../../utils/prisma";
import { isAdmin } from "../../../utils/utils";

export default {
  Query: {
    seeDetail: async (_, args, { ctx }) => {
      isAdmin(ctx);
      const { id, type } = args;

      try {
        if (type === "post") {
          const post = await prisma.post.findOne({
            where: {
              id,
            },
            select: {
              title: true,
              text: true,
              url: true,
              createdAt: true,
              published: true,
            },
          });
          if (post === null) {
            return {};
          }
          return {
            title: post.title,
            text: post.text,
            url: post.url,
            createdAt: post.createdAt,
            published: post.published,
          };
        } else if (type === "comment") {
          const comment = await prisma.comment.findOne({
            where: {
              id,
            },
            select: {
              text: true,
              createdAt: true,
              published: true,
            },
          });
          if (comment === null) {
            return {};
          }
          return {
            text: comment.text,
            createdAt: comment.createdAt,
            published: comment.published,
          };
        }
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
