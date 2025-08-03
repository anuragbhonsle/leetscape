import { ArrowRight, Play, Code2, Zap, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function HeroSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          {/* Main heading */}
          <div className="space-y-6">
            <h1 className="text-foreground animate-fade-in">
              Your focused workspace for mastering algorithms
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto animate-fade-in">
              LeetScape helps you stay organized, track progress, and build consistency in your coding interview preparation.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover transition-smooth px-8 py-6 text-base font-medium">
              <Link to="/explore" className="flex items-center">
                Browse Problems
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="border-border hover:bg-muted transition-smooth px-8 py-6 text-base font-medium">
              <Link to="/tracker" className="flex items-center">
                Track Progress
              </Link>
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 animate-fade-in">
            <div className="p-6 text-center bg-card rounded-xl border border-border transition-smooth hover:bg-card-hover">
              <div className="w-12 h-12 mx-auto bg-primary-soft rounded-lg flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-semibold text-primary mb-2">3,500+</div>
              <div className="text-sm text-muted-foreground">Curated Problems</div>
            </div>
            
            <div className="p-6 text-center bg-card rounded-xl border border-border transition-smooth hover:bg-card-hover">
              <div className="w-12 h-12 mx-auto bg-accent-soft rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-semibold text-accent mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Free Forever</div>
            </div>
            
            <div className="p-6 text-center bg-card rounded-xl border border-border transition-smooth hover:bg-card-hover">
              <div className="w-12 h-12 mx-auto bg-primary-soft rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-semibold text-foreground mb-2">Smart</div>
              <div className="text-sm text-muted-foreground">Progress Tracking</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}