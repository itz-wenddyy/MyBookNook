import { Book, WishlistBook } from "../types/book";
import { BookCard } from "./book-card";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, Lightbulb, RefreshCw, TrendingUp, Users, Sparkles, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchBookCover } from "../services/book-cover-service";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "./ui/badge";

interface SuggestionWithReason extends Omit<Book, "id" | "rating" | "notes" | "loaned" | "dateAdded"> {
  id: string;
  reason: string;
  trending?: boolean;
  friendFavorite?: boolean;
}

interface SuggestionsPageProps {
  books: Book[];
  onAddToWishlist: (book: Omit<WishlistBook, "id">) => void;
}

export function SuggestionsPage({ books, onAddToWishlist }: SuggestionsPageProps) {
  const [suggestionsWithCovers, setSuggestionsWithCovers] = useState<SuggestionWithReason[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "trending" | "friends">("all");

  // Generate suggestions based on user's library
  const generateSuggestions = (): SuggestionWithReason[] => {
    const genreCounts = books.reduce((acc, book) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    const suggestions: SuggestionWithReason[] = [
      {
        id: "sug-1",
        title: "The Midnight Library",
        author: "Matt Haig",
        cover: "",
        genre: "Fiction",
        reason: "Perfect for thoughtful readers",
        trending: true,
      },
      {
        id: "sug-2",
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        cover: "",
        genre: "Romance",
        reason: "Loved by readers like you",
        friendFavorite: true,
      },
      {
        id: "sug-3",
        title: "Project Hail Mary",
        author: "Andy Weir",
        cover: "",
        genre: "Science Fiction",
        reason: "Recommended for adventure seekers",
        trending: true,
      },
      {
        id: "sug-4",
        title: "The Silent Patient",
        author: "Alex Michaelides",
        cover: "",
        genre: "Mystery",
        reason: "Gripping psychological thriller",
        trending: true,
      },
      {
        id: "sug-5",
        title: "Educated",
        author: "Tara Westover",
        cover: "",
        genre: "Biography",
        reason: "Inspiring true story",
        friendFavorite: true,
      },
      {
        id: "sug-6",
        title: "Where the Crawdads Sing",
        author: "Delia Owens",
        cover: "",
        genre: "Fiction",
        reason: "Perfect for nature lovers",
        friendFavorite: true,
      },
      {
        id: "sug-7",
        title: "Circe",
        author: "Madeline Miller",
        cover: "",
        genre: "Fantasy",
        reason: "Beautiful mythology retelling",
        trending: true,
      },
      {
        id: "sug-8",
        title: "The Thursday Murder Club",
        author: "Richard Osman",
        cover: "",
        genre: "Mystery",
        reason: "Charming cozy mystery",
      },
      {
        id: "sug-9",
        title: "Atomic Habits",
        author: "James Clear",
        cover: "",
        genre: "Self-Help",
        reason: "Transform your reading habits",
      },
      {
        id: "sug-10",
        title: "The Invisible Life of Addie LaRue",
        author: "V.E. Schwab",
        cover: "",
        genre: "Fantasy",
        reason: "Enchanting and unforgettable",
        trending: true,
      },
      {
        id: "sug-11",
        title: "Lessons in Chemistry",
        author: "Bonnie Garmus",
        cover: "",
        genre: "Fiction",
        reason: "Smart and witty",
        friendFavorite: true,
      },
      {
        id: "sug-12",
        title: "The Song of Achilles",
        author: "Madeline Miller",
        cover: "",
        genre: "Fantasy",
        reason: "Epic love story",
        trending: true,
      },
    ];

    return suggestions;
  };

  useEffect(() => {
    const loadBookCovers = async () => {
      setIsLoading(true);
      const suggestions = generateSuggestions();
      
      const suggestionsWithRealCovers = await Promise.all(
        suggestions.map(async (suggestion) => {
          const coverData = await fetchBookCover(suggestion.title, suggestion.author);
          return {
            ...suggestion,
            cover: coverData?.cover || "https://images.unsplash.com/photo-1661936901394-a993c79303c7?w=400",
          };
        })
      );
      
      setSuggestionsWithCovers(suggestionsWithRealCovers);
      setIsLoading(false);
    };

    loadBookCovers();
  }, [books]);

  const handleRefresh = async () => {
    setIsLoading(true);
    const suggestions = generateSuggestions();
    
    const suggestionsWithRealCovers = await Promise.all(
      suggestions.map(async (suggestion) => {
        const coverData = await fetchBookCover(suggestion.title, suggestion.author);
        return {
          ...suggestion,
          cover: coverData?.cover || "https://images.unsplash.com/photo-1661936901394-a993c79303c7?w=400",
        };
      })
    );
    
    setSuggestionsWithCovers(suggestionsWithRealCovers);
    setIsLoading(false);
  };

  // Get unique genres
  const genres = ["all", ...Array.from(new Set(suggestionsWithCovers.map(s => s.genre)))];

  // Filter suggestions
  const filteredSuggestions = suggestionsWithCovers.filter(suggestion => {
    const genreMatch = selectedGenre === "all" || suggestion.genre === selectedGenre;
    const filterMatch = 
      selectedFilter === "all" || 
      (selectedFilter === "trending" && suggestion.trending) ||
      (selectedFilter === "friends" && suggestion.friendFavorite);
    
    return genreMatch && filterMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card 
          className="p-6 border-0"
          style={{ 
            background: "linear-gradient(135deg, rgba(137, 175, 203, 0.12) 0%, rgba(232, 220, 199, 0.08) 100%)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#89AFCB" }}
              >
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="flex items-center gap-2" style={{ color: "#4F6D7A" }}>
                  Discover Your Next Read
                </h1>
                <p className="text-sm mt-1" style={{ color: "#6F7A84" }}>
                  Based on your library of <span style={{ color: "#89AFCB" }}>{books.length} books</span>, we've curated these suggestions just for you.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-2 flex-shrink-0 border-0"
              style={{ 
                backgroundColor: "rgba(137, 175, 203, 0.15)",
                color: "#5B8DB8"
              }}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Category Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4" style={{ color: "#89AFCB" }} />
          <div className="flex items-center gap-2 flex-wrap">
            {["all", "trending", "friends"].map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(filter as typeof selectedFilter)}
                className="px-4 py-2 rounded-full text-xs transition-all duration-300"
                style={{
                  backgroundColor: selectedFilter === filter ? "#89AFCB" : "rgba(137, 175, 203, 0.1)",
                  color: selectedFilter === filter ? "#FFFFFF" : "#5B8DB8",
                  border: selectedFilter === filter ? "none" : "1px solid rgba(137, 175, 203, 0.2)",
                }}
              >
                {filter === "trending" && <TrendingUp className="w-3 h-3 inline mr-1.5" />}
                {filter === "friends" && <Users className="w-3 h-3 inline mr-1.5" />}
                {filter === "all" && <Sparkles className="w-3 h-3 inline mr-1.5" />}
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                {filter === "trending" && " Books"}
                {filter === "friends" && " Favorites"}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Genre Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs" style={{ color: "#6F7A84" }}>Genre:</span>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs border-0 transition-all"
            style={{
              backgroundColor: "rgba(137, 175, 203, 0.1)",
              color: "#5B8DB8",
              outline: "none",
            }}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "#6F7A84" }}>
          Showing <span style={{ color: "#89AFCB" }}>{filteredSuggestions.length}</span> recommendations
        </p>
      </div>

      {/* Suggestions Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-8 h-8 mx-auto mb-2" style={{ color: "#89AFCB" }} />
          </motion.div>
          <p className="text-sm" style={{ color: "#6F7A84" }}>
            Loading personalized suggestions...
          </p>
        </div>
      ) : filteredSuggestions.length === 0 ? (
        <Card className="p-12 text-center border-0" style={{ backgroundColor: "rgba(247, 244, 239, 0.5)" }}>
          <p className="text-sm" style={{ color: "#8B7E6A" }}>
            No suggestions match your current filters. Try adjusting your selection!
          </p>
        </Card>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
            layout
          >
            {filteredSuggestions.map((book, index) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-3"
              >
                <div className="relative">
                  {/* Badges */}
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    {book.trending && (
                      <Badge 
                        className="text-xs px-2 py-0.5 border-0 shadow-md"
                        style={{ 
                          backgroundColor: "#F97316",
                          color: "#FFFFFF"
                        }}
                      >
                        <TrendingUp className="w-3 h-3 inline mr-1" />
                        Trending
                      </Badge>
                    )}
                    {book.friendFavorite && (
                      <Badge 
                        className="text-xs px-2 py-0.5 border-0 shadow-md"
                        style={{ 
                          backgroundColor: "#89AFCB",
                          color: "#FFFFFF"
                        }}
                      >
                        <Users className="w-3 h-3 inline mr-1" />
                        Friends
                      </Badge>
                    )}
                  </div>

                  <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring" }}>
                    <BookCard
                      book={{
                        ...book,
                        rating: undefined,
                      }}
                      onClick={() => {}}
                    />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <p 
                    className="text-xs italic min-h-[2.5rem] flex items-center"
                    style={{ color: "#8B7E6A" }}
                  >
                    {book.reason}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-2 border-0 transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: "rgba(137, 175, 203, 0.1)",
                      color: "#5B8DB8",
                    }}
                    onClick={() =>
                      onAddToWishlist({
                        title: book.title,
                        author: book.author,
                        cover: book.cover,
                        genre: book.genre,
                      })
                    }
                  >
                    <Heart className="w-4 h-4" />
                    Add to TBR
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
