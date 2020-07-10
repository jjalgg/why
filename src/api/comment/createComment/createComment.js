import prisma from "../../../utils/prisma";
import logger from "../../../config/winston";

import { cleaner } from "../../../utils/utils";

const COMMENT_ADDED = "COMMENT_ADDED";

export default {
  Mutation: {
    createComment: async (_, args, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const {
        state: {
          user: { id: userId },
        },
      } = ctx;
      const { postId, text } = args;
      const cleanedText = cleaner(text);

      try {
        const result = await prisma.user.findOne({
          where: {
            id: userId,
          },
          select: {
            isForbidden: true,
            nick: true,
          },
        });
        if (result.isForbidden) {
          throw Error("forbidden");
        } else {
          const { authorId, title, postNumber } = await prisma.post.findOne({
            where: { id: postId },
            select: { authorId: true, title: true, postNumber: true },
          });
          if (authorId) {
            await prisma.notice.create({
              data: {
                owner: {
                  connect: {
                    id: authorId,
                  },
                },
                title: title,
                text: cleanedText.slice(0, 30),
                postNumber: postNumber,
                type: "nc",
              },
            });
          }
          return prisma.comment.create({
            data: {
              author: {
                connect: {
                  id: userId,
                },
              },
              post: { connect: { id: postId } },
              text: cleanedText,
              nick: result.nick,
            },
          });
        }
      } catch (err) {
        logger.error(err);
        throw Error(err);
      }
    },
  },
};
