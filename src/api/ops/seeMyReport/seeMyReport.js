import { isAdmin } from "../../../utils/utils";
import prisma from "../../../utils/prisma";

export default {
  Query: {
    seeMyReport: (_, __, { ctx }) => {
      //   isAdmin(ctx);
      const userId = ctx.state.user.id;
      try {
      } catch (err) {
        throw Error();
      }
    },
  },
};
