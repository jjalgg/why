import prisma from "../../../../utils/prisma";
import { sanitizer, cleaner } from "../../../../utils/utils";

export default {
  Mutation: {
    createPost: async (_, args, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const { title, text, url, category, isHtml } = args;
      const userId = ctx.state.user.id;
 
      let editText;
      let editHtml = false;

      if (isHtml) {
        editText = sanitizer(text);
        editHtml = true;
      }
      const cleanedTitle = cleaner(title);
      editText = cleaner(text);

      try {
        const result = await prisma.user.findOne({
          where: {
            id: userId,
          },
          select: {
            isForbidden: true,
          },
        });
        if (result.isForbidden) {
          throw Error("forbidden");
        } else {
          await prisma.post.create({
            data: {
              title: cleanedTitle,
              text: editText,
              url: {
                set: url || [],
              },
              category,
              author: {
                connect: {
                  id: userId,
                },
              },
              isHtml: editHtml,
            },
          });
          return true;
        }
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
