import { Book, ReadingEntry, Badge } from "../types/book";

// Badge definitions
export const BADGE_DEFINITIONS = [
  {
    id: "bookworm-beginner",
    name: "Bookworm Beginner",
    description: "Read 1 book",
    icon: "📚",
    category: "reading" as const,
  },
  {
    id: "weekend-reader",
    name: "Weekend Reader",
    description: "Read 3 days in a row",
    icon: "📖",
    category: "streak" as const,
  },
  {
    id: "consistent-reader",
    name: "Consistent Reader",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    category: "streak" as const,
  },
  {
    id: "marathon-reader",
    name: "Marathon Reader",
    description: "Maintain a 30-day streak",
    icon: "🏃",
    category: "streak" as const,
  },
  {
    id: "monthly-finisher",
    name: "Monthly Finisher",
    description: "Read 4 books this month",
    icon: "📅",
    category: "reading" as const,
  },
  {
    id: "shelf-expander",
    name: "Shelf Expander",
    description: "Added 10+ books to your library",
    icon: "📚",
    category: "collection" as const,
  },
  {
    id: "critic-in-making",
    name: "Critic in the Making",
    description: "Rated 20+ books",
    icon: "⭐",
    category: "engagement" as const,
  },
];

export function calculateBadges(
  books: Book[],
  readingEntries: ReadingEntry[],
  currentStreak: number,
  existingBadges: Badge[] = []
): Badge[] {
  const badges: Badge[] = [];

  // Books read (finished status)
  const finishedBooks = books.filter((book) => book.status === "finished");
  const booksThisMonth = finishedBooks.filter((book) => {
    if (!book.dateAdded) return false;
    const now = new Date();
    const bookDate = new Date(book.dateAdded);
    return (
      bookDate.getMonth() === now.getMonth() &&
      bookDate.getFullYear() === now.getFullYear()
    );
  });

  // Rated books
  const ratedBooks = books.filter((book) => book.rating && book.rating > 0);

  // Check each badge
  BADGE_DEFINITIONS.forEach((def) => {
    let earned = false;
    let earnedDate: Date | undefined;

    // Find existing badge to preserve earned date
    const existing = existingBadges.find((b) => b.id === def.id);

    switch (def.id) {
      case "bookworm-beginner":
        earned = finishedBooks.length >= 1;
        break;
      case "weekend-reader":
        earned = currentStreak >= 3;
        break;
      case "consistent-reader":
        earned = currentStreak >= 7;
        break;
      case "marathon-reader":
        earned = currentStreak >= 30;
        break;
      case "monthly-finisher":
        earned = booksThisMonth.length >= 4;
        break;
      case "shelf-expander":
        earned = books.length >= 10;
        break;
      case "critic-in-making":
        earned = ratedBooks.length >= 20;
        break;
    }

    // If newly earned, set the date
    if (earned && !existing?.earned) {
      earnedDate = new Date();
    } else if (existing?.earned) {
      earnedDate = existing.earnedDate;
    }

    badges.push({
      id: def.id,
      name: def.name,
      description: def.description,
      icon: def.icon,
      category: def.category,
      earned,
      earnedDate,
    });
  });

  return badges;
}

export function getNewlyEarnedBadges(
  oldBadges: Badge[],
  newBadges: Badge[]
): Badge[] {
  return newBadges.filter((newBadge) => {
    const oldBadge = oldBadges.find((b) => b.id === newBadge.id);
    return newBadge.earned && (!oldBadge || !oldBadge.earned);
  });
}
