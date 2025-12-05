# Bridgr - Crypto/Fiat Instant Payments Prototype

## Pre-requisites
1. Node.js installed.
2. Expo CLI installed (`npm install -g expo-cli`).
3. Expo Go app on your phone.
4. Your computer and phone must be on the **same WiFi**.

## Setup Instructions

### 1. Configure IP
Open `src/config/constants.js`.
Find your computer's local IP (e.g., `ipconfig` or `ifconfig`).
Update `API_URL` to: `http://<YOUR_IP>:3000`.

### 2. Install Dependencies
```bash
npm install
