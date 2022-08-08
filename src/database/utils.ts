import { Pool, QueryResult } from "pg";

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
}
