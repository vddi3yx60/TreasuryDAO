import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Lock, Wallet, FileText, Vote, CheckCircle2, Clock, Rocket } from 'lucide-react';

const Docs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 py-24 max-w-5xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Documentation
          </h1>
          <p className="text-xl text-muted-foreground">
            Learn how TreasuryDAO works and how to participate in privacy-preserving governance
          </p>
        </div>

        {/* What is TreasuryDAO */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">What is TreasuryDAO?</h2>
          <Card className="p-8 shadow-warm">
            <p className="text-lg text-muted-foreground mb-4">
              TreasuryDAO is a privacy-preserving DAO treasury management system built using <strong>Zama's Fully Homomorphic Encryption (FHE)</strong> technology. It enables decentralized organizations to conduct governance with complete voting privacy while maintaining transparency in financial operations.
            </p>
            <p className="text-lg text-muted-foreground">
              Unlike traditional on-chain voting where all votes are public and can be manipulated, TreasuryDAO uses FHE to encrypt votes on-chain. This means nobody can see how you vote until the proposal is finalized, preventing vote buying, whale influence, and herd mentality.
            </p>
          </Card>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <Card className="p-6 shadow-warm">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">1. Deposit ETH</h3>
                  <p className="text-muted-foreground mb-3">
                    To participate in governance, you need to deposit at least 0.001 ETH into the DAO treasury. This ensures that all participants have a stake in the DAO's success.
                  </p>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm"><strong>Why plaintext?</strong> Financial transparency builds trust. All members can verify the total treasury balance and individual contributions.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="p-6 shadow-warm">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">2. Create or Browse Proposals</h3>
                  <p className="text-muted-foreground mb-3">
                    Any member with sufficient deposit can create proposals. Proposals include:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-3">
                    <li>Title and description (what you want to accomplish)</li>
                    <li>Amount of ETH to allocate</li>
                    <li>Recipient address</li>
                    <li>Voting period (3-30 days)</li>
                  </ul>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm"><strong>Why plaintext?</strong> Proposal details must be public so members can make informed decisions. Transparency here is crucial for good governance.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="p-6 shadow-warm">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">3. Vote with Privacy (FHE Encrypted)</h3>
                  <p className="text-muted-foreground mb-3">
                    When you vote YES or NO, your vote is encrypted using FHE before being submitted to the blockchain. This is the magic of TreasuryDAO:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-3">
                    <li><strong>Your vote is encrypted</strong> by your browser using Zama's FHE SDK</li>
                    <li><strong>Nobody can see your vote</strong> - not even the contract owner</li>
                    <li><strong>Vote counting happens on encrypted data</strong> - the contract tallies votes without decrypting them</li>
                    <li><strong>Results are revealed only after voting ends</strong></li>
                  </ul>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm font-medium mb-2">🔐 FHE in Action</p>
                    <p className="text-sm text-muted-foreground">
                      When you click "Vote YES", the frontend encrypts the number "1". For "Vote NO", it encrypts "0". The smart contract receives this encrypted value and adds it to the encrypted vote counters using homomorphic operations - all without ever decrypting!
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 4 */}
            <Card className="p-6 shadow-warm">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Vote className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">4. Proposal Finalization (Coming Soon)</h3>
                  <p className="text-muted-foreground mb-3">
                    After the voting period ends, anyone can trigger finalization:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>The contract requests decryption of the encrypted vote tallies</li>
                    <li>Results become public (total YES votes vs NO votes)</li>
                    <li>If YES wins, the proposal can be executed</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Key Features</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 shadow-warm">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Complete Vote Privacy</h3>
              </div>
              <p className="text-muted-foreground">
                Your individual vote remains encrypted on-chain. Nobody can see how you voted until the proposal is finalized.
              </p>
            </Card>

            <Card className="p-6 shadow-warm">
              <div className="flex items-center gap-3 mb-3">
                <Wallet className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Financial Transparency</h3>
              </div>
              <p className="text-muted-foreground">
                All deposits and proposal amounts are public, ensuring trust and accountability in treasury management.
              </p>
            </Card>

            <Card className="p-6 shadow-warm">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Informed Decisions</h3>
              </div>
              <p className="text-muted-foreground">
                Proposal details are public so all members can understand what they're voting on before casting their ballot.
              </p>
            </Card>

            <Card className="p-6 shadow-warm">
              <div className="flex items-center gap-3 mb-3">
                <Vote className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">On-Chain Computation</h3>
              </div>
              <p className="text-muted-foreground">
                Vote tallying happens directly on encrypted data using FHE - no trusted third parties needed.
              </p>
            </Card>
          </div>
        </section>

        {/* Roadmap */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Roadmap</h2>
          <p className="text-muted-foreground mb-8">
            Our development roadmap for TreasuryDAO (updated October 2025)
          </p>

          <div className="space-y-6">
            {/* Phase 1 - Complete */}
            <Card className="p-6 shadow-warm border-primary/50">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">Phase 1: Core Functionality</h3>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-500">
                      ✅ Completed
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Q3-Q4 2025</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Smart contract with FHE voting
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Frontend with wallet integration
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Deposit and proposal creation
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Encrypted vote submission
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Sepolia testnet deployment
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Phase 2 - In Progress */}
            <Card className="p-6 shadow-warm border-primary/50">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">Phase 2: Enhanced Features</h3>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      🚧 In Progress
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Q1 2026</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 rounded-full border-2 border-primary/50" />
                      Automatic proposal finalization
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 rounded-full border-2 border-primary/50" />
                      Vote result decryption UI
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 rounded-full border-2 border-primary/50" />
                      Multi-signature proposal execution
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 rounded-full border-2 border-primary/50" />
                      Proposal metadata on IPFS
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 rounded-full border-2 border-primary/50" />
                      Gas optimization
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 rounded-full border-2 border-primary/50" />
                      Treasury analytics dashboard
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Phase 3 - Planned */}
            <Card className="p-6 shadow-warm">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <Rocket className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">Phase 3: Mainnet & Scaling</h3>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                      📋 Planned
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Q2-Q3 2026</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                      Security audit by reputable firm
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                      Mainnet deployment
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                      Layer 2 integration (Arbitrum/Optimism)
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                      Quadratic voting with FHE
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                      Delegation system
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                      Integration with DAO tooling (Snapshot, Tally)
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Technical Details */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Technical Details</h2>

          <Card className="p-8 shadow-warm">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-3">Smart Contract</h3>
                <p className="text-muted-foreground mb-2">
                  <strong>Network:</strong> Sepolia Testnet
                </p>
                <p className="text-muted-foreground mb-2">
                  <strong>Address:</strong>{' '}
                  <a
                    href="https://sepolia.etherscan.io/address/0x73FbaE0f1e2000F607E52Fd3087AeD88341847fB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-mono"
                  >
                    0x73FbaE0f1e2000F607E52Fd3087AeD88341847fB
                  </a>
                </p>
                <p className="text-muted-foreground">
                  <strong>Technology:</strong> Solidity 0.8.24, Zama fhEVM v0.8.0
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">Frontend</h3>
                <p className="text-muted-foreground mb-2">
                  <strong>Framework:</strong> React 18 + TypeScript
                </p>
                <p className="text-muted-foreground mb-2">
                  <strong>Web3 Integration:</strong> Wagmi v2, RainbowKit, Ethers.js v6
                </p>
                <p className="text-muted-foreground">
                  <strong>FHE SDK:</strong> Loaded from CDN (https://cdn.zama.ai/relayer-sdk-js/0.2.0)
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">Gas Costs</h3>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    <strong>Deposit:</strong> ~50,000 gas
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Create Proposal:</strong> ~200,000 gas
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Vote (FHE):</strong> ~400,000 gas
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Get Started CTA */}
        <section>
          <Card className="p-8 text-center shadow-warm bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Connect your wallet and start participating in privacy-preserving governance today
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/')}
              className="bg-gradient-warm hover:opacity-90 text-primary-foreground font-semibold px-8 shadow-elevated"
            >
              Launch App
            </Button>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Docs;
