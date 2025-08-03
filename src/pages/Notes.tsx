import { useState } from "react"
import { Search, Plus, Tag, Edit, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const notes = [
  {
    id: 1,
    problemTitle: "Two Sum",
    content: "Use hash map to store complements. Time: O(n), Space: O(n). Key insight: one pass solution.",
    tags: ["Hash Table", "Array"],
    difficulty: "Easy",
    lastModified: "2 days ago"
  },
  {
    id: 2,
    problemTitle: "Longest Substring Without Repeating Characters",
    content: "Sliding window approach. Use set to track characters. Move left pointer when duplicate found. Remember to update max length.",
    tags: ["Sliding Window", "Revisit"],
    difficulty: "Medium",
    lastModified: "1 week ago"
  },
  {
    id: 3,
    problemTitle: "Merge Intervals",
    content: "Sort by start time first. Key is to check if current interval overlaps with previous. Got TLE on first attempt - forgot to sort!",
    tags: ["Sorting", "Got TLE"],
    difficulty: "Medium",
    lastModified: "3 days ago"
  }
]

const Notes = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredNotes = notes.filter(note => 
    note.problemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">My Notes</h1>
            <p className="text-muted-foreground">
              Keep track of insights, patterns, and learnings from your problem-solving journey.
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Problem title..." />
                <Textarea placeholder="Write your insights, approaches, or learnings..." rows={6} />
                <Input placeholder="Tags (comma separated)..." />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>
                    Save Note
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="card-gradient border-border">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes by problem, content, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes List */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {filteredNotes.length} notes found
          </p>

          <div className="grid grid-cols-1 gap-4">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="card-gradient border-border transition-spring hover:shadow-elegant">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{note.problemTitle}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{note.difficulty}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Updated {note.lastModified}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4">{note.content}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notes