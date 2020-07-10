// import prisma from "../../../../utils/prisma";

// export default {
//   Query: {
//     myPost: (_, args, { ctx, isAuthenticated }) => {
//       isAuthenticated(ctx);
//       const { volume, cursor } = args;
//       const userId = ctx.state.user.id;
//       try {
//         if (cursor) {
//           return prisma.post.findMany({
//             where: { authorId: userId },
//             cursor: {
//               id: cursor,
//             },
//             take: volume,
//             select: {
//               id: true,
//               postNumber: true,
//               title: true,
//               text: true,
//               url: true,
//               category: true,
//               likeCounts: true,
//               createdAt: true,
//               hits: true,
//             },
//           });
//         } else {
//           return prisma.post.findMany({
//             where: {
//               authorId: userId,
//             },
//             take: volume,
//             select: {
//               id: true,
//               postNumber: true,
//               title: true,
//               text: true,
//               url: true,
//               category: true,
//               likeCounts: true,
//               createdAt: true,
//               hits: true,
//             },
//           });
//         }
//       } catch (err) {
//         throw Error(err);
//       }
//     },
//   },
// };
import prisma from "../../../../utils/prisma";

export default {
  Query: {
    myPost: async (_, args, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const userId = ctx.state.user.id;
      const { volume, cursor, type } = args;
      const cursorObject = {
        id: cursor,
      };

      if (type === "post") {
        try {
          return prisma.post.findMany({
            where: { authorId: userId },
            cursor: cursor ? cursorObject : undefined,
            take: volume,
            select: {
              id: true,
              postNumber: true,
              title: true,
              text: true,
              url: true,
              category: true,
              likeCounts: true,
              createdAt: true,
              hits: true,
              allowComments: true,
            },
          });
        } catch (err) {
          throw Error(err);
        }
      } else if (type === "bookMark")
        try {
          const bookMark = await prisma.bookMark.findMany({
            where: {
              authorId: userId,
            },
            take: volume,
            cursor: cursor ? cursorObject : undefined,
          });

          const postIds = bookMark.map((post) => post.postId);

          let que = [];
          for (let i = 0; i < postIds.length; i++) {
            que.push(
              await prisma.post.findOne({
                where: { id: postIds[i] },
                select: {
                  id: true,
                  postNumber: true,
                  title: true,
                  text: true,
                  url: true,
                  category: true,
                  likeCounts: true,
                  createdAt: true,
                  hits: true,
                  allowComments: true,
                },
              })
            );
          }

          return (await Promise.all(que)).filter((post) => post !== null);
        } catch (err) {
          throw Error(err);
        }
    },
  },
};
