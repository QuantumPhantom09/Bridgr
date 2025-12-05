const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;
const IS_PRODUCTION = false; // Set true to disable reset endpoints

// --- INITIAL STATE & SEED DATA ---
const INITIAL_POOLS = {
  fiat_pool: 500000, // INR
  crypto_pool: 10,   // BTC
  stablecoin_pool: 100000 // USD
};

const EXCHANGE_RATES = {
  BTC_TO_INR: 5000000,
  USD_TO_INR: 83,
  BTC_TO_USD: 60000
};

// Users
const INITIAL_USERS = [
  { id: 'alice', name: 'Alice (Sender)', trust_score: 85, currency: 'BTC' },
  { id: 'bob', name: 'Bob (Merchant)', trust_score: 95, currency: 'INR' },
  { id: 'charlie', name: 'Charlie (Fraudster)', trust_score: 40, currency: 'USD' },
  { id: 'dave', name: 'Dave', trust_score: 70, currency: 'INR' },
  { id: 'eve', name: 'Eve', trust_score: 90, currency: 'BTC' }
];

// Runtime State
let pools = { ...INITIAL_POOLS };
let users = JSON.parse(JSON.stringify(INITIAL_USERS));
let transactions = [];
let fraudAlerts = [];

// --- HELPER FUNCTIONS ---

// Deliverable F: Pool Balancing & Prediction
const predictPoolDemand = () => {
  // Simple moving average of last 10 tx
  const last10 = transactions.slice(-10);
  let demandTrend = 0;
  if (last10.length > 0) {
    demandTrend = last10.reduce((acc, tx) => acc + (tx.pool_changes.fiat_pool || 0), 0) / last10.length;
  }
  
  // Forecast next 10 steps
  const forecast = [];
  let currentLevel = pools.fiat_pool;
  for(let i=0; i<10; i++) {
    currentLevel += demandTrend;
    forecast.push(currentLevel);
  }
  return forecast;
};

// Deliverable G: Fraud Rules
const checkFraud = (tx) => {
  const flags = [];
  let trustDelta = 1; // Default reward

  // Rule 1: Single transaction > 5% of fiat pool
  const fiatValue = tx.receiver_currency === 'INR' ? tx.receiver_amount : tx.receiver_amount * EXCHANGE_RATES.USD_TO_INR; // Simplified
  if (fiatValue > (pools.fiat_pool * 0.05)) {
    flags.push('HIGH_VALUE_THRESHOLD_EXCEEDED');
    trustDelta = -10;
  }

  // Rule 2: Velocity Check (3 tx in 60 seconds)
  const recentTx = transactions.filter(t => 
    t.from_id === tx.from_id && 
    (tx.timestamp - t.timestamp) < 60000
  );
  if (recentTx.length >= 3) {
    flags.push('VELOCITY_LIMIT_EXCEEDED');
    trustDelta = -20;
  }

  // Rule 3: Geo Mismatch (Mocked via payload param 'geo_risk')
  if (tx.geo_risk === true) {
    flags.push('GEO_LOCATION_MISMATCH');
    trustDelta = -5;
  }

  return { flags, trustDelta };
};

// --- ENDPOINTS ---

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

// Deliverable H: Transaction Engine
app.post('/pay', (req, res) => {
  const { from_id, to_id, amount, currency, geo_risk } = req.body;
  
  const sender = users.find(u => u.id === from_id);
  const receiver = users.find(u => u.id === to_id);

  if (!sender || !receiver) return res.status(404).json({error: 'User not found'});

  // Conversion Logic (Simplified)
  let receiver_amount = 0;
  let exchange_rate = 1;
  let pool_changes = {};

  // Scenario: BTC (Sender) -> INR (Receiver)
  if (currency === 'BTC' && receiver.currency === 'INR') {
    exchange_rate = EXCHANGE_RATES.BTC_TO_INR;
    receiver_amount = amount * exchange_rate;
    
    // Update Pools: Add Crypto, Remove Fiat
    pool_changes = { crypto_pool: amount, fiat_pool: -receiver_amount };
    pools.crypto_pool += amount;
    pools.fiat_pool -= receiver_amount;
  } 
  // Scenario: USD (Sender) -> INR (Receiver)
  else if (currency === 'USD' && receiver.currency === 'INR') {
    exchange_rate = EXCHANGE_RATES.USD_TO_INR;
    receiver_amount = amount * exchange_rate;
    
    pool_changes = { stablecoin_pool: amount, fiat_pool: -receiver_amount };
    pools.stablecoin_pool += amount;
    pools.fiat_pool -= receiver_amount;
  }
  else {
    // Identity for simplicity or other pairs
    receiver_amount = amount; 
  }

  // Construct Transaction Object
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

  // Check Fraud
  const { flags, trustDelta } = checkFraud(tx);
  tx.fraud_flags = flags;
  tx.trust_score_delta = trustDelta;

  // Update State
  transactions.push(tx);
  
  // Update Sender Trust
  const userIdx = users.findIndex(u => u.id === from_id);
  users[userIdx].trust_score = Math.max(0, Math.min(100, users[userIdx].trust_score + trustDelta));

  if (flags.length > 0) {
    fraudAlerts.push({ ...tx, flags });
  }

  res.json({ success: true, transaction: tx, new_trust_score: users[userIdx].trust_score });
});

// Deliverable J: Demo Mode Script Trigger
app.post('/demo-trigger', async (req, res) => {
  const { step } = req.body;
  
  // 1. Reset
  if (step === 'init') {
    pools = { ...INITIAL_POOLS };
    transactions = [];
    fraudAlerts = [];
    return res.json({ msg: 'Demo Initialized' });
  }

  // 2. Velocity Attack
  if (step === 'velocity') {
    const payloads = [1, 2, 3, 4].map(i => ({
      from_id: 'alice', to_id: 'bob', amount: 0.0001, currency: 'BTC'
    }));
    // Execute rapidly
    payloads.forEach(p => {
       // Mocking internal calls for simulation speed
       // In real app, client would call /pay
    });
    return res.json({ msg: 'Velocity attack simulated (manual trigger required in app for visuals)' });
  }

  res.json({ msg: 'Step unknown' });
});

app.listen(PORT, () => {
  console.log(`Bridgr Simulator running on port ${PORT}`);
});
