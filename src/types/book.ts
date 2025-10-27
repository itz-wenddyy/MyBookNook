export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string;
  rating?: number;
  notes?: string;
  loaned?: boolean;
  dateAdded?: Date;
  status?: "owned" | "reading" | "finished";
  currentPage?: number;
  totalPages?: number;
  isCurrentRead?: boolean;
}

export interface WishlistBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string;
  buyLink?: string;
}

export interface ReadingEntry {
  id: string;
  date: Date;
  pagesRead: number;
  bookId?: string;
  bookTitle?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
  category: "reading" | "streak" | "collection" | "engagement";
}

export interface UserProfile {
  name: string;
  dailyGoal: number;
  readingStreak: number;
  lastReadDate?: Date;
  badges?: Badge[];
  monthlyGoal?: number;
  yearlyGoal?: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  isOnline?: boolean;
  recentActivity?: FriendActivity[];
}

export interface FriendActivity {
  id: string;
  friendId: string;
  friendName: string;
  type: "finished_book" | "pages_logged" | "badge_earned" | "streak";
  description: string;
  timestamp: Date;
  bookTitle?: string;
  badgeName?: string;
  pagesCount?: number;
}

export interface Challenge {
  id: string;
  type: "monthly" | "friend" | "streak";
  title: string;
  description: string;
  current: number;
  target: number;
  startDate: Date;
  endDate: Date;
  participants?: string[]; // friend IDs
  completed: boolean;
  badge?: string;
}

export interface ReadingGoal {
  id: string;
  type: "monthly" | "yearly";
  target: number;
  current: number;
  unit: "books" | "pages";
  year?: number;
  month?: number;
}