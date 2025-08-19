import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function HeroSection() {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{
          filter: "blur(3px) brightness(0.8) saturate(1.2) contrast(1.2)",
        }}
      >
        <source src="/dsa.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for readability */}
      <div
        className="absolute inset-0 bg-black/50 z-0"
        style={{
          backdropFilter: "blur(2px)", // affects overlay area
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-2 -mt-6">
        <div className="mx-auto max-w-8xl text-center space-y-8 px-4">
          {/* Heading */}
          <div className="space-y-6">
            {user && !loading ? (
              <h1 className="text-white animate-fade-in text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
                Welcome back,{" "}
                <span className="text-gradient">
                  {userProfile?.customUsername ||
                    user.displayName ||
                    "Developer"}
                </span>
                !
              </h1>
            ) : (
              <h1 className="text-white animate-fade-in text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-bold leading-tight tracking-tight whitespace-nowrap">
                Your workspace for mastering{" "}
                <span className="text-gradient">Algorithms</span>
              </h1>
            )}
            <p
              className="text-lg lg:text-l text-white/80 leading-relaxed max-w-2xl mx-auto 
             opacity-0 animate-[fadeUp_1s_ease-out_0.5s_forwards]"
              style={{
                animationName: "fadeUp",
                animationDuration: "1s",
                animationTimingFunction: "ease-out",
                animationDelay: "0.1s",
                animationFillMode: "forwards",
              }}
            >
              LeetScape helps you stay organized, track progress efficiently,
              and build strong consistency in your coding interview preparation.
            </p>

            <style>
              {`
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
`}
            </style>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              asChild
              size="lg"
              className="px-5 py-3 text-base font-medium !rounded-2xl"
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
                className="px-8 py-6 text-base font-medium !rounded-2xl"
              >
                <Link to="/tracker" className="flex items-center">
                  Track Progress
                </Link>
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="lg"
                className="px-8 py-6 text-base font-medium !rounded-2xl hover:ring-2 hover:ring-blue-500 hover:ring-inset transition-all duration-200"
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
