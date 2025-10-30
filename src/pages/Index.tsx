import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import DashboardPreview from '@/components/DashboardPreview';
import ProposalsList from '@/components/ProposalsList';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <DashboardPreview />
      <ProposalsList />
      <Footer />
    </div>
  );
};

export default Index;
