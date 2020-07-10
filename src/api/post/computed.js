import prisma from "../../utils/prisma";

export default {
  Post: {
    isLiked: async (parent, _, { ctx }) => {
      const { id } = parent;

      try {
        const result = await prisma.post.findMany({
          where: {
            AND: {
              id,
              PostLike: {
                some: {
                  authorId: userId,
                },
              },
            },
          },
        });
        if (result.length === 0) {
          return false;
        } else {
          return true;
        }
      } catch {
        return false;
      }
    },
    author: (
      { authorId },
      _,
      {
        ctx: {
          user: { id: userId },
        },
      }
    ) => prisma.user.findOne({ where: { id: authorId } }),
    commentsCount: ({ id }) => prisma.comment.count({ where: { postId: id } }),
  },
};
