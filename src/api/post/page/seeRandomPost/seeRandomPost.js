import prisma from "../../../../utils/prisma";

export default {
  Query: {
    seeRandomPost: async (_, args, { ctx }) => {
      const { volume, category } = args;
      try {
        if (ctx.state.user) {
          const { banList } = await prisma.user.findOne({
            where: {
              id: ctx.state.user.id,
            },
            select: {
              banList: true,
            },
          });
          const data = await prisma.queryRaw`SELECT * FROM "Post" order by random() limit ${volume}`;
          const result = data.filter((post) => post.published === true);

          if (banList.length > 0) {
            const final = result.filter(
              (object) => !banList.includes(object.authorId)
            );

            if (final.length > 0) {
              return final;
            } else {
              const data = await prisma.queryRaw`SELECT * FROM "Post" order by random() limit ${
                volume + 5
              }`;
              const result = data.filter((post) => post.published === true);
              const final = result.filter(
                (object) => !banList.includes(object.authorId)
              );

              if (final.length > 0) {
                return final;
              } else {
                return [];
              }
            }
          } else {
            return result;
          }
        } else {
          const data = await prisma.queryRaw`SELECT * FROM "Post" order by random() limit ${volume}`;
          const result = data.filter((post) => post.published === true);
          return result;
        }
      } catch {
        return [];
      }
    },
  },
};
