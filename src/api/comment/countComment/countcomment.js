import prisma from "../../../utils/prisma";

export default {
  Query: {
    countComment: (_, { postId }) =>
      prisma.comment.count({ where: { postId } }),
  },
};
