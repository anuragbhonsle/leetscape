import { useState, useEffect } from "react";
import {
  TrendingUp,
  Target,
  Calendar,
  Bookmark,
  Brain,
  Building,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { getAllUserProgress, UserProgress } from "@/lib/firebase";
import { problems } from "@/problems-data";

export function DashboardCards() {
  const { user, userProfile } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user progress
  const loadUserProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const progress = await getAllUserProgress(user.uid);
      setUserProgress(progress);
    } catch (error) {
      console.error("Error loading user progress:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load progress on mount and when user changes
  useEffect(() => {
    loadUserProgress();
  }, [user]);

  // Refresh progress when component becomes visible (user navigates to home page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        loadUserProgress();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  // Calculate real stats from user progress
  const solvedProblems = userProgress.filter((p) => p.solved);
  const totalSolved = solvedProblems.length;
  const bookmarkedProblems = userProgress.filter((p) => p.bookmarked);
  const totalBookmarked = bookmarkedProblems.length;

  // Calculate difficulty distribution from solved problems
  const difficultyStats = [
    { label: "Easy", solved: 0, total: 0, color: "bg-success" },
    { label: "Medium", solved: 0, total: 0, color: "bg-warning" },
    { label: "Hard", solved: 0, total: 0, color: "bg-destructive" },
  ];

  // Calculate real difficulty distribution
  solvedProblems.forEach((progress) => {
    const problem = problems.find((p) => p.id === progress.problemId);
    if (problem) {
      const difficultyIndex = difficultyStats.findIndex(
        (stat) => stat.label === problem.difficulty
      );
      if (difficultyIndex !== -1) {
        difficultyStats[difficultyIndex].solved++;
      }
    }
  });

  // Calculate total problems by difficulty
  problems.forEach((problem) => {
    const difficultyIndex = difficultyStats.findIndex(
      (stat) => stat.label === problem.difficulty
    );
    if (difficultyIndex !== -1) {
      difficultyStats[difficultyIndex].total++;
    }
  });

  // Debug logging
  console.log("Dashboard Debug:", {
    userProgress,
    solvedProblems,
    totalSolved,
    difficultyStats,
    problems: problems.length,
  });

  const stats = [
    {
      title: "Total Solved",
      value: totalSolved.toString(),
      icon: Target,
      change: "Start solving problems!",
      color: "text-primary",
    },
    {
      title: "Current Streak",
      value: "0 days",
      icon: Calendar,
      change: "Build your streak!",
      color: "text-success",
    },
    {
      title: "Bookmarked",
      value: totalBookmarked.toString(),
      icon: Bookmark,
      change: "Save problems to study later",
      color: "text-warning",
    },
  ];

  const customUsername =
    userProfile?.customUsername || user?.displayName || "Developer";

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">
            Loading your progress...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-3">
        <h1 className="text-foreground">
          Welcome back, <span className="text-gradient">{customUsername}</span>!
        </h1>
        <p className="text-muted-foreground text-lg">
          Let's continue your coding journey and level up your skills.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="bg-card border-border transition-smooth hover:bg-card-hover"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-primary-soft rounded-lg">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Difficulty Breakdown */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <div className="p-2 bg-primary-soft rounded-lg mr-3">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            Difficulty Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {difficultyStats.map((item) => (
            <div key={item.label} className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">
                  {item.label}
                </span>
                <span className="text-muted-foreground">
                  {item.solved}/{item.total}
                </span>
              </div>
              <Progress
                value={item.total > 0 ? (item.solved / item.total) * 100 : 0}
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-border transition-smooth hover:bg-card-hover cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <div className="p-2 bg-primary-soft rounded-lg mr-3">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              Problem Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Master common patterns like Two Pointers, Sliding Window, and
              Dynamic Programming
            </p>
            <Button variant="outline" size="sm" className="text-sm">
              Explore Patterns
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border transition-smooth hover:bg-card-hover cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <div className="p-2 bg-accent-soft rounded-lg mr-3">
                <Building className="h-4 w-4 text-accent" />
              </div>
              Company Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Practice questions frequently asked by top tech companies
            </p>
            <Button variant="outline" size="sm" className="text-sm">
              View Companies
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
