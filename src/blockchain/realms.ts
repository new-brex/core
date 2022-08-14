import {
  getAllGovernances,
  getAllProposals,
  getNativeTreasuryAddress,
  getRealms,
  ProgramAccount,
  Realm,
} from "@solana/spl-governance";
import { PublicKey, Transaction as SolanaTransaction } from "@solana/web3.js";
import { Proposal, Transaction } from "../types/objects";
import { getUniqueKeys } from "../utils/helpers";
import { ConnectionContext } from "./connection";
import { devnetRealms } from "./devnet";
import { mainnetRealms } from "./mainnet";

const REALM_PROGRAM_ID = new PublicKey(
  "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw"
);

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
    REALM_PROGRAM_ID,
    realm.pubkey
  );

  const solAddresses = await Promise.all(
    governances.map((gov) =>
      getNativeTreasuryAddress(REALM_PROGRAM_ID, gov.pubkey)
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
  context: ConnectionContext,
  realm: ProgramAccount<Realm>
): Promise<Transaction[]> {
  const allProposals = await getAllProposals(
    context.connection,
    REALM_PROGRAM_ID,
    realm.pubkey
  );

  const proposalTransactions = allProposals.flatMap((govProposals) =>
    govProposals.map((proposal) => {
      return {
        name: proposal.account.name,
        description: proposal.account.descriptionLink,
      };
    })
  );

  return proposalTransactions;
}

/**
 * Submits a given proposal to the blockchain.
 */
export async function submitProposal(
  context: ConnectionContext,
  proposal: Proposal
) {}

export async function getDAOByName(
  context: ConnectionContext,
  name: string
): Promise<ProgramAccount<Realm> | null> {
  const realms = await getAllRealms(context);
  const realm = realms.filter((realm) => realm.account.name === name);
  return realm.length > 0 ? realm[0] : null;
}
