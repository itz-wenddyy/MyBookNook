import { TBRBook } from "./tbr-section";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Plus, Check, X, BookOpen, Sparkles } from "lucide-react";
import { Separator } from "./ui/separator";

interface TBRBookDetailProps {
  book: TBRBook;
  isOpen: boolean;
  onClose: () => void;
  onAddToLibrary?: () => void;
  onRemoveFromWishlist?: () => void;
  onSetCurrentRead?: () => void;
  onMarkFinished?: () => void;
}

export function TBRBookDetail({
  book,
  isOpen,
  onClose,
  onAddToLibrary,
  onRemoveFromWishlist,
  onSetCurrentRead,
  onMarkFinished,
}: TBRBookDetailProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Book Details
          </DialogTitle>
          <DialogDescription>
            {book.type === "owned" ? "In your library" : "On your wishlist"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          {/* Book Cover */}
          <div className="w-48 flex-shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-xl bg-muted">
              <ImageWithFallback
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-3 flex justify-center">
              <Badge
                variant={book.type === "owned" ? "default" : "secondary"}
                className={
                  book.type === "owned"
                    ? "bg-primary text-primary-foreground"
                    : "bg-[#c9b8a0] text-foreground"
                }
              >
                {book.type === "owned" ? "📚 Owned" : "🎁 Wishlisted"}
              </Badge>
            </div>
          </div>

          {/* Book Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2>{book.title}</h2>
              <p className="text-muted-foreground mt-1">by {book.author}</p>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Genre</span>
                <span className="text-foreground">{book.genre}</span>
              </div>

              {book.totalPages && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Pages</span>
                  <span className="text-foreground">{book.totalPages}</span>
                </div>
              )}

              {book.currentPage !== undefined && book.currentPage > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Page</span>
                  <span className="text-foreground">{book.currentPage}</span>
                </div>
              )}

              {book.rating && book.rating > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="text-foreground">{"⭐".repeat(book.rating)}</span>
                </div>
              )}
            </div>

            {book.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Notes</p>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">{book.notes}</p>
                </div>
              </>
            )}

            {book.buyLink && (
              <>
                <Separator />
                <div>
                  <a
                    href={book.buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-4 h-4" />
                    View purchase link
                  </a>
                </div>
              </>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {book.type === "wishlisted" && onAddToLibrary && (
                <Button onClick={onAddToLibrary} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Move to Library
                </Button>
              )}

              {book.type === "owned" && onSetCurrentRead && (
                <Button onClick={onSetCurrentRead} className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Start Reading
                </Button>
              )}

              {book.type === "owned" && onMarkFinished && (
                <Button onClick={onMarkFinished} variant="outline" className="gap-2">
                  <Check className="w-4 h-4" />
                  Mark as Finished
                </Button>
              )}

              {book.type === "wishlisted" && onRemoveFromWishlist && (
                <Button
                  onClick={onRemoveFromWishlist}
                  variant="destructive"
                  className="gap-2 ml-auto"
                >
                  <X className="w-4 h-4" />
                  Remove from Wishlist
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
