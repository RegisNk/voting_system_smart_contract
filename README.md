
# 🗳️ Smart Voting System DApp

A decentralized voting system built using Solidity smart contracts and a React-based frontend, deployed on the local Ethereum blockchain using MetaMask and Hardhat.

---

## 🚀 Features

- Add, update, and delete:
  - 🪪 Voters
  - 👤 Candidates
  - 📌 Positions
- 🗳️ Vote by candidate name
- 📊 Live voting results
- 🔐 Admin-only access to management features
- 🔄 Real-time event updates
- ✅ MetaMask integration

---

## 🛠️ Tech Stack

- **Smart Contract**: Solidity
- **Frontend**: React.js
- **Wallet**: MetaMask
- **Local Blockchain**: Hardhat or Ganache
- **Event Handling**: Web3.js or Ethers.js

---

## 📂 Project Structure

```
/src
│
├── App.js              # Main UI for both admin and voter
├── index.js            # React entry point
├── styles.css          # Application styling
├── VotingSystem.json   # Compiled contract ABI
```

---

## 🧾 Prerequisites

- [Node.js](https://nodejs.org/) & NPM
- [MetaMask](https://metamask.io/)
- [Hardhat](https://hardhat.org/) or Ganache
- A local Ethereum network (like Hardhat Network)

---

## ⚙️ Setup Instructions

1. **Clone the repo**

```bash
git clone https://github.com/yourusername/voting-dapp.git
cd voting-dapp
```

2. **Install dependencies**

```bash
npm install
```

3. **Compile Smart Contract**

```bash
npx hardhat compile
```

4. **Deploy the Contract**

```bash
npx hardhat run scripts/deploy.js --network localhost
```

> Make sure your local blockchain is running.

5. **Connect MetaMask to Localhost**

- Network: Custom RPC
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337` (Hardhat)

6. **Start the React App**

```bash
npm start
```

---

## 🔐 Admin Access

- Username: `Regis`
- Password: `123`

---

## 📸 Screenshots

> Add screenshots of Admin Panel, Voting Form, and Results Table here

---

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

## 👨‍💻 Author

**Regis Nkundimana**  
_Rwanda, 2025_  
[LinkedIn](https://www.linkedin.com/) | [GitHub](https://github.com/)

---
