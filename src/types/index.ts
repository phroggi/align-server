import { Request, Response } from "express";
import session from "express-session";
import { Redis } from "ioredis";

export type MyContext = {
  req: Request & { session: session.SessionData };
  redis: Redis;
  res: Response;
};

declare module "express-session" {
  interface Session {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userId: any;
  }
}
