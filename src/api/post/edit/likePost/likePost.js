import prisma from "../../../../utils/prisma";
import logger from "../../../../config/winston";

const POST_LIKED = "POST_LIKED";

export default {
  Mutation: {
    likePost: async (_, args, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const { postId } = args;
      const { id: userId } = ctx.state.user;
      try {
        const post = await prisma.post.findOne({
          where: { id: postId },
          select: {
            title: true,
            authorId: true,
            likeCounts: true,
            postNumber: true,
          },
        });

        if (post.authorId === userId) throw Error("itsyou");

        const exist = await prisma.postLike.findMany({
          where: { postId, authorId: userId },
        });
        if (exist.length > 0) {
          let final;
          if (post.likeCounts <= 0) {
            final = 0;
          } else {
            final = post.likeCounts - 1;
          }
          await prisma.postLike.deleteMany({
            where: { postId, authorId: userId },
          });
          await prisma.post.update({
            where: { id: postId },
            data: { likeCounts: final },
          });
          return false;
        } else {
          await prisma.post.update({
            where: { id: postId },
            data: { likeCounts: post.likeCounts + 1 },
          });
          await prisma.postLike.create({
            data: {
              author: { connect: { id: userId } },
              post: { connect: { id: postId } },
            },
          });
          await prisma.notice.create({
            data: {
              owner: {
                connect: {
                  id: post.authorId,
                },
              },
              title: post.title,
              text: "",
              postNumber: post.postNumber,
              type: "lp",
            },
          });
          return true;
        }
      } catch (err) {
        logger.error(err);
        throw Error(err);
      }
    },
  },
};
