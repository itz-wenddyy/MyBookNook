import { Star, X, BookMarked } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Book } from "../types/book";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (bookId: string, updates: Partial<Book>) => void;
  onDelete?: (bookId: string) => void;
  onSetCurrentRead?: (bookId: string) => void;
}

export function BookDetailModal({
  book,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onSetCurrentRead,
}: BookDetailModalProps) {
  const [notes, setNotes] = useState(book?.notes || "");
  const [rating, setRating] = useState(book?.rating || 0);
  const [loaned, setLoaned] = useState(book?.loaned || false);
  const [hoveredStar, setHoveredStar] = useState(0);

  if (!book) return null;

  const handleSave = () => {
    onUpdate(book.id, { notes, rating, loaned });
    onClose();
  };

  const handleSetCurrentRead = () => {
    if (onSetCurrentRead) {
      onSetCurrentRead(book.id);
      toast.success(`${book.title} is now your current read!`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book Details</DialogTitle>
          <DialogDescription>
            View and edit your book details, rating, and notes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-[200px_1fr] gap-6">
          <div className="aspect-[2/3] overflow-hidden rounded-lg bg-muted">
            <ImageWithFallback
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h3>{book.title}</h3>
              <p className="text-muted-foreground">{book.author}</p>
              <p className="text-muted-foreground mt-2">Genre: {book.genre}</p>
            </div>

            <div className="space-y-2">
              <Label>Your Rating</Label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      i < (hoveredStar || rating)
                        ? "fill-accent text-accent"
                        : "text-muted-foreground"
                    }`}
                    onMouseEnter={() => setHoveredStar(i + 1)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(i + 1)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes / Review</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your thoughts about this book..."
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="loaned"
                checked={loaned}
                onCheckedChange={setLoaned}
              />
              <Label htmlFor="loaned">Mark as loaned</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
              {onDelete && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(book.id);
                    onClose();
                  }}
                >
                  Delete
                </Button>
              )}
              {onSetCurrentRead && (
                <Button
                  variant="secondary"
                  onClick={handleSetCurrentRead}
                >
                  Set as Current Read
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}