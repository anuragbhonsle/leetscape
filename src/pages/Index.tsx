import { HeroSection } from "@/components/hero-section"
import { DashboardCards } from "@/components/dashboard-cards"
import { FAQSection } from "@/components/faq-section"

const Index = () => {
  const isAuthenticated = false // This will be replaced with actual auth state

  return (
    <div className="min-h-screen">
      {/* Hero Section for non-authenticated users */}
      {!isAuthenticated && <HeroSection />}
      
      {/* Dashboard for authenticated users */}
      {isAuthenticated && (
        <div className="container py-8">
          <DashboardCards />
        </div>
      )}
      
      {/* FAQ Section (always visible) */}
      <FAQSection />
    </div>
  );
};

export default Index;
