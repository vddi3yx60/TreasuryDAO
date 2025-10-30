import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Encrypted Treasury Management</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Manage Your DAO Treasury with
            <span className="bg-gradient-warm bg-clip-text text-transparent"> Complete Privacy</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            TreasuryDAO enables DAOs to manage on-chain treasuries while maintaining financial privacy. 
            Balances, proposal amounts, and spending are homomorphically encrypted—only DAO members can decrypt.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-gradient-warm hover:opacity-90 text-primary-foreground font-semibold px-8 shadow-elevated">
              Launch App
            </Button>
            <Button size="lg" variant="outline" className="border-2">
              Learn More
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-warm">
              <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-2">
                100%
              </div>
              <p className="text-sm text-muted-foreground">Encrypted Transactions</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border shadow-warm">
              <Eye className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-2">
                Public
              </div>
              <p className="text-sm text-muted-foreground">Voting Transparency</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border shadow-warm">
              <Lock className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-2">
                Members Only
              </div>
              <p className="text-sm text-muted-foreground">Financial Privacy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
