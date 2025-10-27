import { useState, useMemo } from "react";
import { BookCard } from "./book-card";
import { BookDetailModal } from "./book-detail-modal";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Book } from "../types/book";
import { Search } from "lucide-react";

interface LibraryPageProps {
  books: Book[];
  onUpdateBook: (bookId: string, updates: Partial<Book>) => void;
  onDeleteBook: (bookId: string) => void;
}

export function LibraryPage({ books, onUpdateBook, onDeleteBook }: LibraryPageProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  const genres = useMemo(() => {
    const uniqueGenres = Array.from(new Set(books.map((b) => b.genre)));
    return uniqueGenres.sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = genreFilter === "all" || book.genre === genreFilter;
      const matchesRating =
        ratingFilter === "all" ||
        (book.rating !== undefined &&
          book.rating >= parseInt(ratingFilter));
      return matchesSearch && matchesGenre && matchesRating;
    });
  }, [books, searchQuery, genreFilter, ratingFilter]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search books or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="2">2+ Stars</SelectItem>
              <SelectItem value="1">1+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {books.length === 0 ? (
              <p>Your library is empty. Add your first book to get started!</p>
            ) : (
              <p>No books found matching your filters.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => setSelectedBook(book)}
                showLoanedBadge
              />
            ))}
          </div>
        )}
      </div>

      <BookDetailModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        onUpdate={onUpdateBook}
        onDelete={onDeleteBook}
      />
    </>
  );
}
