import { getRealms, ProgramAccount, Realm } from "@solana/spl-governance";
import { PublicKey } from "@solana/web3.js";
import { Proposal, Transaction } from "../core/types";
import { getUniqueKeys } from "../utils/helpers";
import { ConnectionContext } from "./connection";
import { devnetRealms } from "./devnet";

/**
 * Query for all realms–used to display realms on home screen.
 */
export async function getAllRealms(
  context: ConnectionContext
): Promise<ProgramAccount<Realm>[]> {
  const uniqueProgramIDs: string[] = getUniqueKeys(
    devnetRealms,
    (realm) => realm.programId
  );

  const allRealms = (
    await Promise.all(
      uniqueProgramIDs.map((id) =>
        getRealms(context.connection, new PublicKey(id))
      )
    )
  )
    .flatMap((realms) => Object.values(realms))
    .sort((r1, r2) => r1.account.name.localeCompare(r2.account.name));

  return allRealms;
}

/**
 * Given a realm, pull all of its blockchain-based balance information
 */
export async function getRealmBalancess(realm: Realm) {}

/**
 * Given a realm, return all transactions (blockchain-based) and relevant
 * proposals.
 */
export async function getRealmTransactions(
  realm: Realm
): Promise<Transaction[]> {
  return [];
}

/**
 * Submits a given proposal to the blockchain.
 */
export async function submitProposal(
  context: ConnectionContext,
  proposal: Proposal
) {}
