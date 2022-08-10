import {
  getAllGovernances,
  getNativeTreasuryAddress,
  getRealms,
  ProgramAccount,
  Realm,
} from "@solana/spl-governance";
import { PublicKey } from "@solana/web3.js";
import { Proposal, Transaction } from "../types/objects";
import { getUniqueKeys } from "../utils/helpers";
import { ConnectionContext } from "./connection";
import { devnetRealms } from "./devnet";
import { mainnetRealms } from "./mainnet";

const REALM_PROGRAM_ID = "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw";

/**
 * Query for all realms–used to display realms on home screen.
 */
export async function getAllRealms(
  context: ConnectionContext
): Promise<ProgramAccount<Realm>[]> {
  const realms =
    context.endpointType === "devnet" ? devnetRealms : mainnetRealms;

  const uniqueProgramIDs: string[] = getUniqueKeys(
    //@ts-ignore
    realms,
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
export async function getRealmBalances(
  context: ConnectionContext,
  realm: ProgramAccount<Realm>
) {
  const governances = await getAllGovernances(
    context.connection,
    new PublicKey(REALM_PROGRAM_ID),
    realm.pubkey
  );

  const solAddresses = await Promise.all(
    governances.map((gov) =>
      getNativeTreasuryAddress(new PublicKey(REALM_PROGRAM_ID), gov.pubkey)
    )
  );

  const balances = await Promise.all(
    solAddresses.map(async (address) => [
      address,
      await context.connection.getBalance(new PublicKey(address)),
    ])
  );

  return balances;
}

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
