import { ApolloServer } from "apollo-server-express";
import chalk from "chalk";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import "reflect-metadata";

import "dotenv/config";
import { __prod__, COOKIE_NAME } from "./utils/constants";
import { AuthResolver } from "./resolvers/AuthResolver";
import ProductResolver from "./resolvers/ProductResolver";

(async () => {
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    }),
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
        domain: __prod__ ? ".alignofficesystems.com" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "aslkdfjoiq12312",
      resave: false,
    })
  );

  app.get("/", (_req, res) => res.send("hello"));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [AuthResolver, ProductResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(process.env.PORT, () => {
    console.log(
      ` ${chalk.green("✓")} ${chalk.blue(
        ` Listening on port ${process.env.PORT}. Visit http://localhost:${process.env.PORT}/ in your browser.`
      )}`
    );
  });
})().catch((err) => {
  console.error(err);
});
