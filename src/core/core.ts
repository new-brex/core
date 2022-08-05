import { CreateProposalRequest } from "../types/requestTypes";

/**
 * Creates a proposal.
 */
export async function createProposal(request: CreateProposalRequest) {}

/**
 * Queries for the specified DAOs (or all DAOs if none specified).
 */
export async function getDAOs() {}

/**
 * Returns all transactions for a given DAO:
 * - On chain transactions
 * - Proposals
 * - Bank account/virtual card transactions
 */
export async function getTransactions() {}
