import { useState, useEffect, useMemo } from "react";
import { Button } from "./components/ui/button";
import { Plus, BookOpen, Sparkles, User } from "lucide-react";
import { HomePage } from "./components/home-page";
import { LibraryPage } from "./components/library-page";
import { TBRSection } from "./components/tbr-section";
import { SuggestionsPage } from "./components/suggestions-page";
import { ProfilePage } from "./components/profile-page";
import { SocialPage } from "./components/social-page";
import { AddBookModal } from "./components/add-book-modal";
import { BookDetailModal } from "./components/book-detail-modal";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { ReadingStreakBar } from "./components/reading-streak-bar";
import { BadgeNotification } from "./components/badge-notification";
import { Book, WishlistBook, ReadingEntry, UserProfile, Badge, Friend, FriendActivity, Challenge, ReadingGoal } from "./types/book";
import { Toaster, toast } from "sonner@2.0.3";
import { fetchBookCover } from "./services/book-cover-service";
import { calculateBadges, getNewlyEarnedBadges } from "./services/badge-service";
import { Quote } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [books, setBooks] = useState<Book[]>([]);
  const [wishlist, setWishlist] = useState<WishlistBook[]>([]);
  const [readingEntries, setReadingEntries] = useState<ReadingEntry[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendActivities, setFriendActivities] = useState<FriendActivity[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [readingGoals, setReadingGoals] = useState<ReadingGoal[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Book Reader",
    dailyGoal: 50,
    readingStreak: 0,
    lastReadDate: undefined,
    monthlyGoal: 5,
    yearlyGoal: 50,
  });
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [newBadgeNotification, setNewBadgeNotification] = useState<Badge | null>(null);

  // Initialize with sample data
  useEffect(() => {
    const initializeData = async () => {
      const sampleBooks: Book[] = [
        {
          id: "1",
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          cover: "",
          genre: "Fiction",
          rating: 5,
          notes: "A timeless classic about the American Dream",
          loaned: false,
          dateAdded: new Date("2024-10-01"),
          status: "finished",
          totalPages: 180,
          currentPage: 180,
        },
        {
          id: "2",
          title: "The Name of the Wind",
          author: "Patrick Rothfuss",
          cover: "",
          genre: "Fantasy",
          rating: 5,
          notes: "Captivating storytelling and worldbuilding",
          loaned: false,
          dateAdded: new Date("2024-10-15"),
          status: "finished",
          totalPages: 662,
          currentPage: 662,
        },
        {
          id: "3",
          title: "The Da Vinci Code",
          author: "Dan Brown",
          cover: "",
          genre: "Mystery",
          rating: 4,
          notes: "Page-turner with interesting historical elements",
          loaned: false,
          dateAdded: new Date("2024-09-20"),
          status: "finished",
          totalPages: 454,
          currentPage: 454,
        },
        {
          id: "4",
          title: "Pride and Prejudice",
          author: "Jane Austen",
          cover: "",
          genre: "Romance",
          rating: 5,
          notes: "Beautiful prose and timeless romance",
          loaned: true,
          dateAdded: new Date("2024-09-05"),
          status: "owned",
          totalPages: 279,
          currentPage: 0,
        },
        {
          id: "5",
          title: "Dune",
          author: "Frank Herbert",
          cover: "",
          genre: "Science Fiction",
          rating: 5,
          notes: "Epic sci-fi masterpiece. Just starting and already captivated by the world-building!",
          loaned: false,
          dateAdded: new Date("2024-10-20"),
          status: "reading",
          totalPages: 688,
          currentPage: 245,
          isCurrentRead: true,
        },
        {
          id: "6",
          title: "1984",
          author: "George Orwell",
          cover: "",
          genre: "Fiction",
          rating: 5,
          notes: "Dystopian classic that feels more relevant than ever",
          loaned: false,
          dateAdded: new Date("2024-08-12"),
          status: "finished",
          totalPages: 328,
          currentPage: 328,
        },
      ];

      // Fetch real book covers
      const booksWithCovers = await Promise.all(
        sampleBooks.map(async (book) => {
          const coverData = await fetchBookCover(book.title, book.author);
          return {
            ...book,
            cover: coverData?.cover || "https://images.unsplash.com/photo-1661936901394-a993c79303c7?w=400",
          };
        })
      );

      const sampleWishlist: WishlistBook[] = [
        {
          id: "w1",
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          cover: "",
          genre: "Fantasy",
        },
        {
          id: "w2",
          title: "Atomic Habits",
          author: "James Clear",
          cover: "",
          genre: "Self-Help",
        },
      ];

      // Fetch wishlist covers
      const wishlistWithCovers = await Promise.all(
        sampleWishlist.map(async (book) => {
          const coverData = await fetchBookCover(book.title, book.author);
          return {
            ...book,
            cover: coverData?.cover || "https://images.unsplash.com/photo-1760120482171-d9d5468f75fd?w=400",
          };
        })
      );

      setBooks(booksWithCovers);
      setWishlist(wishlistWithCovers);

      // Initialize with sample reading entries
      const today = new Date();
      const sampleReadingEntries: ReadingEntry[] = [
        {
          id: "r1",
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
          pagesRead: 15,
          bookId: "2",
          bookTitle: "The Name of the Wind",
        },
        {
          id: "r2",
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
          pagesRead: 32,
          bookId: "2",
          bookTitle: "The Name of the Wind",
        },
        {
          id: "r3",
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4),
          pagesRead: 28,
          bookId: "5",
          bookTitle: "Dune",
        },
        {
          id: "r4",
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
          pagesRead: 45,
          bookId: "5",
          bookTitle: "Dune",
        },
        {
          id: "r5",
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
          pagesRead: 20,
          bookId: "1",
          bookTitle: "The Great Gatsby",
        },
        {
          id: "r6",
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
          pagesRead: 38,
          bookId: "3",
          bookTitle: "The Da Vinci Code",
        },
        {
          id: "r7",
          date: today,
          pagesRead: 52,
          bookId: "5",
          bookTitle: "Dune",
        },
      ];

      setReadingEntries(sampleReadingEntries);

      // Initialize streak based on reading history
      setUserProfile({
        name: "Book Reader",
        dailyGoal: 50,
        readingStreak: 7, // 7-day streak to earn a badge
        lastReadDate: today,
        monthlyGoal: 5,
        yearlyGoal: 50,
      });

      // Calculate initial badges
      const initialBadges = calculateBadges(booksWithCovers, sampleReadingEntries, 7);
      setUserProfile((prev) => ({
        ...prev,
        badges: initialBadges,
      }));

      // Initialize friends and activities
      const sampleFriends: Friend[] = [
        {
          id: "f1",
          name: "Sarah Chen",
          initials: "SC",
          isOnline: true,
        },
        {
          id: "f2",
          name: "Michael Torres",
          initials: "MT",
          isOnline: false,
        },
        {
          id: "f3",
          name: "Emma Wilson",
          initials: "EW",
          isOnline: true,
        },
        {
          id: "f4",
          name: "James Lee",
          initials: "JL",
          isOnline: false,
        },
      ];

      const sampleActivities: FriendActivity[] = [
        {
          id: "a1",
          friendId: "f1",
          friendName: "Sarah Chen",
          type: "finished_book",
          description: "finished reading",
          bookTitle: "The Midnight Library",
          timestamp: new Date(today.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
        {
          id: "a2",
          friendId: "f3",
          friendName: "Emma Wilson",
          type: "badge_earned",
          description: "earned a new badge",
          badgeName: "Week Warrior",
          timestamp: new Date(today.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
        },
        {
          id: "a3",
          friendId: "f2",
          friendName: "Michael Torres",
          type: "pages_logged",
          description: "read 45 pages",
          pagesCount: 45,
          timestamp: new Date(today.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
        },
        {
          id: "a4",
          friendId: "f4",
          friendName: "James Lee",
          type: "streak",
          description: "reached a 14-day reading streak! 🔥",
          timestamp: new Date(today.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
        },
      ];

      setFriends(sampleFriends);
      setFriendActivities(sampleActivities);

      // Initialize challenges
      const sampleChallenges: Challenge[] = [
        {
          id: "c1",
          type: "monthly",
          title: "October Reading Goal",
          description: "Read 5 books this month",
          current: 3,
          target: 5,
          startDate: new Date(2025, 9, 1), // October 1
          endDate: new Date(2025, 9, 31), // October 31
          completed: false,
          badge: "Monthly Master",
        },
        {
          id: "c2",
          type: "streak",
          title: "Two Week Streak",
          description: "Maintain a 14-day reading streak",
          current: 7,
          target: 14,
          startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
          completed: false,
          badge: "Streak Champion",
        },
        {
          id: "c3",
          type: "friend",
          title: "Pages Race with Sarah",
          description: "Read more pages than Sarah this week",
          current: 285,
          target: 300,
          startDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
          endDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
          participants: ["f1"],
          completed: false,
        },
        {
          id: "c4",
          type: "monthly",
          title: "1000 Pages Challenge",
          description: "Read 1000 pages this month",
          current: 1050,
          target: 1000,
          startDate: new Date(2025, 9, 1),
          endDate: new Date(2025, 9, 31),
          completed: true,
          badge: "Page Turner",
        },
      ];

      setChallenges(sampleChallenges);

      // Initialize reading goals
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();
      
      const sampleGoals: ReadingGoal[] = [
        {
          id: "g1",
          type: "monthly",
          target: 5,
          current: 3,
          unit: "books",
          year: currentYear,
          month: currentMonth,
        },
        {
          id: "g2",
          type: "yearly",
          target: 50,
          current: 28,
          unit: "books",
          year: currentYear,
        },
        {
          id: "g3",
          type: "monthly",
          target: 1500,
          current: 1050,
          unit: "pages",
          year: currentYear,
          month: currentMonth,
        },
      ];

      setReadingGoals(sampleGoals);

      setIsLoadingBooks(false);
    };

    initializeData();
  }, []);

  // Theme toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleAddBook = (bookData: Omit<Book, "id" | "dateAdded">) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      dateAdded: new Date(),
    };
    setBooks([newBook, ...books]);
    toast.success("Book added to your library!");
  };

  const handleUpdateBook = (bookId: string, updates: Partial<Book>) => {
    setBooks(books.map((book) => (book.id === bookId ? { ...book, ...updates } : book)));
    toast.success("Book updated!");
  };

  const handleUpdateFullBook = (updatedBook: Book) => {
    setBooks(books.map((book) => (book.id === updatedBook.id ? updatedBook : book)));
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks(books.filter((book) => book.id !== bookId));
    toast.success("Book removed from library");
  };

  const handleAddToWishlist = (bookData: Omit<WishlistBook, "id">) => {
    // Check if already in wishlist
    if (wishlist.some((b) => b.title === bookData.title && b.author === bookData.author)) {
      toast.info("This book is already in your wishlist");
      return;
    }
    const newWishlistBook: WishlistBook = {
      ...bookData,
      id: Date.now().toString(),
    };
    setWishlist([...wishlist, newWishlistBook]);
    toast.success("Book added to wishlist!");
  };

  const handleRemoveFromWishlist = (bookId: string) => {
    setWishlist(wishlist.filter((book) => book.id !== bookId));
    toast.success("Book removed from wishlist");
  };

  const handleAddToLibrary = (wishlistBook: WishlistBook) => {
    const newBook: Book = {
      ...wishlistBook,
      id: Date.now().toString(),
      rating: 0,
      notes: "",
      loaned: false,
      dateAdded: new Date(),
    };
    setBooks([newBook, ...books]);
    setWishlist(wishlist.filter((book) => book.id !== wishlistBook.id));
    toast.success("Book added to your library!");
  };

  const handleAddReadingEntry = (entryData: Omit<ReadingEntry, "id">) => {
    const newEntry: ReadingEntry = {
      ...entryData,
      id: Date.now().toString(),
    };
    setReadingEntries([...readingEntries, newEntry]);
  };

  const handleAddPages = (pages: number, notes?: string) => {
    const today = new Date();
    const currentRead = books.find((book) => book.isCurrentRead);

    if (!currentRead) return;

    const newEntry: ReadingEntry = {
      id: Date.now().toString(),
      date: today,
      pagesRead: pages,
      bookId: currentRead?.id,
      bookTitle: currentRead?.title,
    };

    const updatedReadingEntries = [...readingEntries, newEntry];
    setReadingEntries(updatedReadingEntries);

    // Update current book's page count and notes if provided
    const updatedCurrentPage = (currentRead.currentPage || 0) + pages;
    const updatedNotes = notes 
      ? currentRead.notes 
        ? `${currentRead.notes}\\n\\n[${today.toLocaleDateString()}]: ${notes}`
        : `[${today.toLocaleDateString()}]: ${notes}`
      : currentRead.notes;

    const updatedBooks = books.map((book) =>
      book.id === currentRead.id
        ? {
            ...book,
            currentPage: updatedCurrentPage,
            notes: updatedNotes,
          }
        : book
    );
    
    setBooks(updatedBooks);

    // Update streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const lastRead = userProfile.lastReadDate ? new Date(userProfile.lastReadDate) : null;
    let newStreak = userProfile.readingStreak;

    if (!lastRead) {
      newStreak = 1;
    } else {
      const lastReadNormalized = new Date(lastRead);
      lastReadNormalized.setHours(0, 0, 0, 0);
      const todayNormalized = new Date(today);
      todayNormalized.setHours(0, 0, 0, 0);

      if (lastReadNormalized.getTime() === yesterday.getTime()) {
        newStreak += 1;
      } else if (lastReadNormalized.getTime() !== todayNormalized.getTime()) {
        newStreak = 1;
      }
    }

    // Calculate badges with updated data
    const oldBadges = userProfile.badges || [];
    const updatedBadges = calculateBadges(updatedBooks, updatedReadingEntries, newStreak, oldBadges);
    const newlyEarned = getNewlyEarnedBadges(oldBadges, updatedBadges);
    
    setUserProfile({
      ...userProfile,
      readingStreak: newStreak,
      lastReadDate: today,
      badges: updatedBadges,
    });

    if (newlyEarned.length > 0) {
      setNewBadgeNotification(newlyEarned[0]);
      toast.success(`🏅 New badge earned: ${newlyEarned[0].name}!`);
    }
  };

  const handleSetCurrentRead = (bookId: string) => {
    setBooks(
      books.map((book) => ({
        ...book,
        isCurrentRead: book.id === bookId,
        status: book.id === bookId ? "reading" : book.status,
      }))
    );
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile({ ...userProfile, ...updates });
    toast.success("Profile updated!");
  };

  const handleAddFriend = (friendName: string) => {
    const newFriend: Friend = {
      id: `f${Date.now()}`,
      name: friendName,
      initials: friendName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      isOnline: false,
    };
    setFriends([...friends, newFriend]);
    toast.success(`Friend request sent to ${friendName}!`);
  };

  const handleChallengeClick = (challenge: Challenge) => {
    toast.info(`Viewing challenge: ${challenge.title}`);
  };

  // Calculate pages read today
  const pagesReadToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return readingEntries
      .filter((entry) => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      })
      .reduce((total, entry) => total + entry.pagesRead, 0);
  }, [readingEntries]);

  // Calculate books finished this month
  const booksFinishedThisMonth = useMemo(() => {
    const now = new Date();
    return books.filter((book) => {
      if (book.status !== "finished" || !book.dateAdded) return false;
      const bookDate = new Date(book.dateAdded);
      return (
        bookDate.getMonth() === now.getMonth() &&
        bookDate.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [books]);

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        recentBadges={userProfile.badges?.slice(-2) || []}
      />

      <ReadingStreakBar
        streak={userProfile.readingStreak}
        dailyGoal={userProfile.dailyGoal}
        pagesReadToday={pagesReadToday}
        booksFinishedThisMonth={booksFinishedThisMonth}
      />

      {/* Badge Notification */}
      <BadgeNotification 
        badge={newBadgeNotification} 
        onDismiss={() => setNewBadgeNotification(null)} 
      />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">{/* Content */}

          {activeTab === "home" && (
            <HomePage
              books={books}
              readingEntries={readingEntries}
              userProfile={userProfile}
              friends={friends}
              friendActivities={friendActivities}
              challenges={challenges}
              readingGoals={readingGoals}
              onOpenAddBook={() => setIsAddBookOpen(true)}
              onOpenWishlist={() => setIsWishlistOpen(true)}
              onBookClick={(book) => setSelectedBook(book)}
              onUpdateBook={handleUpdateFullBook}
              onAddPages={handleAddPages}
              onAddFriend={handleAddFriend}
              onChallengeClick={handleChallengeClick}
              onNavigateToProfile={() => setActiveTab("profile")}
              onNavigateToSuggestions={() => setActiveTab("suggestions")}
            />
          )}

          {activeTab === "library" && (
            <LibraryPage
              books={books}
              onUpdateBook={handleUpdateBook}
              onDeleteBook={handleDeleteBook}
            />
          )}

          {activeTab === "suggestions" && (
            <SuggestionsPage books={books} onAddToWishlist={handleAddToWishlist} />
          )}

          {activeTab === "profile" && (
            <ProfilePage
              books={books}
              readingEntries={readingEntries}
              userProfile={userProfile}
              challenges={challenges}
              readingGoals={readingGoals}
              isDark={isDark}
              onToggleTheme={() => setIsDark(!isDark)}
              onAddReadingEntry={handleAddReadingEntry}
              onUpdateProfile={handleUpdateProfile}
              onChallengeClick={handleChallengeClick}
            />
          )}

          {activeTab === "social" && (
            <SocialPage
              friends={friends}
              friendActivities={friendActivities}
              challenges={challenges}
            />
          )}
        </div>
      </main>

      <Footer />

      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onAdd={handleAddBook}
      />

      <BookDetailModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        onUpdate={handleUpdateBook}
        onDelete={handleDeleteBook}
        onSetCurrentRead={handleSetCurrentRead}
      />

      <TBRSection
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        books={books}
        wishlist={wishlist}
        onAddToLibrary={handleAddToLibrary}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onUpdateBook={handleUpdateFullBook}
        onSetCurrentRead={handleSetCurrentRead}
        onAddWishlistBook={handleAddToWishlist}
      />
    </div>
  );
}