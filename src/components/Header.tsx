import { ConnectButton } from '@rainbow-me/rainbowkit';
// brand logo uses public/favicon.svg
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleNavigation = (path: string, hash?: string) => {
    if (path === '/' && hash) {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(path);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-warm flex items-center justify-center shadow-warm">
            <img src="/favicon.svg" alt="TreasuryDAO" className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-gradient-warm bg-clip-text text-transparent">
            TreasuryDAO
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {isHomePage ? (
            <>
              <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
                Dashboard
              </a>
              <a href="#proposals" className="text-foreground/80 hover:text-foreground transition-colors">
                Proposals
              </a>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigation('/', '#features')}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => handleNavigation('/', '#proposals')}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Proposals
              </button>
            </>
          )}
          <button
            onClick={() => navigate('/docs')}
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Docs
          </button>
        </div>

        <ConnectButton />
      </nav>
    </header>
  );
};

export default Header;
