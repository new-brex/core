import * as stripe from './stripe';

/**
 * Creates a card.
 */
export const createCard = async (
  stripeAccountId: string,
  financialAccountId: string
): Promise<stripe.Card> => {
  return await stripe.createCard(
    stripeAccountId, 
    financialAccountId,
    // placeholders
    {
      name: 'Ajay Raj',
      email: 'ajay@newbrex.com',
      phoneNumber: '8000000000',
    },
    {
      line1: '1 Hacker Way',
    }
  );
}

/**
 * Creates a bank account.
 */
export const createBankAccount = async (stripeAccountId: string): Promise<stripe.FinancialAccount> => {
  return await stripe.createFinancialAccount(stripeAccountId);
}

/**
 * Fund bank account
 */
export async function fundFinancialAccount(stripeAccountId: string, financialAccountId: string) {
  return await stripe.testFundFinancialAccount(stripeAccountId, financialAccountId);
}

export const registerDAOWithStripe = async (): Promise<stripe.StripeAccount> => {
  return await stripe.createUser();
}