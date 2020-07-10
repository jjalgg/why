export default {
  Query: {
    logInCheck: (_, __, { ctx }) => {
      if (ctx.state.user) {
        return true;
      } else {
        return false;
      }
    },
  },
};
