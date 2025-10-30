# TreasuryDAO

<div align="center">

**Privacy-Preserving DAO Treasury Management with Fully Homomorphic Encryption**

[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)](https://soliditylang.org/)
[![Zama fhEVM](https://img.shields.io/badge/Zama-fhEVM-purple)](https://docs.zama.ai/fhevm)
[![Network](https://img.shields.io/badge/Network-Sepolia-orange)](https://sepolia.etherscan.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

[Live Demo](#) | [Documentation](#table-of-contents) | [Contract Address](https://sepolia.etherscan.io/address/0x73FbaE0f1e2000F607E52Fd3087AeD88341847fB)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution Architecture](#solution-architecture)
- [How It Works](#how-it-works)
- [FHE Implementation](#fhe-implementation)
- [Smart Contract Architecture](#smart-contract-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Technical Stack](#technical-stack)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Usage Guide](#usage-guide)
- [Security Considerations](#security-considerations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**TreasuryDAO** is a privacy-preserving DAO treasury management system built on Ethereum using **Zama's Fully Homomorphic Encryption (FHE)** technology. It enables decentralized organizations to conduct governance with complete voting privacy while maintaining transparency in financial operations.

### Key Features

- 🔐 **Encrypted Voting**: Votes are encrypted on-chain using FHE, ensuring complete privacy
- 💰 **Transparent Deposits**: Plaintext ETH deposits for clear financial tracking
- 📝 **Public Proposals**: Proposal details remain transparent for informed decision-making
- 🔒 **Privacy by Default**: Nobody can see how members vote until proposal finalization
- ⚡ **On-Chain Computation**: Vote tallying happens directly on encrypted data without decryption
- 🎯 **Deposit-Based Voting**: Minimum deposit requirement (0.001 ETH) ensures stakeholder participation

### Live Contract

**Deployed on Sepolia Testnet**: [`0x73FbaE0f1e2000F607E52Fd3087AeD88341847fB`](https://sepolia.etherscan.io/address/0x73FbaE0f1e2000F607E52Fd3087AeD88341847fB)

---

## 🚨 Problem Statement

### Traditional DAO Governance Issues

1. **Vote Privacy**: Traditional on-chain voting exposes all votes publicly, leading to:
   - Vote manipulation through bribery
   - Whale influence and vote buying
   - Herd mentality and vote following
   - Strategic voting instead of honest preference

2. **Privacy vs Transparency Dilemma**: DAOs face a fundamental trade-off:
   - **Full transparency** → Vote manipulation and pressure
   - **Off-chain voting** → Trust assumptions and centralization risks

3. **Existing Solutions Are Inadequate**:
   - **Commit-Reveal Schemes**: Vulnerable to DoS attacks, requires 2 transactions
   - **Zero-Knowledge Proofs**: Complex circuits, high gas costs, limited functionality
   - **Off-Chain Aggregation**: Centralized trust assumptions

### Real-World Impact

- **Compound Governance**: Large holders can see votes in real-time and adjust their strategy
- **Uniswap Proposals**: Vote outcomes often predictable before voting ends
- **Voting Cartels**: Coordinated vote buying affects multiple DAOs

---

## 💡 Solution Architecture

### Our Approach: Hybrid Transparency

TreasuryDAO implements a **hybrid transparency model** using Zama's FHE technology:

| Component | Visibility | Reason |
|-----------|-----------|---------|
| **Deposits** | ✅ Plaintext | Financial transparency and trust |
| **Proposals** | ✅ Plaintext | Informed decision-making |
| **Votes** | 🔐 **Encrypted** | Prevent manipulation and ensure honest voting |
| **Vote Tallies** | 🔐 **Encrypted** | Results computed on encrypted data |

### Why This Works

1. **Financial Transparency**: Members can verify DAO treasury and individual contributions
2. **Informed Voting**: Proposal details (amount, recipient, description) are public
3. **Privacy Protection**: Individual votes remain encrypted until finalization
4. **On-Chain Computation**: FHE enables vote counting without decryption

---

## 🔄 How It Works

### User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Flow                                │
└─────────────────────────────────────────────────────────────────┘

1. DEPOSIT STAGE
   User → [Deposit ETH] → Contract (plaintext storage)
   ↓
   Gain voting rights (require ≥ 0.001 ETH)

2. PROPOSAL STAGE
   Member → [Create Proposal] → Contract
   ↓
   Proposal stored with:
   - Title, Description (plaintext)
   - Amount, Recipient (plaintext)
   - Deadline (timestamp)
   - Vote counters (encrypted euint64)

3. VOTING STAGE
   User → [Select YES/NO] → Frontend FHE Encryption
   ↓
   Encrypted vote (0 or 1) → Smart Contract
   ↓
   Contract performs homomorphic addition:
   - encryptedYesVotes += FHE.select(vote == 1, 1, 0)
   - encryptedNoVotes += FHE.select(vote == 0, 1, 0)

4. FINALIZATION (Future)
   After deadline → Anyone can trigger finalization
   ↓
   Contract requests decryption from KMS
   ↓
   Results become public
```

### Vote Encryption Flow

```typescript
// Frontend: User selects YES
const voteValue = 1; // YES = 1, NO = 0

// Step 1: Initialize FHE SDK (loaded from CDN)
const fhe = await initializeFHE();

// Step 2: Create encrypted input
const input = fhe.createEncryptedInput(contractAddress, userAddress);
input.add64(BigInt(voteValue));

// Step 3: Encrypt and generate proof
const { handles, inputProof } = await input.encrypt();

// Step 4: Submit to contract
contract.vote(proposalId, encryptedVote, inputProof);
```

### Contract Processing

```solidity
// Receive encrypted vote
function vote(
    uint256 proposalId,
    externalEuint64 encryptedVote,
    bytes calldata inputProof
) external {
    // Convert external encrypted input to internal type
    euint64 voteValue = FHE.fromExternal(encryptedVote, inputProof);

    // Homomorphic comparison: is vote == 1?
    euint64 isYes = FHE.eq(voteValue, FHE.asEuint64(1));
    euint64 yesIncrement = FHE.select(isYes, FHE.asEuint64(1), FHE.asEuint64(0));

    // Homomorphic addition (works on encrypted data!)
    proposal.encryptedYesVotes = FHE.add(proposal.encryptedYesVotes, yesIncrement);

    // Same for NO votes
    euint64 isNo = FHE.eq(voteValue, FHE.asEuint64(0));
    euint64 noIncrement = FHE.select(isNo, FHE.asEuint64(1), FHE.asEuint64(0));
    proposal.encryptedNoVotes = FHE.add(proposal.encryptedNoVotes, noIncrement);
}
```

---

## 🔐 FHE Implementation

### What is Fully Homomorphic Encryption?

FHE allows computations on encrypted data without decryption:

```
Plaintext:  5 + 3 = 8
Encrypted:  Enc(5) + Enc(3) = Enc(8)
```

### Zama fhEVM Integration

TreasuryDAO uses **Zama fhEVM v0.8.0** which provides:

1. **Native FHE Types**: `euint8`, `euint16`, `euint32`, `euint64`
2. **FHE Operations**: Addition, comparison, conditional selection
3. **Access Control**: Fine-grained permissions for encrypted data
4. **Decryption Oracle**: Secure result revelation when needed

### FHE Operations Used

| Operation | Purpose | Example |
|-----------|---------|---------|
| `FHE.asEuint64(n)` | Convert plaintext to encrypted | `FHE.asEuint64(0)` |
| `FHE.fromExternal()` | Import user-encrypted data | Vote input from frontend |
| `FHE.eq(a, b)` | Encrypted equality check | `vote == 1?` |
| `FHE.select(cond, a, b)` | Encrypted conditional | If-then-else on encrypted data |
| `FHE.add(a, b)` | Encrypted addition | Increment vote counters |
| `FHE.allowThis()` | Grant contract access | Read encrypted values |

### Vote Encryption Details

Each vote is a single encrypted `euint64` containing either `0` (NO) or `1` (YES):

```solidity
struct Proposal {
    // ... other fields ...
    euint64 encryptedYesVotes;  // Cumulative YES count (encrypted)
    euint64 encryptedNoVotes;   // Cumulative NO count (encrypted)
}
```

### Why This Approach?

1. **Gas Efficiency**: Single encrypted value per vote
2. **Simple Logic**: Binary choice (YES/NO)
3. **Secure Tallying**: Homomorphic addition prevents intermediate leakage
4. **Flexible Decryption**: Can reveal results when needed

---

## 🏗️ Smart Contract Architecture

### Contract Structure

```
SimpleTreasuryDAO.sol (Main Contract)
├── Inherits: SepoliaConfig (Zama FHE configuration)
├── State Variables
│   ├── deposits: mapping(address => uint256)        // Plaintext balances
│   ├── proposals: Proposal[]                        // Proposal array
│   ├── hasVoted: mapping(uint256 => mapping(address => bool))
│   └── minDepositToVote: uint256                    // 0.001 ETH
└── Functions
    ├── deposit() - Deposit ETH (plaintext)
    ├── withdraw() - Withdraw ETH
    ├── createProposal() - Create new proposal (plaintext)
    ├── vote() - Submit encrypted vote
    ├── getProposal() - Query proposal details
    └── getProposalCount() - Get total proposals
```

### Proposal Data Structure

```solidity
struct Proposal {
    uint256 id;                     // Unique identifier
    string title;                   // Plaintext title
    string description;             // Plaintext description
    address proposer;               // Creator address
    uint256 amount;                 // Plaintext ETH amount
    address recipient;              // Plaintext recipient
    uint256 deadline;               // Unix timestamp
    euint64 encryptedYesVotes;      // 🔐 Encrypted YES count
    euint64 encryptedNoVotes;       // 🔐 Encrypted NO count
    bool finalized;                 // Execution status
}
```

### Key Functions

#### 1. Deposit Function

```solidity
function deposit() external payable {
    if (msg.value == 0) revert InvalidAmount();
    deposits[msg.sender] += msg.value;
    emit Deposited(msg.sender, msg.value);
}
```

**Purpose**: Allow users to deposit ETH and gain voting rights.

#### 2. Create Proposal Function

```solidity
function createProposal(
    string calldata title,
    string calldata description,
    uint256 amount,
    address recipient,
    uint256 votingPeriodDays
) external returns (uint256) {
    require(deposits[msg.sender] >= minDepositToVote);

    // Initialize encrypted vote counters to 0
    euint64 encryptedYes = FHE.asEuint64(0);
    euint64 encryptedNo = FHE.asEuint64(0);

    // Store proposal
    proposals.push(Proposal({
        id: proposals.length,
        title: title,
        description: description,
        proposer: msg.sender,
        amount: amount,
        recipient: recipient,
        deadline: block.timestamp + (votingPeriodDays * 1 days),
        encryptedYesVotes: encryptedYes,
        encryptedNoVotes: encryptedNo,
        finalized: false
    }));

    return proposals.length - 1;
}
```

**Purpose**: Create a new governance proposal with encrypted vote counters.

#### 3. Vote Function (Core FHE Logic)

```solidity
function vote(
    uint256 proposalId,
    externalEuint64 encryptedVote,
    bytes calldata inputProof
) external {
    // Validation
    require(proposalId < proposals.length);
    require(deposits[msg.sender] >= minDepositToVote);
    require(!hasVoted[proposalId][msg.sender]);
    require(block.timestamp <= proposals[proposalId].deadline);

    // Convert external encrypted input to internal euint64
    euint64 voteValue = FHE.fromExternal(encryptedVote, inputProof);

    // Homomorphic vote counting
    // If vote == 1, increment YES counter
    euint64 yesIncrement = FHE.select(
        FHE.eq(voteValue, FHE.asEuint64(1)),
        FHE.asEuint64(1),
        FHE.asEuint64(0)
    );
    proposal.encryptedYesVotes = FHE.add(proposal.encryptedYesVotes, yesIncrement);

    // If vote == 0, increment NO counter
    euint64 noIncrement = FHE.select(
        FHE.eq(voteValue, FHE.asEuint64(0)),
        FHE.asEuint64(1),
        FHE.asEuint64(0)
    );
    proposal.encryptedNoVotes = FHE.add(proposal.encryptedNoVotes, noIncrement);

    // Mark as voted
    hasVoted[proposalId][msg.sender] = true;

    emit VoteCast(proposalId, msg.sender);
}
```

**FHE Operations Breakdown**:

1. **Input Validation**: `FHE.fromExternal()` - Verify proof and import encrypted vote
2. **Equality Check**: `FHE.eq(voteValue, 1)` - Check if vote is YES (encrypted comparison)
3. **Conditional Selection**: `FHE.select(condition, ifTrue, ifFalse)` - Choose increment value
4. **Accumulation**: `FHE.add(counter, increment)` - Add to running total

### Gas Costs

| Operation | Estimated Gas | Notes |
|-----------|---------------|-------|
| `deposit()` | ~50,000 | Standard transfer |
| `createProposal()` | ~200,000 | FHE initialization overhead |
| `vote()` | ~400,000 | FHE operations are expensive |

---

## 🎨 Frontend Architecture

### Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Wagmi v2** - Ethereum hooks
- **RainbowKit** - Wallet connection
- **Ethers.js v6** - Contract interaction
- **Shadcn/ui** - Component library
- **Tailwind CSS** - Styling

### FHE SDK Integration

The frontend loads Zama's FHE SDK dynamically from CDN:

```typescript
// src/lib/fhe.ts
const SDK_URL = 'https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.umd.cjs';

const loadSdk = async (): Promise<any> => {
  if (window.relayerSDK) return window.relayerSDK;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => resolve(window.relayerSDK);
    document.body.appendChild(script);
  });
};
```

### Vote Encryption Implementation

```typescript
export const encryptVote = async (
  contractAddress: string,
  userAddress: string,
  voteValue: 0 | 1
): Promise<{
  encryptedVote: `0x${string}`;
  proof: `0x${string}`;
}> => {
  // Initialize FHE SDK
  const fhe = await initializeFHE();

  // Create encrypted input for specific contract and user
  const input = fhe.createEncryptedInput(contractAddress, userAddress);
  input.add64(BigInt(voteValue));

  // Encrypt and generate proof
  const { handles, inputProof } = await input.encrypt();

  // Convert to hex format for contract
  const handleHex = '0x' + Array.from(handles[0])
    .map((b: number) => b.toString(16).padStart(2, '0'))
    .join('');

  return {
    encryptedVote: handleHex as `0x${string}`,
    proof: hexlify(inputProof) as `0x${string}`,
  };
};
```

### Component Structure

```
src/
├── components/
│   ├── Header.tsx              - Navigation & wallet
│   ├── Hero.tsx                - Landing page hero
│   ├── ProposalsList.tsx       - 📊 Main proposal display
│   ├── VoteDialog.tsx          - 🔐 Encrypted voting UI
│   ├── CreateProposalDialog.tsx - 📝 Proposal creation
│   ├── DepositDialog.tsx       - 💰 ETH deposit
│   └── ui/                     - Shadcn components
├── config/
│   ├── wagmi.ts               - Wagmi configuration
│   └── contracts.ts           - Contract ABI & address
├── lib/
│   └── fhe.ts                 - 🔐 FHE encryption utilities
└── pages/
    └── Index.tsx              - Main page
```

### Real-Time Data Loading

```typescript
// ProposalsList.tsx
const loadProposals = async () => {
  const provider = new BrowserProvider(walletClient);
  const contract = new Contract(TREASURY_DAO_ADDRESS, TREASURY_DAO_ABI, provider);

  const count = await contract.getProposalCount();
  const proposalsList: Proposal[] = [];

  for (let i = 0; i < Number(count); i++) {
    const proposal = await contract.getProposal(i);
    proposalsList.push({
      id: Number(proposal[0]),
      title: proposal[1],
      description: proposal[2],
      proposer: proposal[3],
      amount: formatEther(proposal[4]),
      recipient: proposal[5],
      deadline: Number(proposal[6]),
      finalized: proposal[7],
    });
  }

  setProposals(proposalsList);
};
```

---

## 🛠️ Technical Stack

### Smart Contract Layer

| Technology | Version | Purpose |
|------------|---------|---------|
| Solidity | 0.8.24 | Smart contract language |
| Zama fhEVM | 0.8.0 | FHE operations |
| Hardhat | 2.22.18 | Development framework |
| OpenZeppelin | Latest | Security patterns |

### Frontend Layer

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool |
| Wagmi | 2.x | Ethereum hooks |
| RainbowKit | Latest | Wallet integration |
| Ethers.js | 6.x | Contract interaction |
| Tailwind CSS | 3.x | Styling |
| Shadcn/ui | Latest | Component library |

### Infrastructure

| Service | Purpose |
|---------|---------|
| Sepolia Testnet | Deployment network |
| Zama Relayer | FHE key management |
| IPFS (planned) | Proposal metadata storage |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- MetaMask or compatible Web3 wallet
- Sepolia ETH ([Faucet](https://sepoliafaucet.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/vddi3yx60/TreasuryDAO.git
cd TreasuryDAO

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Configuration

Create `.env` file:

```env
# Deployment
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com

# Frontend (optional)
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Smart Contract Development

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Sepolia
PRIVATE_KEY=xxx SEPOLIA_RPC_URL=xxx npx hardhat run scripts/deploy.cjs --network sepolia

# Create test proposals
npx hardhat run scripts/create-proposals.cjs --network sepolia
```

### Frontend Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Access Application

Open http://localhost:8080 in your browser

---

## 📦 Deployment

### Contract Deployment

```bash
# Deploy SimpleTreasuryDAO
PRIVATE_KEY=xxx SEPOLIA_RPC_URL=xxx npx hardhat run scripts/deploy.cjs --network sepolia
```

**Current Deployment**: `0x73FbaE0f1e2000F607E52Fd3087AeD88341847fB`

### Frontend Deployment

The frontend can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **IPFS**: `ipfs add -r dist/`

---

## 📚 Usage Guide

### For Users

#### 1. Connect Wallet
- Click "Connect Wallet" button
- Select MetaMask or compatible wallet
- Switch to Sepolia testnet

#### 2. Deposit ETH
- Click "Deposit" button
- Enter amount (minimum 0.001 ETH)
- Confirm transaction
- Wait for confirmation

#### 3. Create Proposal
- Click "Create Proposal"
- Fill in details:
  - Title
  - Description
  - Amount (ETH)
  - Recipient address
  - Voting period (days)
- Submit transaction

#### 4. Vote on Proposal
- Browse proposals
- Click "Vote" on desired proposal
- Select YES or NO
- Frontend encrypts your vote using FHE
- Confirm transaction
- Your vote is stored encrypted on-chain

### For Developers

#### Contract Interaction

```javascript
// Get proposal details
const proposal = await contract.getProposal(proposalId);

// Deposit ETH
await contract.deposit({ value: ethers.parseEther("0.01") });

// Create proposal
await contract.createProposal(
  "Title",
  "Description",
  ethers.parseEther("1"),
  recipientAddress,
  7 // days
);

// Vote (requires FHE encryption first)
const { encryptedVote, proof } = await encryptVote(contractAddress, userAddress, 1);
await contract.vote(proposalId, encryptedVote, proof);
```

#### FHE Encryption

```typescript
import { encryptVote } from './lib/fhe';

// Encrypt a YES vote
const { encryptedVote, proof } = await encryptVote(
  contractAddress,
  userAddress,
  1 // 1 = YES, 0 = NO
);

// Submit to contract
await contract.vote(proposalId, encryptedVote, proof);
```

---

## 🔒 Security Considerations

### Smart Contract Security

1. **Access Control**: Only depositors can create proposals and vote
2. **Double Voting Prevention**: `hasVoted` mapping prevents duplicate votes
3. **Deadline Enforcement**: Votes rejected after deadline
4. **Deposit Requirements**: Minimum stake required for participation
5. **FHE Privacy**: Votes remain encrypted until decryption requested

### Known Limitations

1. **Gas Costs**: FHE operations are expensive (~400k gas per vote)
2. **Finalization**: Currently requires manual trigger (future: automatic)
3. **Decryption**: Results decryption not yet implemented
4. **Front-Running**: Proposal creation can be front-run (minor impact)

### Audit Status

⚠️ **Not Audited** - This is an experimental project. Do not use in production without proper security audit.

### Best Practices

- Always test on testnet first
- Verify contract addresses
- Use hardware wallets for significant funds
- Monitor gas prices before transactions
- Keep private keys secure

---

## 🗺️ Roadmap

### Phase 1: Core Functionality ✅ (Current)
- [x] Smart contract with FHE voting
- [x] Frontend with wallet integration
- [x] Deposit and proposal creation
- [x] Encrypted vote submission
- [x] Sepolia deployment

### Phase 2: Enhanced Features 🚧 (In Progress)
- [ ] Automatic proposal finalization
- [ ] Vote result decryption UI
- [ ] Multi-signature proposal execution
- [ ] Proposal metadata on IPFS
- [ ] Gas optimization

### Phase 3: Advanced Governance 📋 (Planned)
- [ ] Quadratic voting with FHE
- [ ] Delegation system
- [ ] Proposal discussion forum
- [ ] Treasury analytics dashboard
- [ ] Mobile app

### Phase 4: Mainnet & Scaling 🔮 (Future)
- [ ] Mainnet deployment
- [ ] Layer 2 integration
- [ ] Cross-chain governance
- [ ] DAO tooling integration
- [ ] Security audit

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Process

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards

- Follow Solidity style guide
- Write comprehensive tests
- Document complex logic
- Use TypeScript for frontend
- Follow existing code patterns

### Testing

```bash
# Run contract tests
npx hardhat test

# Run frontend tests
npm run test

# Check coverage
npx hardhat coverage
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Zama** - For developing fhEVM and FHE technology
- **OpenZeppelin** - For secure contract libraries
- **Ethereum Foundation** - For the underlying blockchain
- **Community** - For feedback and contributions

---

## 📞 Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/vddi3yx60/TreasuryDAO/issues)
- **Discussions**: [Join the conversation](https://github.com/vddi3yx60/TreasuryDAO/discussions)

---

## 📊 Project Stats

- **Contract Address**: `0x73FbaE0f1e2000F607E52Fd3087AeD88341847fB`
- **Network**: Sepolia Testnet
- **Total Proposals**: 4+ (and counting)
- **Average Vote Gas**: ~400,000
- **FHE SDK Version**: 0.2.0

---

<div align="center">

**Built with ❤️ using Zama FHE Technology**

[⭐ Star on GitHub](https://github.com/vddi3yx60/TreasuryDAO) | [🐛 Report Bug](https://github.com/vddi3yx60/TreasuryDAO/issues) | [💡 Request Feature](https://github.com/vddi3yx60/TreasuryDAO/issues)

</div>
