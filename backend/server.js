const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;
const IS_PRODUCTION = false; 

// --- INITIAL STATE ---
const INITIAL_POOLS = {
  fiat_pool: 500000, 
  crypto_pool: 10,   
  stablecoin_pool: 100000 
};

const EXCHANGE_RATES = {
  BTC_TO_INR: 5000000,
  USD_TO_INR: 83,
  BTC_TO_USD: 60000
};

const INITIAL_USERS = [
  { id: 'alice', name: 'Alice (Sender)', trust_score: 85, currency: 'BTC' },
  { id: 'bob', name: 'Bob (Merchant)', trust_score: 95, currency: 'INR' },
  { id: 'charlie', name: 'Charlie (Fraudster)', trust_score: 40, currency: 'USD' },
];

let pools = { ...INITIAL_POOLS };
let users = JSON.parse(JSON.stringify(INITIAL_USERS));
let transactions = [];
let fraudAlerts = [];

// --- HELPER FUNCTIONS ---
const predictPoolDemand = () => {
  const last10 = transactions.slice(-10);
  let demandTrend = 0;
  if (last10.length > 0) {
    demandTrend = last10.reduce((acc, tx) => acc + (tx.pool_changes.fiat_pool || 0), 0) / last10.length;
  }
  const forecast = [];
  let currentLevel = pools.fiat_pool;
  for(let i=0; i<10; i++) {
    currentLevel += demandTrend;
    forecast.push(currentLevel);
  }
  return forecast;
};

const checkFraud = (tx) => {
  const flags = [];
  let trustDelta = 1; 

  // Rule 1: > 5% of pool
  const fiatValue = tx.receiver_currency === 'INR' ? tx.receiver_amount : tx.receiver_amount * EXCHANGE_RATES.USD_TO_INR; 
  if (fiatValue > (pools.fiat_pool * 0.05)) {
    flags.push('HIGH_VALUE_THRESHOLD_EXCEEDED');
    trustDelta = -10;
  }

  // Rule 2: Velocity (3 tx in 60s)
  const recentTx = transactions.filter(t => 
    t.from_id === tx.from_id && 
    (tx.timestamp - t.timestamp) < 60000
  );
  if (recentTx.length >= 3) {
    flags.push('VELOCITY_LIMIT_EXCEEDED');
    trustDelta = -20;
  }

  return { flags, trustDelta };
};

// --- ENDPOINTS ---

// *** FIX: ROOT ENDPOINT ADDED HERE ***
app.get('/', (req, res) => {
  res.send(`
    <h1>Bridgr Simulator Online 🟢</h1>
    <p>Endpoints available:</p>
    <ul>
      <li><a href="/pools">/pools</a></li>
      <li><a href="/transactions">/transactions</a></li>
      <li><a href="/users">/users</a></li>
    </ul>
  `);
});

app.get('/reset', (req, res) => {
  if (IS_PRODUCTION) return res.status(403).send('Forbidden');
  pools = { ...INITIAL_POOLS };
  users = JSON.parse(JSON.stringify(INITIAL_USERS));
  transactions = [];
  fraudAlerts = [];
  console.log('System Reset');
  res.json({ message: 'Reset successful' });
});

app.get('/pools', (req, res) => {
  res.json({
    current: pools,
    prediction: predictPoolDemand(),
    rates: EXCHANGE_RATES
  });
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/transactions', (req, res) => {
  res.json({ transactions: transactions.reverse(), fraudAlerts });
});

app.post('/pay', (req, res) => {
  const { from_id, to_id, amount, currency, geo_risk } = req.body;
  const sender = users.find(u => u.id === from_id);
  const receiver = users.find(u => u.id === to_id);
  
  if (!sender || !receiver) return res.status(404).json({error: 'User not found'});

  let receiver_amount = 0;
  let exchange_rate = 1;
  let pool_changes = {};

  if (currency === 'BTC' && receiver.currency === 'INR') {
    exchange_rate = EXCHANGE_RATES.BTC_TO_INR;
    receiver_amount = amount * exchange_rate;
    pool_changes = { crypto_pool: amount, fiat_pool: -receiver_amount };
    pools.crypto_pool += amount;
    pools.fiat_pool -= receiver_amount;
  } else if (currency === 'USD' && receiver.currency === 'INR') {
    exchange_rate = EXCHANGE_RATES.USD_TO_INR;
    receiver_amount = amount * exchange_rate;
    pool_changes = { stablecoin_pool: amount, fiat_pool: -receiver_amount };
    pools.stablecoin_pool += amount;
    pools.fiat_pool -= receiver_amount;
  } else {
    receiver_amount = amount; 
  }

  const tx = {
    id: `tx_${Date.now()}`,
    timestamp: Date.now(),
    from_id,
    to_id,
    sender_currency: currency,
    receiver_currency: receiver.currency,
    sender_amount: amount,
    receiver_amount,
    exchange_rate,
    pool_changes,
    geo_risk: !!geo_risk
  };

  const { flags, trustDelta } = checkFraud(tx);
  tx.fraud_flags = flags;
  tx.trust_score_delta = trustDelta;

  transactions.push(tx);
  
  const userIdx = users.findIndex(u => u.id === from_id);
  users[userIdx].trust_score = Math.max(0, Math.min(100, users[userIdx].trust_score + trustDelta));

  if (flags.length > 0) fraudAlerts.push({ ...tx, flags });

  res.json({ success: true, transaction: tx, new_trust_score: users[userIdx].trust_score });
});

app.post('/demo-trigger', (req, res) => {
  const { step } = req.body;
  if (step === 'init') {
    pools = { ...INITIAL_POOLS };
    transactions = [];
    fraudAlerts = [];
    return res.json({ msg: 'Demo Initialized' });
  }
  res.json({ msg: 'Step unknown' });
});

// Use the 0.0.0.0 host to listen on all network interfaces in the container
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Bridgr Simulator running on ${HOST}:${PORT}`);
});