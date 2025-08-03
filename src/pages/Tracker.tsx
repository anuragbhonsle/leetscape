import { useState, useEffect } from "react";
import { TrendingUp, Calendar, Target, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { getAllUserProgress, UserProgress } from "@/lib/firebase";

const Tracker = () => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user progress on component mount
  useEffect(() => {
    const loadUserProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const progress = await getAllUserProgress(user.uid);
        setUserProgress(progress);
      } catch (error) {
        console.error("Error loading user progress:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProgress();
  }, [user]);

  // Calculate statistics from user progress
  const solvedProblems = userProgress.filter(p => p.solved);
  const bookmarkedProblems = userProgress.filter(p => p.bookmarked);
  const totalSolved = solvedProblems.length;
  const totalBookmarked = bookmarkedProblems.length;

  // Calculate progress by topic (using the problems from Explore page)
  const problems = [
    { id: 1, title: "Two Sum", difficulty: "Easy", tags: ["Array", "Hash Table"], pattern: "Hash Map" },
    { id: 2, title: "Add Two Numbers", difficulty: "Medium", tags: ["Linked List", "Math", "Recursion"], pattern: "Linked List" },
    { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", tags: ["String", "Sliding Window", "Hash Table"], pattern: "Sliding Window" },
    { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", tags: ["Array", "Binary Search", "Divide and Conquer"], pattern: "Binary Search" },
    { id: 5, title: "Valid Parentheses", difficulty: "Easy", tags: ["String", "Stack"], pattern: "Stack" },
    { id: 6, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", tags: ["Array", "Dynamic Programming"], pattern: "Dynamic Programming" },
    { id: 7, title: "Binary Tree Inorder Traversal", difficulty: "Easy", tags: ["Stack", "Tree", "Depth-First Search"], pattern: "Tree Traversal" },
    { id: 8, title: "Maximum Subarray", difficulty: "Medium", tags: ["Array", "Dynamic Programming", "Divide and Conquer"], pattern: "Dynamic Programming" },
    { id: 9, title: "Climbing Stairs", difficulty: "Easy", tags: ["Math", "Dynamic Programming", "Memoization"], pattern: "Dynamic Programming" },
    { id: 10, title: "Container With Most Water", difficulty: "Medium", tags: ["Array", "Two Pointers", "Greedy"], pattern: "Two Pointers" }
  ];

  // Calculate progress by topic
  const topicProgress = [
    { topic: "Array", solved: solvedProblems.filter(p => problems.find(prob => prob.id === p.problemId)?.tags.includes("Array")).length, total: problems.filter(p => p.tags.includes("Array")).length, percentage: 0 },
    { topic: "String", solved: solvedProblems.filter(p => problems.find(prob => prob.id === p.problemId)?.tags.includes("String")).length, total: problems.filter(p => p.tags.includes("String")).length, percentage: 0 },
    { topic: "Dynamic Programming", solved: solvedProblems.filter(p => problems.find(prob => prob.id === p.problemId)?.pattern === "Dynamic Programming").length, total: problems.filter(p => p.pattern === "Dynamic Programming").length, percentage: 0 },
    { topic: "Tree", solved: solvedProblems.filter(p => problems.find(prob => prob.id === p.problemId)?.tags.includes("Tree")).length, total: problems.filter(p => p.tags.includes("Tree")).length, percentage: 0 },
    { topic: "Graph", solved: 0, total: 25, percentage: 0 },
    { topic: "Binary Search", solved: solvedProblems.filter(p => problems.find(prob => prob.id === p.problemId)?.pattern === "Binary Search").length, total: problems.filter(p => p.pattern === "Binary Search").length, percentage: 0 }
  ].map(item => ({
    ...item,
    percentage: item.total > 0 ? Math.round((item.solved / item.total) * 100) : 0
  }));

  // Calculate progress by company (mock data for now)
  const companyProgress = [
    { company: "Google", solved: 0, total: 100 },
    { company: "Amazon", solved: 0, total: 120 },
    { company: "Microsoft", solved: 0, total: 80 },
    { company: "Facebook", solved: 0, total: 90 }
  ];

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Progress Tracker</h1>
          <p className="text-muted-foreground">Please sign in to view your progress.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Progress Tracker</h1>
          <p className="text-muted-foreground">
            Visualize your coding journey and track your improvement across topics and companies.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-gradient border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Problems
              </CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSolved}</div>
              <p className="text-xs text-muted-foreground">
                {totalSolved === 0 ? "Start your journey!" : `+${totalSolved} problems solved`}
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Streak
              </CardTitle>
              <Calendar className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 days</div>
              <p className="text-xs text-muted-foreground">
                Start your streak today!
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                This Week
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Goal: 5 problems
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Bookmarked
              </CardTitle>
              <Award className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookmarked}</div>
              <p className="text-xs text-muted-foreground">
                Problems to review
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress by Topic */}
        <Card className="card-gradient border-border">
          <CardHeader>
            <CardTitle>Progress by Topic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {topicProgress.map((item) => (
              <div key={item.topic} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.topic}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.solved}/{item.total} ({item.percentage}%)
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Progress by Company */}
        <Card className="card-gradient border-border">
          <CardHeader>
            <CardTitle>Progress by Company</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {companyProgress.map((item) => (
              <div key={item.company} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.company}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.solved}/{item.total} ({Math.round((item.solved / item.total) * 100)}%)
                  </span>
                </div>
                <Progress value={(item.solved / item.total) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-gradient border-border">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {solvedProblems.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No activity yet</h3>
                <p className="text-muted-foreground mt-1">
                  Start solving problems to see your activity here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {solvedProblems.slice(0, 5).map((progress) => (
                  <div key={progress.problemId} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm">Solved "{progress.problemTitle}"</span>
                    <span className="text-xs text-muted-foreground">
                      {progress.solvedAt ? new Date(progress.solvedAt).toLocaleDateString() : "Recently"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tracker;