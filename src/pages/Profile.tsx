import { Edit, Camera, Mail, Calendar, Trophy, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const Profile = () => {
  const difficultyStats = [
    { label: "Easy", solved: 45, total: 150, color: "bg-success" },
    { label: "Medium", solved: 72, total: 250, color: "bg-warning" },
    { label: "Hard", solved: 25, total: 100, color: "bg-destructive" }
  ]

  const companyFocus = [
    { company: "Google", problems: 35 },
    { company: "Amazon", problems: 42 },
    { company: "Microsoft", problems: 28 },
    { company: "Meta", problems: 22 }
  ]

  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and view your coding journey statistics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="card-gradient border-border">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/avatars/01.png" />
                      <AvatarFallback className="text-lg">DV</AvatarFallback>
                    </Avatar>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <div className="flex space-x-2">
                      <Input defaultValue="developer" />
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>developer@example.com</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Member Since</label>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>January 2024</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Changes</Button>
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
                  <span className="font-semibold">142</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Current Streak</span>
                  <span className="font-semibold">7 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Best Streak</span>
                  <span className="font-semibold">15 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Accuracy</span>
                  <span className="font-semibold">87%</span>
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
                        {item.solved}/{item.total} ({Math.round((item.solved / item.total) * 100)}%)
                      </span>
                    </div>
                    <Progress value={(item.solved / item.total) * 100} className="h-2" />
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
                    <div key={item.company} className="text-center p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-primary">{item.problems}</div>
                      <div className="text-sm text-muted-foreground">{item.company}</div>
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
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm">Solved "Two Sum" (Easy)</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-sm">Added note for "Merge Intervals"</span>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Bookmarked "Valid Parentheses"</span>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile