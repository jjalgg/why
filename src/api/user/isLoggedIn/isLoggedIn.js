export default {
  Query: {
    isLoggedIn: (_, __, { ctx, isAuthenticated }) => {
      try {
        isAuthenticated(ctx);
        return "true";
      } catch {
        throw Error();
      }
    },
  },
};
