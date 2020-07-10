import { generatePutUrl } from "../../../utils/aws/AWSpresigner";

export default {
  Mutation: {
    uploadUrl: (_, args, { ctx, isAuthenticated }) => {
      // isAuthenticated(ctx);
      const role = ctx.state.user ? ctx.state.user.role : null;
      const { key, ContentType } = args;
      const month = new Date().toLocaleString("en-us", { month: "2-digit" });
      try {
        // if (role === "VIEWER") {
        //   throw Error("no authorization");
        // }

        if (ContentType.includes("gif")) {
          return generatePutUrl(`animated${month}/${key}`, ContentType);
        } else {
          return generatePutUrl(`image${month}/${key}`, ContentType);
        }
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
