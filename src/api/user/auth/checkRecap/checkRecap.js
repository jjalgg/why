import axios from "axios";
import logger from "../../../../config/winston";

export default {
  Mutation: {
    checkRecap: async (_, { token }, { ctx }) => {
      const options = {
        secret: process.env.RECAPTCHA_SECRET,
        response: token,
      };
      try {
        const result = await axios
          .post("https://www.google.com/recaptcha/api/siteverify", null, {
            params: options,
          })
          .then(({ data }) => {
            if (data.success) {
              return true;
            } else {
              const current_ip =
                ctx.ips.length > 0 ? ctx.ips[ctx.ips.length - 1] : ctx.ip;
              logger.error(`captcha flase : ${ctx.request.ip} ${current_ip}`);
              return false;
            }
          })
          .catch((err) => {
            logger.error(err);
            return false;
          });
        return result;
      } catch (err) {
        logger.error(err);
        return false;
      }
    },
  },
};
