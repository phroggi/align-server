import chalk from "chalk";
import express from "express";
import { createConnection } from "typeorm";

import "dotenv/config";

(async () => {
  const app = express();

  app.get("/", (_req, res) => res.send("hello"));

  await createConnection();

  app.listen(process.env.PORT, () => {
    console.log(
      ` ${chalk.green("✓")} ${chalk.blue(
        ` Listening on port ${process.env.PORT}. Visit http://localhost:${process.env.PORT}/ in your browser.`
      )}`
    );
  });
})();
