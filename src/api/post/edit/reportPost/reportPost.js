import prisma from "../../../../utils/prisma";
import { prismaVersion } from "@prisma/client";
import { cleaner } from "../../../../utils/utils";
import logger from "../../../../config/winston";

export default {
  Mutation: {
    reportPost: async (_, args, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const { postId, text } = args;
      const cleanedText = cleaner(text);
      const { id: userId } = ctx.state.user;
      try {
        const suspect = await prisma.post.findOne({
          where: {
            id: postId,
          },
          select: {
            authorId: true,
            reportCounts: true,
            text: true,
            title: true,
          },
        });

        let suspectId = suspect.authorId;

        //cascading delete 안돼서 문제
        // if (suspectId === null) return true;

        if (suspectId === userId) throw Error("itsyou");

        const exist = await prisma.report.findMany({
          where: {
            reporter: { in: userId },
            where: { in: postId },
          },
        });

        if (exist.length > 0) {
          throw Error("exist");
        } else {
          await prisma.report.create({
            data: {
              reporter: userId,
              suspect: suspectId,
              where: postId,
              report: cleanedText.slice(0, 40) || "",
              original: `원글: 제목:${suspect.title} \n 내용:${suspect.text}`,
              type: "post",
            },
          });
          if (suspectId) {
            const newCount = await prisma.user.findOne({
              where: {
                id: suspectId,
              },
              select: {
                reportCounts: true,
              },
            });
            await prisma.user.update({
              where: {
                id: suspectId,
              },
              data: {
                reportCounts: newCount.reportCounts + 1,
              },
            });
          }
          await prisma.post.update({
            where: { id: postId },
            data: {
              reportCounts: suspect.reportCounts + 1,
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
