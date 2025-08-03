import { useState, useEffect, useMemo, memo, useCallback } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Bookmark,
  CheckCircle,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  markProblemSolved,
  toggleProblemBookmark,
  getUserProblemProgress,
  createUserNote,
  UserProgress,
  getAllUserProgress,
} from "@/lib/firebase";
import { problems } from "../problems-data";

// Memoized Problem Card Component
const ProblemCard = memo(
  ({
    problem,
    isSolved,
    isBookmarked,
    isLoading,
    isExpanded,
    onMarkSolved,
    onToggleBookmark,
    onAddNote,
    onClick,
  }: {
    problem: (typeof problems)[0];
    isSolved: boolean;
    isBookmarked: boolean;
    isLoading: boolean;
    isExpanded: boolean;
    onMarkSolved: (id: number) => void;
    onToggleBookmark: (id: number) => void;
    onAddNote: (problem: (typeof problems)[0]) => void;
    onClick: (id: number) => void;
  }) => {
    const getDifficultyColor = useCallback((difficulty: string) => {
      switch (difficulty) {
        case "Easy":
          return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        case "Medium":
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        case "Hard":
          return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      }
    }, []);

    const handleMarkSolved = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onMarkSolved(problem.id);
      },
      [onMarkSolved, problem.id]
    );

    const handleToggleBookmark = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleBookmark(problem.id);
      },
      [onToggleBookmark, problem.id]
    );

    const handleAddNote = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddNote(problem);
      },
      [onAddNote, problem]
    );

    const handleCardClick = useCallback(() => {
      onClick(problem.id);
    }, [onClick, problem.id]);

    return (
      <Card
        className={`card-gradient border-border transition-all duration-300 cursor-pointer hover:shadow-elegant ${
          isExpanded ? "ring-2 ring-primary" : ""
        }`}
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Left side - Problem info */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                  {problem.id}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium truncate problem-text">
                    {problem.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground problem-text">
                      {problem.acceptanceRate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Actions and expand indicator */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant={isSolved ? "default" : "outline"}
                  onClick={handleMarkSolved}
                  disabled={isLoading}
                  className="h-8 px-3"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant={isBookmarked ? "default" : "outline"}
                  onClick={handleToggleBookmark}
                  disabled={isLoading}
                  className="h-8 px-3"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddNote}
                  className="h-8 px-3"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          {/* Expanded content */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2 problem-text">
                    Problem Type
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {problem.tags?.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs problem-text"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 problem-text">Companies</h4>
                  <div className="flex flex-wrap gap-1">
                    {problem.companies?.map((company, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs problem-text"
                      >
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

ProblemCard.displayName = "ProblemCard";

const Explore = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProgress, setUserProgress] = useState<
    Record<number, UserProgress>
  >({});
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // Note dialog states
  const [selectedProblemForNote, setSelectedProblemForNote] = useState<
    (typeof problems)[0] | null
  >(null);
  const [noteContent, setNoteContent] = useState("");
  const [noteTags, setNoteTags] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Load user progress
  useEffect(() => {
    const loadUserProgress = async () => {
      if (!user) return;

      try {
        const progress = await getAllUserProgress(user.uid);
        const progressMap: Record<number, UserProgress> = {};
        progress.forEach((p) => {
          progressMap[p.problemId] = p;
        });
        setUserProgress(progressMap);
      } catch (error) {
        console.error("Error loading user progress:", error);
      }
    };

    loadUserProgress();
  }, [user]);

  const handleMarkSolved = useCallback(
    async (problemId: number) => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to mark problems as solved.",
          variant: "destructive",
        });
        return;
      }

      setLoadingStates((prev) => ({ ...prev, [problemId]: true }));
      try {
        const problem = problems.find((p) => p.id === problemId);
        if (!problem) return;

        await markProblemSolved(
          user.uid,
          problemId,
          problem.title,
          !userProgress[problemId]?.solved
        );

        setUserProgress((prev) => ({
          ...prev,
          [problemId]: {
            ...prev[problemId],
            problemId,
            title: problem.title,
            solved: !prev[problemId]?.solved,
            bookmarked: prev[problemId]?.bookmarked || false,
          },
        }));

        toast({
          title: "Problem Updated",
          description: `Problem marked as ${
            userProgress[problemId]?.solved ? "unsolved" : "solved"
          }.`,
        });
      } catch (error) {
        console.error("Error marking problem solved:", error);
        toast({
          title: "Error",
          description: "Failed to update problem status.",
          variant: "destructive",
        });
      } finally {
        setLoadingStates((prev) => ({ ...prev, [problemId]: false }));
      }
    },
    [user, userProgress, toast]
  );

  const handleToggleBookmark = useCallback(
    async (problemId: number) => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to bookmark problems.",
          variant: "destructive",
        });
        return;
      }

      setLoadingStates((prev) => ({ ...prev, [problemId]: true }));
      try {
        const problem = problems.find((p) => p.id === problemId);
        if (!problem) return;

        await toggleProblemBookmark(
          user.uid,
          problemId,
          problem.title,
          !userProgress[problemId]?.bookmarked
        );

        setUserProgress((prev) => ({
          ...prev,
          [problemId]: {
            ...prev[problemId],
            problemId,
            title: problem.title,
            solved: prev[problemId]?.solved || false,
            bookmarked: !prev[problemId]?.bookmarked,
          },
        }));

        toast({
          title: "Bookmark Updated",
          description: `Problem ${
            userProgress[problemId]?.bookmarked ? "removed from" : "added to"
          } bookmarks.`,
        });
      } catch (error) {
        console.error("Error toggling bookmark:", error);
        toast({
          title: "Error",
          description: "Failed to update bookmark status.",
          variant: "destructive",
        });
      } finally {
        setLoadingStates((prev) => ({ ...prev, [problemId]: false }));
      }
    },
    [user, userProgress, toast]
  );

  const handleAddNote = useCallback((problem: (typeof problems)[0]) => {
    setSelectedProblemForNote(problem);
    setNoteContent("");
    setNoteTags("");
  }, []);

  const handleSaveNote = useCallback(async () => {
    if (!user || !selectedProblemForNote) return;

    setIsSavingNote(true);
    try {
      await createUserNote(
        user.uid,
        selectedProblemForNote.id,
        selectedProblemForNote.title,
        noteContent,
        noteTags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      );

      toast({
        title: "Note Saved",
        description: "Your note has been saved successfully.",
      });

      setSelectedProblemForNote(null);
      setNoteContent("");
      setNoteTags("");
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Error",
        description: "Failed to save note.",
        variant: "destructive",
      });
    } finally {
      setIsSavingNote(false);
    }
  }, [user, selectedProblemForNote, noteContent, noteTags, toast]);

  const handleCardClick = useCallback(
    (problemId: number) => {
      setExpandedCard(expandedCard === problemId ? null : problemId);
    },
    [expandedCard]
  );

  // Memoized filtered and sorted problems
  const sortedProblems = useMemo(() => {
    let filtered = problems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesDifficulty =
        difficultyFilter === "all" || problem.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "difficulty":
          const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
          return (
            difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
            difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
          );
        case "acceptance":
          return parseFloat(a.acceptanceRate) - parseFloat(b.acceptanceRate);
        default:
          return a.id - b.id;
      }
    });
  }, [searchTerm, sortBy, difficultyFilter]);

  const totalSolved = Object.values(userProgress).filter(
    (p) => p.solved
  ).length;
  const totalBookmarked = Object.values(userProgress).filter(
    (p) => p.bookmarked
  ).length;

  // Memoized visible problems for performance
  const visibleProblems = useMemo(() => {
    // Only show first 20 problems initially for better performance
    // This prevents rendering all 100 problems at once during theme changes
    return sortedProblems.slice(0, 20);
  }, [sortedProblems]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Problem Explorer</h1>
        <p className="text-muted-foreground">
          Explore and practice with {problems.length} curated problems
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm">
          <span className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            {totalSolved} solved
          </span>
          <span className="flex items-center gap-1">
            <Bookmark className="h-4 w-4 text-blue-600" />
            {totalBookmarked} bookmarked
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search problems by title or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">Problem ID</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="acceptance">Acceptance Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>
        </div>

        {showAdvancedFilters && (
          <Card className="p-4">
            <CardTitle className="text-lg mb-4">Advanced Filters</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Problem Type
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Array">Array</SelectItem>
                    <SelectItem value="String">String</SelectItem>
                    <SelectItem value="Linked List">Linked List</SelectItem>
                    <SelectItem value="Tree">Tree</SelectItem>
                    <SelectItem value="Dynamic Programming">
                      Dynamic Programming
                    </SelectItem>
                    <SelectItem value="Backtracking">Backtracking</SelectItem>
                    <SelectItem value="Two Pointers">Two Pointers</SelectItem>
                    <SelectItem value="Binary Search">Binary Search</SelectItem>
                    <SelectItem value="Stack">Stack</SelectItem>
                    <SelectItem value="Hash Table">Hash Table</SelectItem>
                    <SelectItem value="Math">Math</SelectItem>
                    <SelectItem value="Heap">Heap</SelectItem>
                    <SelectItem value="Sliding Window">
                      Sliding Window
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Company
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All companies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    <SelectItem value="Amazon">Amazon</SelectItem>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Microsoft">Microsoft</SelectItem>
                    <SelectItem value="Apple">Apple</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Bloomberg">Bloomberg</SelectItem>
                    <SelectItem value="Adobe">Adobe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Acceptance Rate
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Rate</SelectItem>
                    <SelectItem value="high">High (&gt; 50%)</SelectItem>
                    <SelectItem value="medium">Medium (30-50%)</SelectItem>
                    <SelectItem value="low">Low (&lt; 30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Problems List */}
      <div className="space-y-2">
        {visibleProblems.map((problem) => {
          const isSolved = userProgress[problem.id]?.solved || false;
          const isBookmarked = userProgress[problem.id]?.bookmarked || false;
          const isLoading = loadingStates[problem.id] || false;
          const isExpanded = expandedCard === problem.id;

          return (
            <ProblemCard
              key={problem.id}
              problem={problem}
              isSolved={isSolved}
              isBookmarked={isBookmarked}
              isLoading={isLoading}
              isExpanded={isExpanded}
              onMarkSolved={handleMarkSolved}
              onToggleBookmark={handleToggleBookmark}
              onAddNote={handleAddNote}
              onClick={handleCardClick}
            />
          );
        })}
      </div>

      {visibleProblems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No problems found matching your criteria.
          </p>
        </div>
      )}

      {/* Note Dialog */}
      <Dialog
        open={!!selectedProblemForNote}
        onOpenChange={() => setSelectedProblemForNote(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add Note for {selectedProblemForNote?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                placeholder="Write your insights, approaches, or learnings..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tags (comma separated)
              </label>
              <Input
                placeholder="e.g., Hash Table, Array, Revisit..."
                value={noteTags}
                onChange={(e) => setNoteTags(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedProblemForNote(null);
                  setNoteContent("");
                  setNoteTags("");
                }}
                disabled={isSavingNote}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveNote}
                disabled={isSavingNote || !noteContent.trim()}
              >
                {isSavingNote ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Explore;
