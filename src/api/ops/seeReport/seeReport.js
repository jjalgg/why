import prisma from "../../../utils/prisma";
import { isAdmin } from "../../../utils/utils";

export default {
  Query: {
    seeReport: (_, __, { ctx }) => {
      // const auth = isAdmin(ctx);
      try {
        return prisma.report.findMany({
          take: 15,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            reporter: true,
            suspect: true,
            where: true,
            report: true,
            type: true,
            done: true,
            createdAt: true,
            penalty: true,
          },
        });
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
