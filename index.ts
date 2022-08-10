import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import * as financials from "./src/financials/card";

dotenv.config();

const app: Express = express();
app.use(cors());
app.set('json spaces', 2);
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is cool");
});

app.post("/createStripeUser", async (req: Request, res: Response) => {
  const account = await financials.registerDAOWithStripe();
  res.json(account);
})

app.get("/getStripeAccountCapabilities/:accountId", async (req: Request, res: Response) => {
  const account = await financials.isAccountVerified(req.params.accountId);
  res.json(account.capabilities);
})

app.post("/createStripeFinancialAccount/:accountId", async (req: Request, res: Response) => {
  const financialAccount = await financials.createBankAccount(req.params.accountId);
  res.json(financialAccount);
})

app.get("/getStripeFinancialAccount/:accountId/:financialAccountId", async (req: Request, res: Response) => {
  const financialAccount = await financials.getFinancialAccount(req.params.financialAccountId, req.params.accountId);
  res.json({active_features: financialAccount.active_features, balance: financialAccount.balance});
})

app.post("/fundFinancialAccount/:accountId/:financialAccountId", async (req: Request, res: Response) => {
  const response = await financials.fundFinancialAccount(req.params.accountId, req.params.financialAccountId);
  res.json(response);
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
