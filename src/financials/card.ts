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
      phone_number: '8000000000',
    },
    {
      line1: '1 Hacker Way',
      city: 'Menlo Park',
      country: 'US',
      postal_code: '94306'
    }
  );
}

/**
 * Creates a bank account.
 */
export const createBankAccount = async (stripeAccountId: string) => {
  return await stripe.createFinancialAccount(stripeAccountId);
}

/**
 * Fund bank account
 */
export async function fundFinancialAccount(stripeAccountId: string, financialAccountId: string) {
  return await stripe.testFundFinancialAccount(stripeAccountId, financialAccountId);
}

export const registerDAOWithStripe = async () => {
  const account = await stripe.createUser();
  const updatedAccount = await stripe.verifyUser(account.id);
  return updatedAccount;
}

export const isAccountVerified = async (stripeAccountId: string) => {
  return await stripe.getUser(stripeAccountId);
}

export const getFinancialAccount = async (financialAccountId: string, stripeAccountId: string) => {
  return await stripe.getFinancialAccount(financialAccountId, stripeAccountId);
}