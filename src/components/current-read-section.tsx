import { Book } from "../types/book";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { BookOpen, Check, Edit2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CurrentReadSectionProps {
  book: Book;
  onUpdateBook: (book: Book) => void;
  onMarkFinished: (book: Book) => void;
}

export function CurrentReadSection({
  book,
  onUpdateBook,
  onMarkFinished,
}: CurrentReadSectionProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(book.notes || "");
  const [currentPage, setCurrentPage] = useState(book.currentPage || 0);

  const progress = book.totalPages
    ? Math.round(((book.currentPage || 0) / book.totalPages) * 100)
    : 0;

  const handleSaveNotes = () => {
    onUpdateBook({ ...book, notes });
    setIsEditingNotes(false);
    toast.success("Notes saved!");
  };

  const handleUpdateProgress = () => {
    if (currentPage > (book.totalPages || 0)) {
      toast.error("Current page cannot exceed total pages!");
      return;
    }
    onUpdateBook({ ...book, currentPage });
    toast.success("Progress updated!");
  };

  const handleMarkFinished = () => {
    onMarkFinished(book);
    toast.success("Book marked as finished!");
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4 text-primary">
          <BookOpen className="w-5 h-5" />
          <span className="text-sm uppercase tracking-wider">Currently Reading</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Book Cover */}
          <div className="shrink-0">
            <div className="w-40 h-60 rounded-lg overflow-hidden shadow-lg">
              <ImageWithFallback
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Book Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="mb-1">{book.title}</h2>
              <p className="text-muted-foreground">by {book.author}</p>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Reading Progress</Label>
                <span className="text-sm text-muted-foreground">
                  {book.currentPage || 0} / {book.totalPages || 0} pages
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="text-right">
                <span className="text-sm">{progress}% complete</span>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Notes & Favorite Quotes</Label>
                {!isEditingNotes && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingNotes(true)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {isEditingNotes ? (
                <div className="space-y-2">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your thoughts, favorite quotes, or notes..."
                    rows={4}
                    className="resize-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setNotes(book.notes || "");
                        setIsEditingNotes(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveNotes}>
                      Save Notes
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic min-h-[60px]">
                  {book.notes || "No notes yet. Click edit to add your thoughts..."}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleMarkFinished} className="gap-2">
                <Check className="w-4 h-4" />
                Mark as Finished
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}