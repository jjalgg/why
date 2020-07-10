import { isAdmin, cleaner } from "../../../../utils/utils";
import prisma from "../../../../utils/prisma";

export default {
  Mutation: {
    writeAdminPost: async (_, args, { ctx }) => {
      isAdmin(ctx);
      const userId = ctx.state.user.id;
      try {
        const { title: rawTitle, text: rawText } = args;
        const title = cleaner(rawTitle);
        const text = cleaner(rawText);

        await prisma.adminPost.create({
          data: {
            author: {
              connect: {
                id: userId,
              },
            },
            title,
            text,
          },
        });
        return true;
      } catch (err) {
        return false;
      }
    },
  },
};
