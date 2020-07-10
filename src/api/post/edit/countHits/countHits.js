import prisma from "../../../../utils/prisma";

export default {
  Query: {
    countHits: async (_, args) => {
      const { id } = args;
      const { hits: hit } = await prisma.post.findOne({
        where: { id },
        select: { hits: true },
      });
      await prisma.post.update({
        where: { id },
        data: {
          hits: hit + 1,
        },
      });
      return null;
    },
  },
};
