import { randomUUID } from "crypto";
import { Pool, QueryResult } from "pg";
import { CardType, MultiSigDetails, ProposalStatus } from "../types/objects";
import { CreateProposalRequest, ProposalType } from "../types/requestTypes";

export class Database {
  pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.PG_USERNAME,
      database: "app",
      password: "",
      host: "127.0.0.1",
      port: 5432,
    });
  }

  async query(queryString: string): Promise<QueryResult<any>> {
    var client = await this.pool.connect();
    var result = await client.query(queryString);
    client.release();
    return result;
  }

  async createDAO(chainID: string, name: string) {
    const id: string = randomUUID();
    var query: string = `INSERT INTO DAO (ID, CHAIN_ID, NAME) VALUES ('${id}', '${chainID}', '${name}')`;
    this.query(query);
  }

  async createBankAccount(daoID: string, multiSigDetails: MultiSigDetails) {
    const id: string = randomUUID();
    var query: string = `INSERT INTO BANK_ACCOUNT (ID, DAO_ID, MULTI_SIG_DETAILS) VALUES ('${id}', '${daoID}', '${multiSigDetails}')`;
    this.query(query);
  }

  async createCard(
    cardType: CardType,
    daoID: string,
    bankAccountID: string | null
  ) {
    const id: string = randomUUID();
    const bankAccount = bankAccountID ? `'${bankAccountID}'` : "null";

    var query: string = `INSERT INTO CARD (ID, CARD_TYPE, DAO_ID, BANK_ACCOUNT_ID) VALUES ('${id}', '${cardType}', '${daoID}', ${bankAccount})`;
    this.query(query);
  }

  async createProposal(daoID: string, requestOptions: CreateProposalRequest) {
    const status: ProposalStatus = "pending";
    const id: string = randomUUID();
    var query: string = `INSERT INTO PROPOSAL (ID, DAO_ID, OPTIONS, PROPOSAL_STATUS) VALUES ('${id}', '${daoID}', '${requestOptions}', '${status}')`;
    this.query(query);
  }
}
