export default {
  Query: {
    connections: (_, __, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      return ctx.state.user.id;
    },
  },
};
