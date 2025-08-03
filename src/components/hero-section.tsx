import { ArrowRight, Play, Code2, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function HeroSection() {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  // Debug logging
  console.log("Hero Section - User:", user?.displayName);
  console.log("Hero Section - UserProfile:", userProfile);
  console.log("Hero Section - Custom Username:", userProfile?.customUsername);

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-2 -mt-6">
        <div className="mx-auto max-w-8xl text-center space-y-8 px-4">
          {/* Main heading */}
          <div className="space-y-6">
            {user && !loading ? (
              <h1 className="text-foreground animate-fade-in text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
                Welcome back,{" "}
                <span className="text-gradient">
                  {userProfile?.customUsername ||
                    user.displayName ||
                    "Developer"}
                </span>
                !
              </h1>
            ) : (
              <h1 className="text-foreground animate-fade-in text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight whitespace-nowrap">
                Your workspace for mastering{" "}
                <span className="text-gradient">Algorithms</span>
              </h1>
            )}
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto animate-fade-in">
              LeetScape helps you stay organized, track progress efficiently,
              and build strong consistency in your coding interview preparation.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              asChild
              size="lg"
              className="px-8 py-6 text-base font-medium"
            >
              <Link to="/explore" className="flex items-center">
                Explore Problems
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            {user ? (
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-base font-medium"
              >
                <Link to="/tracker" className="flex items-center">
                  Track Progress
                </Link>
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="lg"
                className="px-8 py-6 text-base font-medium hover:ring-2 hover:ring-blue-500 hover:ring-inset transition-all duration-200"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
