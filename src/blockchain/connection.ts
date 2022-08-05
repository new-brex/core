import { Connection } from "@solana/web3.js";

export type EndpointType = "mainnet" | "devnet" | "localnet";

export interface Endpoint {
  endpointType: EndpointType;
  url: string;
}

export interface ConnectionContext {
  endpointType: EndpointType;
  connection: Connection;
  url: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    endpointType: "mainnet",
    url: process.env.MAINNET_RPC || "https://api.dao.solana.com/",
  },
  {
    endpointType: "devnet",
    url: process.env.DEVNET_RPC || "https://api.dao.devnet.solana.com/",
  },
];

export function establishConnection(
  endpointType: EndpointType | null
): ConnectionContext {
  const ENDPOINT =
    ENDPOINTS.find((e) => e.endpointType === endpointType) || ENDPOINTS[0];

  return {
    endpointType: ENDPOINT.endpointType,
    connection: new Connection(ENDPOINT.url, "recent"),
    url: ENDPOINT.url,
  };
}
