import { isAdmin } from "../../../utils/utils";
import prisma from "../../../utils/prisma";

export default {
  Query: {
    seeMyPenalty: (_, __, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      isAdmin(ctx);
      const userId = ctx.state.user.id;
      try {
        return prisma.penalty.findMany({
          where: {
            marshal: userId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 20,
        });
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
