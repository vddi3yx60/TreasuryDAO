import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-warm flex items-center justify-center shadow-warm">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold bg-gradient-warm bg-clip-text text-transparent">
            TreasuryDAO
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
            Dashboard
          </a>
          <a href="#proposals" className="text-foreground/80 hover:text-foreground transition-colors">
            Proposals
          </a>
          <a href="#docs" className="text-foreground/80 hover:text-foreground transition-colors">
            Docs
          </a>
        </div>

        <ConnectButton />
      </nav>
    </header>
  );
};

export default Header;
