import prisma from "../../../../utils/prisma";

export default {
  Query: {
    myForbidden: async (_, __, { ctx, isAuthenticated }) => {
      //   isAuthenticated(ctx);
      const userId = ctx.state.user.id;
      try {
        const result = await prisma.forbidden.findMany({
          where: {
            subject: {
              id: userId,
            },
          },
          take: -1,
        });
        return result[0];
      } catch (err) {
        console.log(err);
        throw Error(err);
      }
    },
  },
};
