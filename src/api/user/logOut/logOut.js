export default {
  Mutation: {
    logOut: (_, __, { ctx }) => {
      ctx.cookies.set("jetton");
      return "bye";
    },
  },
};
