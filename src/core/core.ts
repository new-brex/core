import { Request, Response } from "express";
import { CreateProposalRequest } from "../types/requestTypes";
import { devnetRealms } from "../blockchain/devnet";
import { mainnetRealms } from "../blockchain/mainnet";
import { DAO } from "../types/objects";
import { getDAOByName, getRealmTransactions } from "../blockchain/realms";
import { establishConnection } from "../blockchain/connection";

/**
 * Creates a proposal.
 */
export async function createProposal(request: CreateProposalRequest) { }

/**
 * Returns all daos
 */
export async function getDAOs(
  req: Request<{}, {}, {}, { endpointType: string }>,
  res: Response
) {
  try {
    const { endpointType } = req.query;

    const realms = endpointType === "mainnet" ? mainnetRealms : devnetRealms;

    return res.status(200).send({
      endpointType,
      realms,
    });
  } catch (err) {
    return res.status(500).send({
      Error: err,
    });
  }
}

/**
 * Returns daos associated with requested daoIds
 */
export async function getDAO(
  req: Request<{}, {}, {}, { endpointType: string; daoIds: string[] }>,
  res: Response
) {
  try {
    const { endpointType, daoIds } = req.query;

    const allRealms: DAO[] =
      endpointType === "mainnet" ? mainnetRealms : devnetRealms;

    const matchedRealms = allRealms.reduce((matchedDAOs: any, currDAO: any) => {
      if (daoIds.includes(currDAO.realmId)) {
        matchedDAOs.push(currDAO);
      }

      return matchedDAOs;
    }, []);

    return res.status(200).send({
      endpointType,
      realms: matchedRealms,
    });
  } catch (err) {
    return res.status(500).send({
      Error: err,
    });
  }
}

/**
 * Returns all transactions for a given DAO:
 * - On chain transactions (TODO)
 * - Proposals
 * - Bank account/virtual card transactions (TODO)
 * 
 * Currently returns just on chain proposals
 */
export async function getTransactions(
  req: Request<{}, {}, {}, { daoName: string }>,
  res: Response
) {
  try {
    const { daoName } = req.query;
    const context = establishConnection("devnet");
    const realm = await getDAOByName(context, daoName);
    const transactions = await getRealmTransactions(context, realm);

    return res.status(200).send({
      transactions
    });
  } catch (err) {
    console.log('ERROR:', err)
    return res.status(500).send({
      Error: err
    })
  }
}
