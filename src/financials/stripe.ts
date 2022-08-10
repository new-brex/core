require('dotenv').config();

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {apiVersion: '2022-08-01'});

export type Cardholder = {
  name: string,
  email: string,
  phone_number: string
}

export type Card = {
  id: string
}

// TODO(ajay): return and redirect user to a Stripe onboarding form provided by: https://stripe.com/docs/treasury/account-management/connected-accounts#using-hosted-onboarding
export const createUser = async (): Promise<Stripe.Account> => {
  return await stripe.accounts.create({
    country: 'US',
    type: 'custom',
    business_type: 'individual',
    capabilities: {
      treasury: {requested: true},
      // card_issuing: {requested: true},
      card_payments: {requested: true},
      transfers: {requested: true},
      us_bank_account_ach_payments: {requested: true},
    },
  });
};

export const getUser = async (accountId: string): Promise<Stripe.Account> => {
  return await stripe.accounts.retrieve(accountId);
}

export const generateVerificationLink = async (accountId: string): Promise<string> => {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: 'http://localhost:3000/',
    return_url: 'http://localhost:3000/',
    type: 'account_onboarding',
  });
  return accountLink.url;
}

/* placeholder: this should be updated with proper onboarding */
export const verifyUser = async (accountId: string): Promise<Stripe.Account> => {
  // https://stripe.com/docs/treasury/account-management/connected-accounts
  return await stripe.accounts.update(
    accountId,
    {
      external_account: 'btok_us_verified',
      tos_acceptance: {date: 1547923073, ip: '172.18.80.19'},
      business_profile: {
        mcc: '5045', 
        url: 'https://bestcookieco.com',
        product_description: 'The best cookies around'
      },
      company: {
        address: {
          city: 'Schenectady',
          line1: 'address_full_match',
          postal_code: '12345',
          state: 'NY',
        },
        tax_id: '000000000',
        name: 'The Best Cookie Co',
        phone: '8888675309',
      },
      individual: {
        first_name: 'Jenny', 
        last_name: 'Rosen', 
        phone: '8888675309',
        email: 'jenny@bestcookieco.com',
        dob: {
          day: 10,
          month: 11,
          year: 1980
        },
        id_number: '000000000'
      },
      settings: {
        treasury: {
          tos_acceptance: {date: 1547923073, ip: '172.18.80.19'},
        }
      }
    }
  );
}

export const createFinancialAccount = async (accountId: string): Promise<Stripe.Treasury.FinancialAccount> => {
  const financialAccount = await stripe.treasury.financialAccounts.create(
    {
      supported_currencies: ['usd'],
      features: {
        // card_issuing: {requested: true},
        deposit_insurance: {requested: true},
        financial_addresses: {aba: {requested: true}},
        inbound_transfers: {ach: {requested: true}},
        intra_stripe_flows: {requested: true},
        outbound_payments: {
          ach: {requested: true},
          us_domestic_wire: {requested: true},
        },
        outbound_transfers: {
          ach: {requested: true},
          us_domestic_wire: {requested: true},
        },
      },
    },
    {stripeAccount: accountId}
  );
  return financialAccount;
};

export const getFinancialAccount = async (financialAccountId: string, stripeAccountId: string) => {
  return await stripe.treasury.financialAccounts.retrieve(financialAccountId, {stripeAccount: stripeAccountId});
}

export const testFundFinancialAccount = async (accountId: string, financialAccountId: string) => {
  return await stripe.testHelpers.treasury.receivedCredits.create(
    {
      financial_account: financialAccountId,
      network: 'ach',
      amount: 1234,
      currency: 'usd',
    },
    {stripeAccount: accountId}
  );
}

export const createCard = async (
  accountId: string, 
  financialAccountId: string,
  cardholder: Cardholder, 
  daoBillingAddress: Stripe.Issuing.CardholderCreateParams.Billing.Address
) => {
  const stripeCardholder = await stripe.issuing.cardholders.create(
    {
      ...cardholder,
      status: 'active',
      type: 'individual',
      billing: {
        address: daoBillingAddress
      },
    },
    {stripeAccount: accountId}
  );
  const virtualStripeCard = await stripe.issuing.cards.create(
    {
      cardholder: stripeCardholder.id,
      financial_account: financialAccountId,
      currency: 'usd',
      type: 'virtual',
      status: 'active',
    },
    {stripeAccount: accountId}
  );
  return {
    id: virtualStripeCard.id
  }
}







