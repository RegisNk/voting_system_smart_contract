# Smart Voting DApp

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A decentralized voting application built on the Ethereum blockchain using smart contracts. This system ensures secure, transparent, and tamper-proof elections with real-time result updates.

## 🔗 Repository

📍 [https://github.com/RegisNk/voting_system_smart_contract](https://github.com/RegisNk/voting_system_smart_contract)

## 🚀 Features

- ✅ Admin login with credentials
- 🗳️ Candidate and position registration
- 🙋 Voter registration and management
- 📥 Voting functionality per position
- 📊 Real-time live results display
- 🔒 One vote per account enforcement
- 🧾 MetaMask integration

## 🛠️ Technologies Used

- **Frontend**: React.js, Bootstrap 5
- **Smart Contracts**: Solidity
- **Blockchain**: Ethereum (via Ganache or testnet)
- **Libraries**: `ethers.js`, MetaMask

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/RegisNk/voting_system_smart_contract.git
   cd voting_system_smart_contract
Install dependencies:

bash
Copy
Edit
npm install
Start Ganache (or your preferred local blockchain)

Compile and deploy contracts using Truffle or Hardhat (adjust depending on your stack):

bash
Copy
Edit
truffle compile
truffle migrate
Start the development server:

bash
Copy
Edit
npm start
Connect MetaMask to your local blockchain network:

Import account from Ganache.

Set network to custom RPC: http://127.0.0.1:7545.

👨‍💻 Admin Credentials
Default login:

Username: Regis

Password: 123

Credentials are hardcoded for demonstration purposes. For production, implement secure authentication.

📋 Smart Contract Functions
createPosition(string name)

addCandidate(string name, uint positionId)

registerVoter(string name, address voterAddress)

voteByName(string candidateName)

getAllPositions()

getAllCandidatesWithPositionNames()

getAllVoters()

📸 Screenshots
Add screenshots here of:

Admin dashboard

Voting interface

Live results

🔐 Security Considerations
Prevents double voting via smart contract

Admin-only access to critical functions

Data stored on-chain to prevent tampering

📈 Future Improvements
Deploy to Ethereum testnet/mainnet

Add end-time or schedule to elections

SMS/email notifications for voters

Mobile UI optimization

Role-based access control

📄 License
This project is licensed under the MIT License.

🔗 Built with ❤️ by Regis Nk

yaml
Copy
Edit

---

