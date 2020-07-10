import prisma from "../../../utils/prisma";

export default {
  Post: {
    author: ({ id }) =>
      prisma.post.findOne({
        where: { id },
        select: {
          author: true,
        },
      }),
  },
};
