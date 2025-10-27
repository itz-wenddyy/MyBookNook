import { Book, ReadingEntry, UserProfile, Friend, FriendActivity, Challenge, ReadingGoal } from "../types/book";
import { BookCard } from "./book-card";
import { Button } from "./ui/button";
import { Plus, Quote, Heart, Flame, BookPlus, Sparkles } from "lucide-react";
import { Card } from "./ui/card";
import { CurrentReadSection } from "./current-read-section";
import { ReadingProgressChart } from "./reading-progress-chart";
import { CozyCorner } from "./cozy-corner";
import { FriendsCommunity } from "./friends-community";
import { ChallengesMiniSummary } from "./challenges-mini-summary";
import { ProgressGoalsMiniSummary } from "./progress-goals-mini-summary";
import { useState } from "react";
import { QuickReadingDialog } from "./quick-reading-dialog";
import { motion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface HomePageProps {
  books: Book[];
  readingEntries: ReadingEntry[];
  userProfile: UserProfile;
  friends: Friend[];
  friendActivities: FriendActivity[];
  challenges: Challenge[];
  readingGoals: ReadingGoal[];
  onOpenAddBook: () => void;
  onOpenWishlist: () => void;
  onBookClick: (book: Book) => void;
  onUpdateBook: (book: Book) => void;
  onAddPages: (pages: number) => void;
  onAddFriend?: (friendName: string) => void;
  onChallengeClick?: (challenge: Challenge) => void;
  onNavigateToProfile?: () => void;
  onNavigateToSuggestions?: () => void;
}

export function HomePage({
  books,
  readingEntries,
  userProfile,
  friends,
  friendActivities,
  challenges,
  readingGoals,
  onOpenAddBook,
  onOpenWishlist,
  onBookClick,
  onUpdateBook,
  onAddPages,
  onAddFriend,
  onChallengeClick,
  onNavigateToProfile,
  onNavigateToSuggestions,
}: HomePageProps) {
  const [isQuickReadingOpen, setIsQuickReadingOpen] = useState(false);
  const [isCozyMode, setIsCozyMode] = useState(false);

  const currentRead = books.find((book) => book.isCurrentRead);
  const recentBooks = books
    .filter((book) => book.dateAdded)
    .sort((a, b) => {
      if (!a.dateAdded || !b.dateAdded) return 0;
      return b.dateAdded.getTime() - a.dateAdded.getTime();
    })
    .slice(0, 6);

  const handleMarkFinished = (book: Book) => {
    const updatedBook = {
      ...book,
      status: "finished" as const,
      isCurrentRead: false,
      currentPage: book.totalPages || book.currentPage,
    };
    onUpdateBook(updatedBook);
  };

  return (
    <div className="space-y-6">
      {/* Current Read Section */}
      {currentRead && (
        <div className="space-y-3">
          <CurrentReadSection
            book={currentRead}
            onUpdateBook={onUpdateBook}
            onMarkFinished={handleMarkFinished}
          />
          {/* Quick Reading Button */}
          <Button
            onClick={() => setIsQuickReadingOpen(true)}
            className="w-full gap-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all animate-pulse hover:animate-none"
            size="lg"
          >
            <BookPlus className="w-5 h-5" />
            + Pages Today
          </Button>
        </div>
      )}

      {/* Wishlist Shortcut */}
      <Card
        className="bg-gradient-to-br from-accent/20 to-secondary/10 border-accent/30 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onOpenWishlist}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-accent" />
            <div>
              <h3>To Be Read</h3>
              <p className="text-sm text-muted-foreground">Your upcoming reads — owned & wishlisted</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            View
          </Button>
        </div>
      </Card>

      {/* Discover Suggestions Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card
          className="border-0 cursor-pointer overflow-hidden relative group"
          style={{
            background: "linear-gradient(135deg, #89AFCB 0%, #5B8DB8 100%)",
            boxShadow: "0 4px 12px rgba(137, 175, 203, 0.3)",
          }}
          onClick={onNavigateToSuggestions}
        >
          {/* Animated sparkle effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)",
            }}
          />
          
          <div className="p-5 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatDelay: 1 
                }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-white">Discover Your Next Read</h3>
                <p className="text-sm text-white/80">
                  Personalized suggestions based on your library
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20 border border-white/30"
            >
              Explore
            </Button>
          </div>
        </Card>
      </motion.div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2>Recently Added</h2>
          <Button variant="ghost" size="sm" onClick={onOpenAddBook}>
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </div>

        {recentBooks.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No books in your library yet</p>
            <Button onClick={onOpenAddBook}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Book
            </Button>
          </Card>
        ) : (
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {recentBooks.map((book) => (
                <CarouselItem key={book.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <BookCard book={book} onClick={() => onBookClick(book)} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}
      </div>

      {/* Friends Community Section */}
      <FriendsCommunity
        friends={friends}
        recentActivities={friendActivities}
        onAddFriend={onAddFriend}
      />

      {/* Mini Summaries Section - Grid Layout */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Challenges Mini Summary */}
        <ChallengesMiniSummary
          challenges={challenges}
          onViewDetails={onNavigateToProfile}
        />

        {/* Progress Goals Mini Summary */}
        <ProgressGoalsMiniSummary
          goals={readingGoals}
          currentStreak={userProfile.readingStreak}
          onViewDetails={onNavigateToProfile}
        />
      </div>

      {/* Cozy Corner Section */}
      <CozyCorner 
        isCozyMode={isCozyMode}
        onCozyModeToggle={setIsCozyMode}
      />

      {/* Quick Reading Dialog */}
      <QuickReadingDialog
        isOpen={isQuickReadingOpen}
        onClose={() => setIsQuickReadingOpen(false)}
        onAddPages={onAddPages}
        currentBookTitle={currentRead?.title}
        currentPage={currentRead?.currentPage || 0}
      />
    </div>
  );
}