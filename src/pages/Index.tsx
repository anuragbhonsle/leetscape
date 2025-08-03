import { HeroSection } from "@/components/hero-section";
import { DashboardCards } from "@/components/dashboard-cards";
import { FAQSection } from "@/components/faq-section";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section for non-authenticated users */}
      {!user && <HeroSection />}

      {/* Dashboard for authenticated users */}
      {user && (
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
