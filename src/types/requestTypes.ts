export interface CreateProposalRequest {
  type: ProposalType;
  name: string;
  description: string;
}

export interface BankAccountRequest extends CreateProposalRequest {}
export interface CardRequest extends CreateProposalRequest {}
export interface ACHWireRequest extends CreateProposalRequest {}
export interface FundingRequest extends CreateProposalRequest {}

export type ProposalType = "BankAccount" | "Card" | "ACHWire" | "Funding";
