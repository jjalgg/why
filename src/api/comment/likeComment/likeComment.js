import prisma from "../../../utils/prisma";

const COMMENT_LIKED = "COMMENT_LIKED";

export default {
  Mutation: {
    likeComment: async (_, { commentId, postId }, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const { id: userId } = ctx.state.user;
      try {
        const post = await prisma.post.findOne({
          where: {
            id: postId,
          },
          select: {
            authorId: true,
            title: true,
            postNumber: true,
          },
        });
        const exist = await prisma.comment.findOne({
          where: {
            id: commentId,
          },
          select: {
            authorId: true,
            likeCounts: true,
            text: true,
          },
        });
        if (exist.authorId === userId) throw Error("itsyou");

        const result = await prisma.user.findOne({
          where: {
            id: userId,
          },
          select: {
            isForbidden: true,
          },
        });
        if (result.isForbidden) {
          throw Error("forbidden");
        } else {
          const whether = await prisma.comment.findMany({
            where: {
              id: commentId,
              commentLike: {
                some: {
                  authorId: userId,
                },
              },
            },
            select: {
              likeCounts: true,
            },
          });
          if (whether.length > 0) {
            const count = whether[0].likeCounts;
            await prisma.commentLike.deleteMany({
              where: {
                authorId: userId,
                commentId,
              },
            });
            await prisma.comment.update({
              where: {
                id: commentId,
              },
              data: {
                likeCounts: count - 1,
              },
            });
            return count - 1;
          } else {
            const count = exist.likeCounts;
            await prisma.notice.create({
              data: {
                owner: {
                  connect: {
                    id: exist.authorId,
                  },
                },
                postNumber: post.postNumber,
                title: post.title,
                text: exist.text,
                type: "lc",
              },
            });
            await prisma.commentLike.create({
              data: {
                author: { connect: { id: userId } },
                comment: { connect: { id: commentId } },
              },
            });
            await prisma.comment.update({
              where: { id: commentId },
              data: {
                likeCounts: count + 1,
              },
            });
            return count + 1;
          }
        }
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
