import { useState, useMemo } from "react";
import { Book, WishlistBook } from "../types/book";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Plus, BookOpen, Heart, Sparkles, Filter, Grid3x3, List, ArrowUpDown } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { TBRBookDetail } from "./tbr-book-detail";
import { AddTBRBookDialog } from "./add-tbr-book-dialog";
import { motion } from "motion/react";

export type TBRBook = {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string;
  type: "owned" | "wishlisted";
  // For owned books
  rating?: number;
  notes?: string;
  currentPage?: number;
  totalPages?: number;
  status?: "owned" | "reading" | "finished";
  // For wishlist books
  buyLink?: string;
};

interface TBRSectionProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  wishlist: WishlistBook[];
  onAddToLibrary: (book: WishlistBook) => void;
  onRemoveFromWishlist: (bookId: string) => void;
  onUpdateBook: (book: Book) => void;
  onSetCurrentRead: (bookId: string) => void;
  onAddWishlistBook: (book: Omit<WishlistBook, "id">) => void;
}

export function TBRSection({
  isOpen,
  onClose,
  books,
  wishlist,
  onAddToLibrary,
  onRemoveFromWishlist,
  onUpdateBook,
  onSetCurrentRead,
  onAddWishlistBook,
}: TBRSectionProps) {
  const [sortBy, setSortBy] = useState<"title" | "author" | "status">("title");
  const [filterBy, setFilterBy] = useState<"all" | "owned" | "wishlisted">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedBook, setSelectedBook] = useState<TBRBook | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [randomPick, setRandomPick] = useState<TBRBook | null>(null);

  // Combine books and wishlist into unified TBR list
  const tbrBooks = useMemo(() => {
    const unreadOwnedBooks: TBRBook[] = books
      .filter((book) => book.status !== "finished" && !book.isCurrentRead)
      .map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        cover: book.cover,
        genre: book.genre,
        type: "owned" as const,
        rating: book.rating,
        notes: book.notes,
        currentPage: book.currentPage,
        totalPages: book.totalPages,
        status: book.status,
      }));

    const wishlistBooks: TBRBook[] = wishlist.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover,
      genre: book.genre,
      type: "wishlisted" as const,
      buyLink: book.buyLink,
    }));

    return [...unreadOwnedBooks, ...wishlistBooks];
  }, [books, wishlist]);

  // Apply filters and sorting
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...tbrBooks];

    // Filter
    if (filterBy !== "all") {
      result = result.filter((book) => book.type === filterBy);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "status":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return result;
  }, [tbrBooks, filterBy, sortBy]);

  const handleRandomPick = () => {
    if (filteredAndSortedBooks.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredAndSortedBooks.length);
    const picked = filteredAndSortedBooks[randomIndex];
    setRandomPick(picked);
    setTimeout(() => setRandomPick(null), 3000);
  };

  const handleAddBook = (book: Omit<WishlistBook, "id">, type: "owned" | "wishlisted") => {
    if (type === "wishlisted") {
      onAddWishlistBook(book);
    }
    // For owned books, we'd need to add them through the main add book flow
    setIsAddDialogOpen(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent 
          side="right" 
          className="w-full sm:max-w-4xl overflow-y-auto"
          style={{ backgroundColor: "#F7F4EF" }}
        >
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  To Be Read
                </SheetTitle>
                <SheetDescription className="mt-2">
                  Your upcoming reads — owned and wishlisted together in one cozy place.
                </SheetDescription>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Add Book
              </Button>
            </div>
          </SheetHeader>

          {/* Toolbar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterBy} onValueChange={(v: any) => setFilterBy(v)}>
                <SelectTrigger className="w-[160px] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Show All</SelectItem>
                  <SelectItem value="owned">Owned Only</SelectItem>
                  <SelectItem value="wishlisted">Wishlisted Only</SelectItem>
                </SelectContent>
              </Select>

              <ArrowUpDown className="w-4 h-4 text-muted-foreground ml-2" />
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">By Title</SelectItem>
                  <SelectItem value="author">By Author</SelectItem>
                  <SelectItem value="status">By Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="w-9 h-9 p-0"
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="w-9 h-9 p-0"
              >
                <List className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRandomPick}
                className="gap-2 ml-2 bg-white hover:bg-accent/10"
              >
                <Sparkles className="w-4 h-4" />
                Random Pick
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-4 text-sm">
            <div className="text-muted-foreground">
              Total: <span className="text-foreground">{tbrBooks.length}</span>
            </div>
            <div className="text-muted-foreground">
              Owned: <span className="text-foreground">{tbrBooks.filter(b => b.type === "owned").length}</span>
            </div>
            <div className="text-muted-foreground">
              Wishlisted: <span className="text-foreground">{tbrBooks.filter(b => b.type === "wishlisted").length}</span>
            </div>
          </div>

          {/* Book Grid/List */}
          <div className="mt-6">
            {filteredAndSortedBooks.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No books in your TBR list yet</p>
                <p className="text-sm mt-2">Add books to start building your reading queue!</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAndSortedBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: 1, 
                      scale: randomPick?.id === book.id ? 1.05 : 1,
                      rotate: randomPick?.id === book.id ? [0, -2, 2, -2, 0] : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`${randomPick?.id === book.id ? "ring-4 ring-primary shadow-2xl" : ""}`}
                  >
                    <Card
                      className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                      onClick={() => setSelectedBook(book)}
                    >
                      <div className="aspect-[2/3] bg-muted relative overflow-hidden">
                        <ImageWithFallback
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant={book.type === "owned" ? "default" : "secondary"}
                            className={
                              book.type === "owned"
                                ? "bg-primary text-primary-foreground"
                                : "bg-[#c9b8a0] text-foreground"
                            }
                          >
                            {book.type === "owned" ? "📚 Owned" : "🎁 Wish"}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="line-clamp-2 text-sm mb-1">{book.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {book.author}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAndSortedBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className="p-4 cursor-pointer hover:shadow-lg transition-all bg-white"
                      onClick={() => setSelectedBook(book)}
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                          <ImageWithFallback
                            src={book.cover}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="line-clamp-1">{book.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {book.author}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {book.genre}
                              </p>
                            </div>
                            <Badge
                              variant={book.type === "owned" ? "default" : "secondary"}
                              className={
                                book.type === "owned"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-[#c9b8a0] text-foreground"
                              }
                            >
                              {book.type === "owned" ? "📚 Owned" : "🎁 Wish"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground italic">
            "All your next reads, right where they belong."
          </div>
        </SheetContent>
      </Sheet>

      {/* Book Detail Modal */}
      {selectedBook && (
        <TBRBookDetail
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          onAddToLibrary={
            selectedBook.type === "wishlisted"
              ? () => {
                  const wishlistBook = wishlist.find((b) => b.id === selectedBook.id);
                  if (wishlistBook) {
                    onAddToLibrary(wishlistBook);
                    setSelectedBook(null);
                  }
                }
              : undefined
          }
          onRemoveFromWishlist={
            selectedBook.type === "wishlisted"
              ? () => {
                  onRemoveFromWishlist(selectedBook.id);
                  setSelectedBook(null);
                }
              : undefined
          }
          onSetCurrentRead={
            selectedBook.type === "owned"
              ? () => {
                  onSetCurrentRead(selectedBook.id);
                  setSelectedBook(null);
                }
              : undefined
          }
          onMarkFinished={
            selectedBook.type === "owned"
              ? () => {
                  const book = books.find((b) => b.id === selectedBook.id);
                  if (book) {
                    onUpdateBook({
                      ...book,
                      status: "finished",
                      currentPage: book.totalPages || book.currentPage,
                    });
                    setSelectedBook(null);
                  }
                }
              : undefined
          }
        />
      )}

      {/* Add Book Dialog */}
      <AddTBRBookDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddBook}
      />
    </>
  );
}
