require('dotenv').config();

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export type StripeAccount = {
  id: string
};

export type FinancialAccount = {
  id: string
}

export type Cardholder = {
  name: string,
  email: string,
  phoneNumber: string
}

export type Address = {
  line1?: string,
  city?: string,
  state?: string,
  postal_code?: string,
  country?: string,
}

export type Card = {
  id: string
}

// TODO(ajay): return and redirect user to a Stripe onboarding form provided by: https://stripe.com/docs/treasury/account-management/connected-accounts#using-hosted-onboarding
export const createUser = async (): Promise<StripeAccount> => {
  const connectedAccount = await stripe.accounts.create({
    country: 'US',
    type: 'custom',
    business_type: 'company',
    capabilities: {
      treasury: {requested: true},
      card_issuing: {requested: true},
      card_payments: {requested: true},
      transfers: {requested: true},
      us_bank_account_ach_payments: {requested: true},
    },
  });
  await verifyUser(connectedAccount.id);

  return {
    id: connectedAccount.id
  };
};

/* placeholder: this should be updated with proper onboarding */
export const verifyUser = async (accountId: string): Promise<void> => {
  // https://stripe.com/docs/treasury/account-management/connected-accounts
  await stripe.accounts.update(
    accountId,
    {
      tos_acceptance: {date: 1547923073, ip: '172.18.80.19'},
      business_profile: {mcc: '5045', url: 'https://bestcookieco.com'},
      company: {
        address: {
          city: 'Schenectady',
          line1: '123 State St',
          postal_code: '12345',
          state: 'NY',
        },
        tax_id: '000000000',
        name: 'The Best Cookie Co',
        phone: '8888675309',
      },
      individual: {first_name: 'Jenny', last_name: 'Rosen'},
    }
  );
}

export const createFinancialAccount = async (accountId: string): Promise<FinancialAccount> => {
  const financialAccount = await stripe.treasury.financialAccounts.create(
    {
      supported_currencies: ['usd'],
      features: {
        card_issuing: {requested: true},
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
  await testFundFinancialAccount(accountId, financialAccount.id);
  return {
    id: financialAccount.id
  };
};

export const testFundFinancialAccount = async (accountId: string, financialAccountId: string) => {
  await stripe.testHelpers.treasury.receivedCredits.create(
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
  daoBillingAddress: Address
) => {
  const stripeCardholder = await stripe.issuing.cardholders.create(
    {
      cardholder: {
        ...cardholder,
        phone_number: cardholder.phoneNumber,
      },
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







