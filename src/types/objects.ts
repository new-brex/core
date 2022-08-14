/**
 * A new proposal, intended to be published to the blockchain.
 */
export interface Proposal {}

/**
 * Abstraction for:
 * - any blockchain based transaction
 * - proposal submitted to the blockchain
 * - virtual bank account/card transactions
 */
export interface Transaction {}

export interface ProposalTransaction extends Transaction {
  name: string;
  description: string;
}

/**
 * Abstraction for any blockchain-based entity (ex. a Realm)
 */
export interface DAO {
  symbol?: string | undefined;
  displayName?: string | undefined;
  programId?: string | undefined;
  realmId?: string | undefined;
  bannerImage?: string | undefined;
  ogImage?: string | undefined;
  sharedWalletId?: string | undefined;
  sortRank?: number | undefined;
  keywords?: string | undefined;
  twitter?: string | undefined;
  website?: string | undefined;
}

export interface MultiSigDetails {}

export type CardType = "debit" | "credit";
export type ProposalStatus = "pending" | "approved" | "rejected";
