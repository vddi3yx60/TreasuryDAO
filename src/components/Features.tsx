import { Shield, Lock, Vote, Eye, Key, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Lock,
    title: 'Homomorphic Encryption',
    description: 'Treasury balances and transaction amounts are encrypted using advanced homomorphic encryption, ensuring complete financial privacy while maintaining verifiability.'
  },
  {
    icon: Eye,
    title: 'Members-Only Access',
    description: 'Only verified DAO members can decrypt and view sensitive financial information. Your treasury data remains hidden from external observers.'
  },
  {
    icon: Vote,
    title: 'Transparent Voting',
    description: 'While financial details stay private, voting is public and transparent. Every member can verify governance decisions without seeing amounts.'
  },
  {
    icon: Shield,
    title: 'On-Chain Security',
    description: 'All treasury operations are secured on-chain with battle-tested smart contracts, ensuring trustless and immutable financial management.'
  },
  {
    icon: Key,
    title: 'Decryption Keys',
    description: 'Decryption keys are distributed among DAO members using threshold cryptography, ensuring no single point of failure.'
  },
  {
    icon: Users,
    title: 'DAO Governance',
    description: 'Seamless integration with your existing DAO structure. Create proposals, vote, and execute with full privacy protection.'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy-First Treasury Management
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Combining the transparency of blockchain with the privacy your DAO needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 border-2 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-warm flex items-center justify-center mb-6 shadow-warm">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
