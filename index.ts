import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import * as financials from "./src/financials/card";

async function main() {
  dotenv.config();

  const app: Express = express();
  const port = process.env.PORT;

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

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
}

main();
