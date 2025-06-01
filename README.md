# 🔐 CypherShare3 – Encrypted File Transfer via World App & Filecoin

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![ETH Global Prague](https://img.shields.io/badge/ETH%20Global-Prague%202025-orange)](https://ethglobal.com/)
[![World App](https://img.shields.io/badge/World%20App-Mini%20App-blue)](https://worldcoin.org/)
[![Filecoin](https://img.shields.io/badge/Filecoin-IPFS-yellow)](https://filecoin.io/)

> **A fully private, decentralized file transfer app, built as a Mini App inside World App, powered by IPFS/Filecoin and World ID.**

---

## 🎯 Motivation

Sharing sensitive files online — contracts, medical records, personal documents — often requires trusting centralized platforms (WeTransfer, Dropbox, Drive).

### ❌ Problems with current services:

| Problem                           | Impact                              |
| --------------------------------- | ----------------------------------- |
| 🕵️ **Can read your files**        | Platforms have access to your data  |
| ❌ **Require accounts or emails** | Need registration and personal info |
| 🗑️ **Automatically delete data**  | Files disappear after a few days    |
| 🧱 **Centralized infrastructure** | Can fail, be censored, or breached  |

### ✅ CypherShare3 offers a better alternative:

**A fully private, decentralized file transfer app, built as a Mini App inside World App, powered by IPFS/Filecoin and World ID.**

---

## 🚀 Solution

### 📋 TL;DR:

1. **🌍 User authenticates** using their World ID via World App
2. **📁 Select file** and enter the Ethereum address of the recipient
3. **🔐 File is encrypted** in the browser (AES)
4. **📤 Uploaded to IPFS** using Lighthouse, ensuring long-term storage via Filecoin
5. **🧾 IPFS CID stored** on-chain via a smart contract
6. **📥 Recipient** logs in with World ID, retrieves the CID, and decrypts the file in-app

**No intermediaries. No central storage. No passwords. Just sovereign file sharing.**

---

## ⭐ Principles

| Principle                       | Description                                       |
| ------------------------------- | ------------------------------------------------- |
| 🔐 **Encryption by default**    | Everything is encrypted before leaving the device |
| 👁️ **Proof of personhood**      | World ID — one unique human = one identity        |
| 🧾 **On-chain traceability**    | Every file transfer is logged immutably           |
| 🛰️ **Permanent storage**        | Via Filecoin — files won't disappear after 7 days |
| 📱 **Accessible via World App** | No browser extensions or wallets required         |

---

## 📱 How It Works

### 👤 **Sender** (in World App)

```
1. 🌍 Authenticates with World ID (Orb-verified)
2. 📁 Uploads a file and enters a recipient Ethereum address
3. 🔄 The app automatically:
   • 🔐 Encrypts the file using AES (Web Crypto API)
   • 📤 Uploads it to IPFS via Lighthouse
   • 🧾 Stores the resulting CID on-chain via sendFile(to, cid)
4. ✅ The CID and transfer appear in the sender's "Sent History"
```

### 📥 **Recipient** (also World ID user)

```
1. 🌍 Logs in with World ID
2. 📋 The app retrieves files sent to their wallet address
3. 📥 The recipient downloads the file from IPFS and decrypts it in-browser
4. ✅ File is decrypted and accessible
```

---

## ✨ Features

- 📤 **Send encrypted files** to any Ethereum address
- 🔐 **Encrypted by default** — no way to skip encryption
- 📜 **History of sent files** with CID, recipient, and timestamp
- 📥 **Inbox for files** received by your address
- 🧭 **Clean navigation** between Send, Receive, and Profile sections
- 📱 **Built as a Mini App** for World App (via Worldcoin Mini App Kit)

---

## 🛠️ Tech Stack

| Component           | Technology                                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auth & Identity** | ![World ID](https://img.shields.io/badge/World%20ID-via%20World%20App-blue)                                                                       |
| **Frontend**        | ![Mini App Kit](https://img.shields.io/badge/Mini%20App%20Kit-React-black) ![Shadcn/UI](https://img.shields.io/badge/Shadcn/UI-Components-purple) |
| **Encryption**      | ![Web Crypto API](https://img.shields.io/badge/Web%20Crypto%20API-AES--GCM-red)                                                                   |
| **File Storage**    | ![IPFS](https://img.shields.io/badge/IPFS-Lighthouse-yellow) ![Filecoin](https://img.shields.io/badge/Filecoin-Long--term-orange)                 |
| **Smart Contracts** | ![Solidity](https://img.shields.io/badge/Solidity-Polygon%20%7C%20Arbitrum-purple)                                                                |

---

## 🎯 What It Solves

### ✅ CypherShare3 allows:

- **🔒 Private, wallet-to-wallet** file delivery without emails or centralized services
- **🔐 Encryption & decentralized storage** by default
- **📱 Integration in World App** for mass adoption
- **🧾 On-chain proof** of file transfers

---

## ⚠️ Limitations

- ❌ **No file expiration** (yet)
- 📢 **No notifications** (recipient must check manually)
- 🔑 **If user loses their decryption key**, the file is unrecoverable

---

## 🏆 Made for ETHGlobal Prague 🇨🇿

> **CypherShare3 is being developed as a submission for ETHGlobal Prague 2025.**

We aim to demonstrate how **privacy**, **decentralization**, and **identity** can be combined to build useful, ethical Web3 apps — accessible to everyone, directly in World App.

---

## 🚀 Getting Started

```bash
# Clone the project
git clone https://github.com/Lasssssa/CypherShare3

# Set up environment variables
cp .env.example .env.local

# Install dependencies
cd front
npm install
npm run dev

cd api
npm run compile
npm install
npm run dev
```

---

## 📄 License

**MIT** — free to use, fork, remix, or improve.

---

<div align="center">

**🌍 [World App](https://worldcoin.org/world-app)** • **📖 [Documentation](./docs)** • **💬 [Support](https://github.com/your-username/CypherShare3/issues)**

**Let's build a more private and sovereign internet.** 🔐

</div>
