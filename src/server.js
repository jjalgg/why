import Koa from "koa";
import cors from "@koa/cors";
import { ApolloServer } from "apollo-server-koa";
import RateLimit from "koa2-ratelimit";
import http from "http";
import compress from "koa-compress";
import helmet from "koa-helmet";

import jwtMiddleware from "./utils/middleWares/jwtMiddleware";
import bakerMiddleware from "./utils/middleWares/cloudFMiddleware";
import hurdleMiddleware from "./utils/middleWares/hurdleMiddleware";

import schema from "./schema";
import { isAuthenticated, verifyWsToken } from "./utils/utils";
import logger from "./config/winston";

const PORT = process.env.PORT || 3232;

const app = new Koa();

app.use(helmet());

app.use(async function handleError(context, next) {
  try {
    await next();
  } catch (error) {
    context.status = 500;
    context.body = error;
  }
});

app.use(
  compress({
    filter(content_type) {
      return /text/i.test(content_type);
    },
    threshold: 2048,
    gzip: {
      flush: require("zlib").Z_SYNC_FLUSH,
    },
    deflate: {
      flush: require("zlib").Z_SYNC_FLUSH,
    },
    br: false, // disable brotli
  })
);

var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

const limiter = RateLimit.RateLimit.middleware({
  interval: { min: 1 },
  max: 100,
  message: "Are you a robot?",
});

app.use(limiter);
app.use(jwtMiddleware);
// // app.use(hurdleMiddleware);
// // app.use(bakerMiddleware);

// app.use(middleLogger());
// app.use(middleLogger(":method :url"));

const server = new ApolloServer({
  schema,
  context: ({ ctx, connection }) => ({ ctx, isAuthenticated }),
});

server.applyMiddleware({ app, path: "/api/ql", cors: false });

const httpServer = app.listen(PORT, () => {
  logger.info(`app is listening on port ${PORT}`);
  console.log(`app is listening on port ${PORT}`);
});

server.installSubscriptionHandlers(httpServer);

// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
// httpServer.on("error", (e) => console.log(e));
