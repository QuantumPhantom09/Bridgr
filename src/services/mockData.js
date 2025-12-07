export const MOCK_TRANSACTIONS = [
  { id: 'tx_1', from_id: 'alice', to_id: 'bob', amount: 0.005, currency: 'BTC', timestamp: Date.now() },
  { id: 'tx_2', from_id: 'bob', to_id: 'alice', amount: 500, currency: 'INR', timestamp: Date.now() - 10000 },
];

export const MOCK_POOLS = {
  fiat_pool: 500000,
  crypto_pool: 10,
  stablecoin_pool: 100000
};