import { isAdmin } from "../../../../utils/utils";
import prisma from "../../../../utils/prisma";

export default {
  Mutation: {
    addAdminComment: async (_, args, { ctx }) => {
      isAdmin(ctx);
      const userId = ctx.state.user.id;
      try {
        const { text, postId } = args;
        await prisma.adminComment.create({
          data: {
            author: {
              connect: {
                id: userId,
              },
            },
            post: {
              connect: {
                id: postId,
              },
            },
            text,
          },
        });
        return true;
      } catch {
        return false;
      }
    },
  },
};
