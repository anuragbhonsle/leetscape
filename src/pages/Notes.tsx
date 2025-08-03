import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Tag,
  Edit,
  Trash2,
  X,
  Save,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  createUserNote,
  updateUserNote,
  deleteUserNote,
  getAllUserNotes,
  UserNote,
} from "@/lib/firebase";

// Sample problems for the dropdown
const problems = [
  { id: 1, title: "Two Sum", difficulty: "Easy" },
  { id: 2, title: "Add Two Numbers", difficulty: "Medium" },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
  },
  { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard" },
  { id: 5, title: "Valid Parentheses", difficulty: "Easy" },
  { id: 6, title: "Best Time to Buy and Sell Stock", difficulty: "Easy" },
  { id: 7, title: "Binary Tree Inorder Traversal", difficulty: "Easy" },
  { id: 8, title: "Maximum Subarray", difficulty: "Medium" },
  { id: 9, title: "Climbing Stairs", difficulty: "Easy" },
  { id: 10, title: "Container With Most Water", difficulty: "Medium" },
];

const Notes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<UserNote | null>(null);
  const [selectedProblem, setSelectedProblem] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteTags, setNoteTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load user notes
  useEffect(() => {
    const loadNotes = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userNotes = await getAllUserNotes(user.uid);

        // Convert Firestore timestamps to JavaScript Date objects
        const processedNotes = userNotes.map((note) => ({
          ...note,
          createdAt: note.createdAt?.toDate
            ? note.createdAt.toDate()
            : new Date(note.createdAt),
          updatedAt: note.updatedAt?.toDate
            ? note.updatedAt.toDate()
            : new Date(note.updatedAt),
        }));

        setNotes(processedNotes);
      } catch (error) {
        console.error("Error loading notes:", error);
        toast({
          title: "Error",
          description: "Failed to load notes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [user, toast]);

  const filteredNotes = notes.filter(
    (note) =>
      note.problemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleCreateNote = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create notes.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedProblem || !noteContent.trim()) {
      toast({
        title: "Error",
        description: "Please select a problem and add content.",
        variant: "destructive",
      });
      return;
    }

    const problem = problems.find((p) => p.title === selectedProblem);
    if (!problem) return;

    setIsSaving(true);
    try {
      const tags = noteTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await createUserNote(
        user.uid,
        problem.id,
        problem.title,
        noteContent.trim(),
        tags
      );

      // Reload notes
      const userNotes = await getAllUserNotes(user.uid);
      const processedNotes = userNotes.map((note) => ({
        ...note,
        createdAt: note.createdAt?.toDate
          ? note.createdAt.toDate()
          : new Date(note.createdAt),
        updatedAt: note.updatedAt?.toDate
          ? note.updatedAt.toDate()
          : new Date(note.updatedAt),
      }));
      setNotes(processedNotes);

      // Reset form
      setSelectedProblem("");
      setNoteContent("");
      setNoteTags("");
      setIsDialogOpen(false);

      toast({
        title: "Success",
        description: "Note created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateNote = async () => {
    if (!user || !editingNote) return;

    setIsSaving(true);
    try {
      const tags = noteTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await updateUserNote(
        user.uid,
        editingNote.problemId,
        noteContent.trim(),
        tags
      );

      // Reload notes
      const userNotes = await getAllUserNotes(user.uid);
      const processedNotes = userNotes.map((note) => ({
        ...note,
        createdAt: note.createdAt?.toDate
          ? note.createdAt.toDate()
          : new Date(note.createdAt),
        updatedAt: note.updatedAt?.toDate
          ? note.updatedAt.toDate()
          : new Date(note.updatedAt),
      }));
      setNotes(processedNotes);

      // Reset form
      setEditingNote(null);
      setSelectedProblem("");
      setNoteContent("");
      setNoteTags("");
      setIsDialogOpen(false);

      toast({
        title: "Success",
        description: "Note updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (note: UserNote) => {
    if (!user) return;

    try {
      await deleteUserNote(user.uid, note.problemId);

      // Reload notes
      const userNotes = await getAllUserNotes(user.uid);
      const processedNotes = userNotes.map((note) => ({
        ...note,
        createdAt: note.createdAt?.toDate
          ? note.createdAt.toDate()
          : new Date(note.createdAt),
        updatedAt: note.updatedAt?.toDate
          ? note.updatedAt.toDate()
          : new Date(note.updatedAt),
      }));
      setNotes(processedNotes);

      toast({
        title: "Success",
        description: "Note deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditNote = (note: UserNote) => {
    setEditingNote(note);
    setSelectedProblem(note.problemTitle);
    setNoteContent(note.content);
    setNoteTags(note.tags.join(", "));
    setIsDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setSelectedProblem("");
    setNoteContent("");
    setNoteTags("");
    setIsDialogOpen(false);
  };

  const formatDate = (date: Date) => {
    try {
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) return "just now";
      if (diffMinutes < 60)
        return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
      if (diffHours < 24)
        return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
      if (diffDays === 1) return "yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30)
        return `${Math.floor(diffDays / 7)} week${
          Math.floor(diffDays / 7) === 1 ? "" : "s"
        } ago`;
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "recently";
    }
  };

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">My Notes</h1>
          <p className="text-muted-foreground">
            Please sign in to view and manage your notes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">My Notes</h1>
            <p className="text-muted-foreground">
              Keep track of insights, patterns, and learnings from your
              problem-solving journey.
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingNote ? "Edit Note" : "Add New Note"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Problem</label>
                  <Select
                    value={selectedProblem}
                    onValueChange={setSelectedProblem}
                    disabled={!!editingNote}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a problem..." />
                    </SelectTrigger>
                    <SelectContent>
                      {problems.map((problem) => (
                        <SelectItem key={problem.id} value={problem.title}>
                          {problem.title} ({problem.difficulty})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    placeholder="Write your insights, approaches, or learnings..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={8}
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
                    onClick={
                      editingNote
                        ? handleCancelEdit
                        : () => setIsDialogOpen(false)
                    }
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={editingNote ? handleUpdateNote : handleCreateNote}
                    disabled={
                      isSaving || !selectedProblem || !noteContent.trim()
                    }
                  >
                    {isSaving ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Save className="mr-2 h-4 w-4" />
                        {editingNote ? "Update Note" : "Save Note"}
                      </div>
                    )}
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

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? "No notes found" : "No notes yet"}
                </h3>
                <p className="text-sm">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Start adding notes to track your problem-solving insights!"}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredNotes.map((note) => (
                <Card
                  key={note.noteId}
                  className="card-gradient border-border transition-spring hover:shadow-elegant"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">
                          {note.problemTitle}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            <Calendar className="inline mr-1 h-3 w-3" />
                            Updated {formatDate(note.updatedAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditNote(note)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteNote(note)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
                      {note.content}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          <Tag className="mr-1 h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
