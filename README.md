# WeiFly - Decentralized Virtual Airline ✈️

WeiFly is a decentralized virtual airline (DVA) built on Arbitrum, featuring real-time integration via IVAO. It provides a platform where users connect seamlessly using their email and passkey.

Our authentication system uses Thirdweb v5 smart accounts, allowing users to mint deterministic wallets (CREATE2) governed by passkeys. Gas for transactions is initially sponsored to allow frictionless onboarding. The session creates a random EOA encrypted locally by the user's passkey.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Required
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
NEXT_PUBLIC_THIRDWEB_SECRET_KEY=your_secret_key
NEXT_PUBLIC_THIRDWEB_CHAIN_ID=43114

# Optional
NEXT_PUBLIC_IVAO_CLIENT_ID=your_ivao_client_id
NEXT_PUBLIC_IVAO_CLIENT_SECRET=your_ivao_client_secret
```

### 3. Run Development Server

```bash
pnpm dev
```

### 4. Build and Start Production Server

```bash
pnpm build
pnpm start
```

---

## 🛫 Core Mechanics

### Licenses & Fleet

To pilot aircraft in WeiFly, users must hold proper licenses. Currently, there are 4 license tiers unlocking corresponding aircraft:

- **License 1:** C172
- **License 2:** C700
- **License 3:** B737 (and future equivalent models like A320)
- **License 4:** AN-225

Purchasing a license grants access to manage the unlocked aircraft in the user's hangar.

### Flight Operations

- WeiFly proposes available flights based on the user's licenses, fleet, and fuel.
- Users can choose from available ATC routes on IVAO, let WeiFly assign destinations, or select from predefined random routes.
- WeiFly issues a specific **callsign** for each flight.
- Flights are validated via a custom Electron app connected to the user's real simulator and the IVAO network.
- Completed and validated flights reward the user with an exclusive NFT and tokens.

---

## 🪙 Tokenomics (Dual Token Model)

WeiFly operates a dual-token economy on Arbitrum: **AIRL** (Governance/Value) and **AIRG** (Utility/Fuel).

### 1. AIRL Token

- **Supply:** 100,000,000 (Fixed)
- **Functions:** Governance, value store, staking, and asset purchasing.
- **Emission:** Disbursed purely via the emission schedule from the rewards pool.

### 2. AIRG Token

- **Supply:** Unlimited (Minted on-demand)
- **Functions:** Consumable fuel required for flights.
- **Emission:** Minted strictly via the staking contract (1 AIRL staked = 100 AIRG/day).
- **Sink:** Burned when flights are performed.

### Initial AIRL Distribution

| Destination              | %   | Amount     | Conditions                          |
| :----------------------- | :-- | :--------- | :---------------------------------- |
| **Liquidity Pool**       | 1%  | 1,000,000  | Initial Pool: 1M AIRL + 10,000 USDC |
| **Rewards Pool**         | 40% | 40,000,000 | Gradual release over 5+ years       |
| **Operational Treasury** | 15% | 15,000,000 | Multisig, swaps only for expenses   |
| **Marketing + Referral** | 15% | 15,000,000 | Milestone-based release             |
| **Team + Advisors**      | 15% | 15,000,000 | 6 months cliff + 24 months vesting  |
| **Airdrop / Community**  | 4%  | 4,000,000  | Early users                         |

### Initial Liquidity (Uniswap V3 - Arbitrum)

- **Initial AIRL:** 1,000,000
- **Initial USDC:** 10,000
- **Initial Price:** ~$0.01 USD / AIRL _(Determined by market AMM post-launch)_

### Asset Purchase Yield Flow

When a user buys an aircraft or license with AIRL, the funds are distributed as follows:

- **65%:** Rewards Pool (Sustains flight rewards)
- **15%:** Operational Treasury (Infra, RPCs, audits)
- **10%:** Marketing & Growth
- **5%:** Referral Program
- **5%:** Team Vesting (Locked)

---

## 🏆 Flight Rewards System

Flights are rewarded in AIRL using the following dynamic formula:

`Reward (AIRL) = (Distance_km × BaseRate) × ATC_Bonus × Activity_Modifier × Level_Modifier`

| Parameter             | Value                                                   |
| :-------------------- | :------------------------------------------------------ |
| **BaseRate**          | `0.0025 AIRL/km`                                        |
| **ATC Bonus**         | `+50%` if real IVAO controller is online                |
| **Activity_Modifier** | `0.5x` to `1.5x` (Penalizes AFK/inactivity)             |
| **Level_Modifier**    | `0.5x` (N1) / `0.75x` (N2) / `1.0x` (N3) / `1.25x` (N4) |

### Anti-Farming & Sustainability Limits

- **Daily Limit:** 20 AIRL
- **Weekly Limit:** 100 AIRL
- **Session Yield Curve:**
  - `0-2h:` 1.0x
  - `2-4h:` 0.7x
  - `4-6h:` 0.4x
  - `6h+:` 0.2x

---

## 🛠 Technical Stack

| Layer                 | Technology                                  |
| :-------------------- | :------------------------------------------ |
| **Blockchain**        | Arbitrum (L2 Ethereum)                      |
| **Smart Accounts**    | ERC-4337 (CREATE2 factory pattern)          |
| **Authentication**    | Email + Passkeys (WebAuthn) via Thirdweb v5 |
| **RPC**               | Alchemy SDK                                 |
| **Frontend**          | Next.js 13, MUI, Framer Motion              |
| **Backend**           | MongoDB, Mongoose                           |
| **Flight Validation** | IVAO API + Native Electron App              |
| **Production Env**    | Serverless                                  |

---

## 🗺 Roadmap & Next Steps (Design Pending)

- [ ] Develop ML/Heuristics Anti-bot system for flight verification.
- [ ] AIRL ERC20 Smart Contract.
- [ ] AIRG ERC20 Smart Contract (Restricted minting).
- [ ] AIRL ↔ AIRG Staking Contract.
- [ ] Flight Rewards Distributor (Determining on-chain vs off-chain calculations).
- [ ] Treasury Multisig (Safe on Arbitrum).
- [ ] Team Vesting Contract.
- [ ] Referral Program Contract.
