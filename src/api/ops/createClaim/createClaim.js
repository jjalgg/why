import prisma from "../../../utils/prisma";
import { cleaner } from "../../../utils/utils";

export default {
  Mutation: {
    createClaim: async (_, args, { ctx }) => {
      const { type, title, text, email } = args;
      const cleanedTitle = cleaner(title);
      const cleanedText = cleaner(text);
      const cleanedEmail = cleaner(email);
      if (ctx.state.user) {
        const userId = ctx.state.user.id;
        try {
          await prisma.claim.create({
            data: {
              type,
              title: cleanedTitle,
              text: cleanedText,
              email: cleanedEmail,
              author: {
                connect: {
                  id: userId,
                },
              },
            },
          });
          return true;
        } catch {
          throw Error("Please LogIn");
        }
      } else {
        try {
          await prisma.claim.create({
            data: {
              type,
              title: cleanedTitle,
              text: cleanedText,
              email: cleanedEmail,
            },
          });
          return true;
        } catch {
          throw Error("err");
        }
      }
    },
  },
};
