import prisma from "../../../utils/prisma";

export default {
  Query: {
    getInfo: async () => {
      const text = await prisma.post.findOne({
        where: {
          id: "ckc4d5cfe0000rwuduvdb6u04",
        },
      });

      return [text.title, text.text];
    },
  },
};
