import { TrendingUp, Calendar, Target, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const Tracker = () => {
  const topicProgress = [
    { topic: "Array", solved: 25, total: 50, percentage: 50 },
    { topic: "String", solved: 18, total: 30, percentage: 60 },
    { topic: "Dynamic Programming", solved: 12, total: 40, percentage: 30 },
    { topic: "Tree", solved: 20, total: 35, percentage: 57 },
    { topic: "Graph", solved: 8, total: 25, percentage: 32 },
    { topic: "Binary Search", solved: 15, total: 20, percentage: 75 }
  ]

  const companyProgress = [
    { company: "Google", solved: 35, total: 100 },
    { company: "Amazon", solved: 42, total: 120 },
    { company: "Microsoft", solved: 28, total: 80 },
    { company: "Facebook", solved: 22, total: 90 }
  ]

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
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">
                +12 from last week
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
              <div className="text-2xl font-bold">7 days</div>
              <p className="text-xs text-muted-foreground">
                Personal best: 15 days
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
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Goal: 15 problems
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Accuracy
              </CardTitle>
              <Award className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                First attempt success
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
      </div>
    </div>
  )
}

export default Tracker