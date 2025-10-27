import { WishlistBook } from "../types/book";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Plus, X } from "lucide-react";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: WishlistBook[];
  onAddToLibrary: (book: WishlistBook) => void;
  onRemoveFromWishlist: (bookId: string) => void;
}

export function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onAddToLibrary,
  onRemoveFromWishlist,
}: WishlistDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Your Wishlist</SheetTitle>
          <SheetDescription>
            Books you want to read next
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {wishlist.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Your wishlist is empty</p>
              <p className="text-sm mt-2">Add books from Suggestions!</p>
            </div>
          ) : (
            wishlist.map((book) => (
              <Card key={book.id} className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <ImageWithFallback
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="line-clamp-2">{book.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
                    <p className="text-sm text-muted-foreground mt-1">{book.genre}</p>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => onAddToLibrary(book)}
                        className="gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add to Library
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveFromWishlist(book.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
