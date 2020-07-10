import prisma from "../../../../utils/prisma";

export default {
  Query: {
    myInfo: async (_, __, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      try {
        const userId = ctx.state.user.id;
        const myInfo = await prisma.user.findOne({
          where: { id: userId },
          select: {
            logInId: true,
            nick: true,
            email: true,
            createdAt: true,
            followers: true,
            role: true,
            isForbidden: true,
          },
        });
        const postCount = await prisma.post.count({
          where: {
            authorId: userId,
          },
        });
        const commentCount = await prisma.comment.count({
          where: {
            authorId: userId,
          },
        });
        const postLikeCount = await prisma.postLike.count({
          where: {
            post: {
              authorId: userId,
            },
          },
        });
        const commentLikeCount = await prisma.commentLike.count({
          where: {
            comment: {
              authorId: userId,
            },
          },
        });
        const final = {
          userInfo: {
            logInId: myInfo.logInId,
            nick: myInfo.nick,
            email: myInfo.email,
            createdAt: myInfo.createdAt,
            role: myInfo.role,
            isForbidden: myInfo.isForbidden,
          },
          followerCount: myInfo.followers.length,
          postCount,
          commentCount,
          postLikeCount,
          commentLikeCount,
        };
        return final;
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
