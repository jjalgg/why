import prisma from "../../../utils/prisma";
import { cleaner } from "../../../utils/utils";

export default {
  Mutation: {
    reportUser: async (_, { commentId, text }, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const { id: userId } = ctx.state.user;
      const cleanedText = cleaner(text);
      try {
        const suspect = await prisma.comment.findOne({
          where: {
            id: commentId,
          },
          select: {
            authorId: true,
            reportCounts: true,
            text: true,
          },
        });

        if (suspect.authorId === userId) {
          throw Error("itsyou");
        }

        const whether = await prisma.report.findMany({
          where: {
            reporter: { in: userId },
            where: { in: commentId },
          },
        });
        if (whether.length > 0) {
          throw Error("exist");
        } else {
          await prisma.report.create({
            data: {
              reporter: userId,
              suspect: suspect.authorId,
              where: commentId,
              report: cleanedText.slice(0, 40) || "",
              original: `원댓글: ${suspect.text}`,
              type: "comment",
            },
          });

          if (suspect.authorId) {
            const newCounts = await prisma.user.findOne({
              where: {
                id: suspect.authorId,
              },
              select: {
                reportCounts: true,
              },
            });

            await prisma.user.update({
              where: {
                id: suspect.authorId,
              },
              data: {
                reportCounts: newCounts.reportCounts + 1,
              },
            });
          }
          return true;
        }
      } catch (error) {
        throw Error(error);
      }
    },
  },
};
