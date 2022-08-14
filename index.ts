import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import * as financials from "./src/financials/card";
import {
  ConnectionContext,
  establishConnection,
} from "./src/blockchain/connection";
import { Database } from "./src/database/database";
import { readFileSync } from "fs";
import { getDAOs, getDAO } from "./src/core/core";
import cors from "cors";

async function main() {
  dotenv.config();

  const app: Express = express();
  const port = process.env.PORT;

  const context: ConnectionContext = establishConnection("devnet");
  const db: Database = new Database();

  app.use(cors());

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server is cool");
  });

  app.get("/stripeTest", async (req: Request, res: Response) => {
    const stripeAccount = await financials.registerDAOWithStripe();
    console.log(
      "Created and verified Stripe connected account:",
      stripeAccount.id
    );
    const financialAccount = await financials.createBankAccount(
      stripeAccount.id
    );
    console.log("Created and funded financial account:", financialAccount.id);
    const card = await financials.createCard(
      stripeAccount.id,
      financialAccount.id
    );
    res.send(`${JSON.stringify(card)}`);
  });

  app.get("/seedDB", async (req: Request, res: Response) => {
    console.log("Seeding DB");
    const seedQuery = readFileSync("./src/database/seeding.sql", {
      encoding: "utf-8",
    });
    await db.query(seedQuery);
    console.log("Database seeded");
  });

  app.get("/daos", getDAOs);
  app.get("/dao", getDAO);

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
}

main();
