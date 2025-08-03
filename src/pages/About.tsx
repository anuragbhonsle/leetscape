import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  // Auto-scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-4 pb-10 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="card-glass">
          <h1 className="text-3xl font-bold mb-6 text-gradient">
            About LeetScape
          </h1>

          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground mb-4">
                LeetScape is more than just a coding dashboard — it's your
                quiet, focused corner of the internet to master algorithms,
                track your grind, and get interview-ready without the chaos.
                Built to be clean, intentional, and fully aligned with your prep
                goals, LeetScape helps you stay consistent, take meaningful
                notes, and keep moving forward one problem at a time.
              </p>
              <p className="text-muted-foreground mb-4">
                Hey — I'm Anurag, a React dev from Pune 🇮🇳.
              </p>
              <p className="text-muted-foreground mb-4">
                Every note you write, every streak you build, every problem you
                face — it's all part of the journey. And LeetScape is here to
                walk it with you.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Built using</h2>
              <div className="flex flex-wrap gap-2">
                <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                  React
                </span>
                <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                  TypeScript
                </span>
                <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                  Firebase
                </span>
                <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                  Tailwind CSS
                </span>
                <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                  Vite
                </span>
                <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                  shadcn/ui
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Fueled by</h2>
              <p className="text-muted-foreground">
                Faith, caffeine, and the pursuit of clean code.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/80">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
