import { Card } from '@/components/ui/card';
import { Lock, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const DashboardPreview = () => {
  return (
    <section id="dashboard" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Encrypted Treasury Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time insights with complete privacy protection
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-warm border-0 shadow-elevated">
              <div className="flex items-center justify-between mb-4">
                <span className="text-primary-foreground/80 font-medium">Total Balance</span>
                <Lock className="w-5 h-5 text-primary-foreground/60" />
              </div>
              <div className="text-3xl font-bold text-primary-foreground mb-2">
                ████.██ ETH
              </div>
              <div className="flex items-center gap-1 text-primary-foreground/80 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Encrypted</span>
              </div>
            </Card>
            
            <Card className="p-6 shadow-warm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground font-medium">Monthly Spending</span>
                <Lock className="w-5 h-5 text-muted-foreground/60" />
              </div>
              <div className="text-3xl font-bold mb-2">
                ██.█ ETH
              </div>
              <div className="flex items-center gap-1 text-destructive text-sm">
                <ArrowDownRight className="w-4 h-4" />
                <span>Encrypted</span>
              </div>
            </Card>
            
            <Card className="p-6 shadow-warm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground font-medium">Active Proposals</span>
              </div>
              <div className="text-3xl font-bold mb-2">
                8
              </div>
              <div className="flex items-center gap-1 text-primary text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>Public Data</span>
              </div>
            </Card>
          </div>
          
          <Card className="p-8 shadow-elevated bg-card/50 backdrop-blur">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Recent Transactions
            </h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-earth flex items-center justify-center">
                      <Lock className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">Proposal #{i} Payment</div>
                      <div className="text-sm text-muted-foreground">
                        {i} days ago
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold">████ ETH</div>
                    <div className="text-xs text-muted-foreground">Encrypted</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
