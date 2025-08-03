import { useState, useMemo } from "react"
import { Search, Filter, ExternalLink, Bookmark, Check, Star, TrendingUp, Users, Clock, BookOpen, Target, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Enhanced problem dataset with more comprehensive information
const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    companies: ["Amazon", "Google", "Microsoft", "Apple"],
    solved: false,
    bookmarked: true,
    frequency: 95,
    acceptance: 49.8,
    estimatedTime: "15 min",
    pattern: "Hash Map",
    url: "https://leetcode.com/problems/two-sum/"
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium", 
    tags: ["Linked List", "Math", "Recursion"],
    companies: ["Amazon", "Microsoft", "Adobe"],
    solved: true,
    bookmarked: false,
    frequency: 87,
    acceptance: 38.2,
    estimatedTime: "25 min",
    pattern: "Linked List",
    url: "https://leetcode.com/problems/add-two-numbers/"
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window", "Hash Table"],
    companies: ["Amazon", "Bloomberg", "Yelp", "Adobe"],
    solved: false,
    bookmarked: true,
    frequency: 92,
    acceptance: 33.8,
    estimatedTime: "30 min",
    pattern: "Sliding Window",
    url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    companies: ["Google", "Amazon", "Microsoft"],
    solved: false,
    bookmarked: false,
    frequency: 78,
    acceptance: 35.2,
    estimatedTime: "45 min",
    pattern: "Binary Search",
    url: "https://leetcode.com/problems/median-of-two-sorted-arrays/"
  },
  {
    id: 5,
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["String", "Stack"],
    companies: ["Amazon", "Google", "Microsoft", "Facebook"],
    solved: true,
    bookmarked: false,
    frequency: 89,
    acceptance: 40.1,
    estimatedTime: "20 min",
    pattern: "Stack",
    url: "https://leetcode.com/problems/valid-parentheses/"
  },
  {
    id: 6,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"],
    companies: ["Amazon", "Google", "Facebook", "Apple"],
    solved: false,
    bookmarked: true,
    frequency: 91,
    acceptance: 53.7,
    estimatedTime: "15 min",
    pattern: "Dynamic Programming",
    url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
  },
  {
    id: 7,
    title: "Binary Tree Inorder Traversal",
    difficulty: "Easy",
    tags: ["Stack", "Tree", "Depth-First Search"],
    companies: ["Microsoft", "Amazon", "Facebook"],
    solved: true,
    bookmarked: false,
    frequency: 82,
    acceptance: 74.4,
    estimatedTime: "20 min",
    pattern: "Tree Traversal",
    url: "https://leetcode.com/problems/binary-tree-inorder-traversal/"
  },
  {
    id: 8,
    title: "Maximum Subarray",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
    companies: ["Amazon", "Microsoft", "Apple", "LinkedIn"],
    solved: false,
    bookmarked: false,
    frequency: 88,
    acceptance: 49.9,
    estimatedTime: "25 min",
    pattern: "Dynamic Programming",
    url: "https://leetcode.com/problems/maximum-subarray/"
  },
  {
    id: 9,
    title: "Climbing Stairs",
    difficulty: "Easy",
    tags: ["Math", "Dynamic Programming", "Memoization"],
    companies: ["Amazon", "Adobe", "Apple"],
    solved: true,
    bookmarked: true,
    frequency: 85,
    acceptance: 51.8,
    estimatedTime: "15 min",
    pattern: "Dynamic Programming",
    url: "https://leetcode.com/problems/climbing-stairs/"
  },
  {
    id: 10,
    title: "Container With Most Water",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Greedy"],
    companies: ["Amazon", "Facebook", "Google", "Apple"],
    solved: false,
    bookmarked: false,
    frequency: 86,
    acceptance: 54.9,
    estimatedTime: "30 min",
    pattern: "Two Pointers",
    url: "https://leetcode.com/problems/container-with-most-water/"
  }
]

const patterns = [
  "Array", "Hash Map", "Linked List", "Stack", "Queue", "Tree Traversal", 
  "Binary Search", "Two Pointers", "Sliding Window", "Dynamic Programming",
  "Backtracking", "Graph", "Greedy", "Divide and Conquer"
]

const allCompanies = ["Amazon", "Google", "Microsoft", "Apple", "Facebook", "Adobe", "Bloomberg", "Yelp", "LinkedIn"]
const allTags = ["Array", "Hash Table", "String", "Linked List", "Math", "Tree", "Stack", "Queue", 
  "Dynamic Programming", "Binary Search", "Two Pointers", "Sliding Window", "Greedy", 
  "Backtracking", "Graph", "Depth-First Search", "Breadth-First Search", "Recursion", 
  "Divide and Conquer", "Memoization"]

const difficultyColors = {
  Easy: "bg-success/10 text-success border border-success/20",
  Medium: "bg-warning/10 text-warning border border-warning/20", 
  Hard: "bg-destructive/10 text-destructive border border-destructive/20"
}

const patternColors = {
  "Array": "bg-blue-500/10 text-blue-600 border border-blue-500/20",
  "Hash Map": "bg-purple-500/10 text-purple-600 border border-purple-500/20",
  "Linked List": "bg-green-500/10 text-green-600 border border-green-500/20",
  "Stack": "bg-orange-500/10 text-orange-600 border border-orange-500/20",
  "Tree Traversal": "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  "Binary Search": "bg-red-500/10 text-red-600 border border-red-500/20",
  "Two Pointers": "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20",
  "Sliding Window": "bg-pink-500/10 text-pink-600 border border-pink-500/20",
  "Dynamic Programming": "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20",
  "default": "bg-muted/50 text-muted-foreground border border-border"
}

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")
  const [patternFilter, setPatternFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("frequency")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const clearAllFilters = () => {
    setSearchTerm("")
    setDifficultyFilter("all")
    setCompanyFilter("all")
    setPatternFilter("all")
    setTagFilter("all")
    setStatusFilter("all")
    setActiveFilters([])
  }

  const removeFilter = (filterType: string) => {
    switch (filterType) {
      case 'difficulty':
        setDifficultyFilter("all")
        break
      case 'company':
        setCompanyFilter("all")
        break
      case 'pattern':
        setPatternFilter("all")
        break
      case 'tag':
        setTagFilter("all")
        break
      case 'status':
        setStatusFilter("all")
        break
    }
    setActiveFilters(prev => prev.filter(f => f !== filterType))
  }

  const filteredProblems = useMemo(() => {
    let filtered = problems.filter(problem => {
      const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           problem.pattern.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter
      const matchesCompany = companyFilter === "all" || problem.companies.includes(companyFilter)
      const matchesPattern = patternFilter === "all" || problem.pattern === patternFilter
      const matchesTag = tagFilter === "all" || problem.tags.includes(tagFilter)
      
      let matchesStatus = true
      if (statusFilter === "solved") matchesStatus = problem.solved
      else if (statusFilter === "unsolved") matchesStatus = !problem.solved
      else if (statusFilter === "bookmarked") matchesStatus = problem.bookmarked
      
      return matchesSearch && matchesDifficulty && matchesCompany && matchesPattern && matchesTag && matchesStatus
    })

    // Sort problems
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "frequency":
          return b.frequency - a.frequency
        case "acceptance":
          return b.acceptance - a.acceptance
        case "difficulty":
          const diffOrder = { "Easy": 1, "Medium": 2, "Hard": 3 }
          return diffOrder[a.difficulty as keyof typeof diffOrder] - diffOrder[b.difficulty as keyof typeof diffOrder]
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, difficultyFilter, companyFilter, patternFilter, tagFilter, statusFilter, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Problem <span className="text-gradient">Explorer</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Master 3500+ curated LeetCode problems with advanced filtering, progress tracking, and company-specific insights.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{problems.length}</div>
              <div className="text-sm text-muted-foreground">Total Problems</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{problems.filter(p => p.solved).length}</div>
              <div className="text-sm text-muted-foreground">Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{problems.filter(p => p.bookmarked).length}</div>
              <div className="text-sm text-muted-foreground">Bookmarked</div>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <Card className="card-elevated border-border shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-xl">
                <Filter className="mr-3 h-6 w-6 text-primary" />
                Advanced Filters
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground hover:text-foreground">
                <X className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
            <CardDescription>
              Fine-tune your problem search with multiple filters and sorting options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search and Sort */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by title, tags, or patterns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 h-11 bg-background border-border"
                />
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frequency">Frequency (High to Low)</SelectItem>
                  <SelectItem value="acceptance">Acceptance Rate</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Filter Tabs */}
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" className="flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Advanced
                </TabsTrigger>
                <TabsTrigger value="status" className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Status
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={companyFilter} onValueChange={setCompanyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      {allCompanies.map(company => (
                        <SelectItem key={company} value={company}>{company}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={patternFilter} onValueChange={setPatternFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Patterns</SelectItem>
                      {patterns.map(pattern => (
                        <SelectItem key={pattern} value={pattern}>{pattern}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={tagFilter} onValueChange={setTagFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tags" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      {allTags.map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="status" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Problems</SelectItem>
                      <SelectItem value="solved">Solved Only</SelectItem>
                      <SelectItem value="unsolved">Unsolved Only</SelectItem>
                      <SelectItem value="bookmarked">Bookmarked Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-lg font-semibold">
              {filteredProblems.length} {filteredProblems.length === 1 ? 'Problem' : 'Problems'} Found
            </p>
            <p className="text-sm text-muted-foreground">
              Sorted by {sortBy.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </p>
          </div>
          
          {/* View Options */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="hover-lift">
              <TrendingUp className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Enhanced Problem Cards */}
        <div className="grid grid-cols-1 gap-6">
          {filteredProblems.map((problem) => (
            <Card key={problem.id} className="card-elevated border-border transition-spring hover:shadow-glow hover-lift group">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      {/* Problem Header */}
                      <div className="flex items-start space-x-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                              {problem.title}
                            </h3>
                            <Badge className={difficultyColors[problem.difficulty as keyof typeof difficultyColors]}>
                              {problem.difficulty}
                            </Badge>
                            {problem.solved && (
                              <Badge className="bg-success/10 text-success border border-success/20">
                                <Check className="mr-1 h-3 w-3" />
                                Solved
                              </Badge>
                            )}
                          </div>
                          
                          {/* Pattern Badge */}
                          <Badge className={patternColors[problem.pattern as keyof typeof patternColors] || patternColors.default}>
                            <Target className="mr-1 h-3 w-3" />
                            {problem.pattern}
                          </Badge>
                        </div>
                        
                        {/* Problem Stats */}
                        <div className="text-right space-y-1 min-w-0">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            {problem.frequency}% frequency
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            ~{problem.estimatedTime}
                          </div>
                          <div className="text-sm font-medium text-success">
                            {problem.acceptance}% accepted
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {problem.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-muted/50 hover:bg-muted transition-colors">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Companies */}
                      <div className="flex flex-wrap gap-2">
                        {problem.companies.map((company) => (
                          <Badge key={company} variant="outline" className="text-xs border-primary/20 text-primary hover:bg-primary/10 transition-colors">
                            <Users className="mr-1 h-3 w-3" />
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col items-end space-y-2 ml-6">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`hover-scale transition-spring ${
                            problem.bookmarked 
                              ? "text-warning hover:text-warning/80" 
                              : "text-muted-foreground hover:text-warning"
                          }`}
                        >
                          {problem.bookmarked ? <Star className="h-4 w-4 fill-current" /> : <Bookmark className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          variant={problem.solved ? "secondary" : "outline"}
                          size="sm"
                          className="hover-scale transition-spring"
                        >
                          {problem.solved ? (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Solved
                            </>
                          ) : (
                            "Mark Solved"
                          )}
                        </Button>
                      </div>

                      <Button asChild size="sm" className="shadow-glow hover-lift">
                        <a href={problem.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open Problem
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProblems.length === 0 && (
          <Card className="card-elevated border-border text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No problems found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your filters or search terms
                  </p>
                </div>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Explore