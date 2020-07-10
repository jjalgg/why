import { isAdmin, cleaner } from "../../../../utils/utils";
import prisma from "../../../../utils/prisma";
import logger from "../../../../config/winston";

export default {
  Mutation: {
    writeAdminComment: async (_, args, { ctx }) => {
      isAdmin(ctx);
      const userId = ctx.state.user.id;
      try {
        const { postId, text: rawText } = args;
        const text = cleaner(rawText);
        await prisma.adminComment.create({
          data: {
            post: {
              connect: {
                id: postId,
              },
            },
            author: {
              connect: {
                id: userId,
              },
            },
            text,
          },
        });
        return true;
      } catch (err) {
        logger.error(err);
        return false;
      }
    },
  },
};
