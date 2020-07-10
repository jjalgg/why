import { isAdmin } from "../../../../utils/utils";
import prisma from "../../../../utils/prisma";
import logger from "../../../../config/winston";

export default {
  Mutation: {
    deleteAdminComment: async (_, { commentId }, { ctx }) => {
      isAdmin(ctx);
      const userId = ctx.state.user.id;
      try {
        const autho = await prisma.adminComment.findOne({
          where: { id: commentId },
          select: {
            authorId: true,
          },
        });
        if (autho.authorId === userId) {
          await prisma.adminComment.delete({
            where: {
              id: commentId,
            },
          });
          return commentId;
        } else {
          return null;
        }
      } catch (err) {
        logger.error(err);
        return null;
      }
    },
  },
};
