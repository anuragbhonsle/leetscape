import { useState, useEffect } from "react";
import {
  Edit,
  Mail,
  Calendar,
  Trophy,
  Target,
  Save,
  X,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getAllUserProgress, UserProgress } from "@/lib/firebase";
import { problems } from "@/problems-data";

const Profile = () => {
  const { user, userProfile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(
    userProfile?.customUsername || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Load user progress
  const loadUserProgress = async () => {
    if (!user) return;

    try {
      setLoadingProgress(true);
      const progress = await getAllUserProgress(user.uid);
      setUserProgress(progress);
    } catch (error) {
      console.error("Error loading user progress:", error);
    } finally {
      setLoadingProgress(false);
    }
  };

  // Load progress on mount and when user changes
  useEffect(() => {
    loadUserProgress();
  }, [user]);

  // Refresh progress when component becomes visible (user navigates to Profile)
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

  // Calculate stats from real user progress
  const solvedProblems = userProgress.filter((p) => p.solved);
  const totalSolved = solvedProblems.length;
  const bookmarkedProblems = userProgress.filter((p) => p.bookmarked);
  const totalBookmarked = bookmarkedProblems.length;

  // Debug logging
  console.log("Profile Debug:", {
    userProgress,
    solvedProblems,
    totalSolved,
    bookmarkedProblems,
    totalBookmarked,
    user: user?.uid,
  });

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

  // Calculate company focus from solved problems
  const companyStats = new Map<string, number>();

  solvedProblems.forEach((progress) => {
    const problem = problems.find((p) => p.id === progress.problemId);
    if (problem) {
      problem.companies.forEach((company) => {
        companyStats.set(company, (companyStats.get(company) || 0) + 1);
      });
    }
  });

  // Get top 4 companies
  const topCompanies = Array.from(companyStats.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([company, count]) => ({ company, problems: count }));

  // Fill with default companies if not enough data
  const defaultCompanies = ["Google", "Amazon", "Microsoft", "Meta"];
  const companyFocus = defaultCompanies.map((company) => {
    const found = topCompanies.find((c) => c.company === company);
    return found || { company, problems: 0 };
  });

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      toast({
        title: "Error",
        description: "Username cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (newUsername.length < 3) {
      toast({
        title: "Error",
        description: "Username must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }

    if (newUsername.length > 20) {
      toast({
        title: "Error",
        description: "Username must be less than 20 characters",
        variant: "destructive",
      });
      return;
    }

    // Check for valid characters (alphanumeric and underscore only)
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      toast({
        title: "Error",
        description:
          "Username can only contain letters, numbers, and underscores",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({ customUsername: newUsername.trim() });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Username updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update username. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setNewUsername(userProfile?.customUsername || "");
    setIsEditing(false);
  };

  const handleRefreshProgress = async () => {
    await loadUserProgress();
    toast({
      title: "Success",
      description: "Progress data refreshed",
    });
  };

  if (!user || !userProfile) {
    return (
      <div className="container py-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Please sign in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">
                Manage your account settings and view your coding journey
                statistics.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshProgress}
              disabled={loadingProgress}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${
                  loadingProgress ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="card-gradient border-border">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="Enter new username"
                          disabled={isLoading}
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={handleSaveUsername}
                            disabled={isLoading}
                            className="flex-1"
                          >
                            {isLoading ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                                Saving...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Save className="mr-2 h-4 w-4" />
                                Save
                              </div>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Input
                          value={
                            userProfile.customUsername ||
                            user.displayName ||
                            "User"
                          }
                          readOnly
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Member Since</label>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {userProfile.createdAt
                          ? new Date(userProfile.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                              }
                            )
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="card-gradient border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total Solved</span>
                  <span className="font-semibold">{totalSolved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Bookmarked</span>
                  <span className="font-semibold">{totalBookmarked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Current Streak</span>
                  <span className="font-semibold">0 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Best Streak</span>
                  <span className="font-semibold">0 days</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Difficulty Distribution */}
            <Card className="card-gradient border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-primary" />
                  Difficulty Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {difficultyStats.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.solved}/{item.total} (
                        {item.total > 0
                          ? Math.round((item.solved / item.total) * 100)
                          : 0}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={
                        item.total > 0 ? (item.solved / item.total) * 100 : 0
                      }
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Company Focus */}
            <Card className="card-gradient border-border">
              <CardHeader>
                <CardTitle>Company Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {companyFocus.map((item) => (
                    <div
                      key={item.company}
                      className="text-center p-4 rounded-lg bg-muted/30"
                    >
                      <div className="text-2xl font-bold text-primary">
                        {item.problems}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.company}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="card-gradient border-border">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingProgress ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-sm text-muted-foreground">
                      Loading progress...
                    </p>
                  </div>
                ) : solvedProblems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground mb-4">
                      <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">
                        No activity yet
                      </h3>
                      <p className="text-sm">
                        Start solving problems to see your progress here!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {solvedProblems.slice(0, 5).map((problem) => (
                      <div
                        key={problem.problemId}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">
                          Solved "{problem.problemTitle}"
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {problem.solvedAt
                            ? new Date(problem.solvedAt).toLocaleDateString()
                            : "Recently"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
