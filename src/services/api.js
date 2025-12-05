import { API_URL } from '../config/constants';

export const api = {
  getPools: async () => {
    const res = await fetch(`${API_URL}/pools`);
    return res.json();
  },
  pay: async (payload) => {
    const res = await fetch(`${API_URL}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  getTransactions: async () => {
    const res = await fetch(`${API_URL}/transactions`);
    return res.json();
  },
  reset: async () => {
    return fetch(`${API_URL}/reset`);
  }
};
