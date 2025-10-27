import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Book, ReadingEntry } from "../types/book";
import { BookOpen, Plus } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ReadingTrackerProps {
  books: Book[];
  onAddEntry: (entry: Omit<ReadingEntry, "id">) => void;
}

export function ReadingTracker({ books, onAddEntry }: ReadingTrackerProps) {
  const [pagesRead, setPagesRead] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pages = parseInt(pagesRead);
    
    if (isNaN(pages) || pages <= 0) {
      toast.error("Please enter a valid number of pages");
      return;
    }

    const selectedBook = books.find((b) => b.id === selectedBookId);
    
    onAddEntry({
      date: new Date(),
      pagesRead: pages,
      bookId: selectedBookId && selectedBookId !== "none" ? selectedBookId : undefined,
      bookTitle: selectedBook?.title,
    });

    setPagesRead("");
    setSelectedBookId("");
    setIsExpanded(false);
    toast.success(`Logged ${pages} pages read today!`);
  };

  if (!isExpanded) {
    return (
      <Card className="p-6">
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          className="w-full gap-2"
        >
          <Plus className="w-5 h-5" />
          Log Pages Read Today
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-6 h-6 text-primary" />
        <h3>Log Today's Reading</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pages">Pages Read</Label>
          <Input
            id="pages"
            type="number"
            min="1"
            value={pagesRead}
            onChange={(e) => setPagesRead(e.target.value)}
            placeholder="e.g. 25"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="book">Book (optional)</Label>
          <Select value={selectedBookId} onValueChange={setSelectedBookId}>
            <SelectTrigger id="book">
              <SelectValue placeholder="Select a book" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">General reading</SelectItem>
              {books.map((book) => (
                <SelectItem key={book.id} value={book.id}>
                  {book.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsExpanded(false);
              setPagesRead("");
              setSelectedBookId("");
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Log Reading
          </Button>
        </div>
      </form>
    </Card>
  );
}