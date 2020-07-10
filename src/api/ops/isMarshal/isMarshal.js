export default {
  Query: {
    isMarshal: (_, __, { ctx, isAuthenticated }) => {
      isAuthenticated(ctx);
      const role = ctx.state.user.role;
      if (role === "MARSHAL" || role === "ADMIN") {
        return true;
      } else {
        return false;
      }
    },
  },
};
