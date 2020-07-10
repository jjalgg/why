import prisma from "../../../../utils/prisma";
import { deleteObjects } from "../../../../utils/aws/AWSpresigner";

export default {
  Mutation: {
    deletePost: async (_, { id, url }, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const userId = ctx.state.user.id;
      const post = await prisma.post.findOne({
        where: {
          id,
        },
        select: {
          authorId: true,
        },
      });
      if (post.authorId === userId) {
        const urls = [];
        for (let i = 0; i < url.length; i++) {
          const object = {};
          object.Key = `image/${url[i]}`;
          urls.push(object);
        }
        try {
          if (url.length > 0) await deleteObjects(urls);
          const { title } = await prisma.post.delete({
            where: {
              id,
            },
          });
          return title;
        } catch (err) {
          throw Error(err);
        }
      } else {
        throw Error("Unauthorized");
      }
    },
  },
};
