import prisma from "../../../../utils/prisma";
import bcrypt from "bcrypt";

export default {
  Mutation: {
    passCheck: async (_, { password }, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const userId = ctx.state.user.id;

      try {
        const result = await prisma.user.findOne({
          where: {
            id: userId,
          },
          select: {
            password: true,
          },
        });
        const final = await bcrypt.compare(password, result.password);
        if (final) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
