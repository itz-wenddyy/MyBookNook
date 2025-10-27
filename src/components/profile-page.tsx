import { useMemo, useState } from "react";
import { ReadingTracker } from "./reading-tracker";
import { ReadingChart } from "./reading-chart-redesign";
import { BadgeGrid } from "./badge-grid";
import { ChallengesSection } from "./challenges-section";
import { ProgressGoals } from "./progress-goals";
import { toast } from "sonner@2.0.3";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BookOpen, TrendingUp, Star, Flame, Target } from "lucide-react";
import { Book, ReadingEntry, UserProfile, Challenge, ReadingGoal } from "../types/book";

interface ProfilePageProps {
  books: Book[];
  readingEntries: ReadingEntry[];
  userProfile: UserProfile;
  challenges: Challenge[];
  readingGoals: ReadingGoal[];
  isDark: boolean;
  onToggleTheme: () => void;
  onAddReadingEntry: (entry: Omit<ReadingEntry, "id">) => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onChallengeClick?: (challenge: Challenge) => void;
}

export function ProfilePage({
  books,
  readingEntries,
  userProfile,
  challenges,
  readingGoals,
  isDark,
  onToggleTheme,
  onAddReadingEntry,
  onUpdateProfile,
  onChallengeClick,
}: ProfilePageProps) {
  const [dailyGoal, setDailyGoal] = useState(userProfile.dailyGoal.toString());
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  const stats = useMemo(() => {
    const totalBooks = books.length;
    const ratedBooks = books.filter((b) => b.rating && b.rating > 0);
    const avgRating =
      ratedBooks.length > 0
        ? ratedBooks.reduce((sum, b) => sum + (b.rating || 0), 0) / ratedBooks.length
        : 0;

    const genreCounts = books.reduce((acc, book) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostReadGenre =
      Object.entries(genreCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "None";

    const totalPagesRead = readingEntries.reduce(
      (sum, entry) => sum + entry.pagesRead,
      0
    );

    const booksFinished = books.filter((b) => b.status === "finished").length;

    return {
      totalBooks,
      avgRating: avgRating.toFixed(1),
      mostReadGenre,
      ratedBooksCount: ratedBooks.length,
      totalPagesRead,
      booksFinished,
    };
  }, [books, readingEntries]);

  const totalPages = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return readingEntries
      .filter((entry) => new Date(entry.date) >= startOfMonth)
      .reduce((sum, entry) => sum + entry.pagesRead, 0);
  }, [readingEntries]);

  const longestStreak = useMemo(() => {
    // This would ideally be tracked historically, for now return current
    return userProfile.readingStreak;
  }, [userProfile.readingStreak]);

  const handleSaveGoal = () => {
    const goal = parseInt(dailyGoal);
    if (goal > 0) {
      onUpdateProfile({ dailyGoal: goal });
      setIsEditingGoal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="bg-primary text-primary-foreground">BR</AvatarFallback>
          </Avatar>
          <div>
            <h2>Book Reader</h2>
            <p className="text-muted-foreground">Avid book collector and reader</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {stats.mostReadGenre !== "None" && (
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {stats.mostReadGenre} Enthusiast
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-muted-foreground">Books Owned</div>
          <div className="mt-1">{stats.totalBooks}</div>
        </Card>

        <Card className="p-6 text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className="text-muted-foreground">Books Finished</div>
          <div className="mt-1">{stats.booksFinished}</div>
        </Card>

        <Card className="p-6 text-center">
          <Star className="w-8 h-8 mx-auto mb-2 text-accent fill-accent" />
          <div className="text-muted-foreground">Average Rating</div>
          <div className="mt-1">
            {stats.avgRating} / 5.0
          </div>
        </Card>

        <Card className="p-6 text-center">
          <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <div className="text-muted-foreground">Longest Streak</div>
          <div className="mt-1">{longestStreak} days</div>
        </Card>

        <Card className="p-6 text-center">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-muted-foreground">Pages This Month</div>
          <div className="mt-1">{totalPages}</div>
        </Card>

        <Card className="p-6 text-center">
          <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-muted-foreground">Daily Goal</div>
          <div className="mt-1">{userProfile.dailyGoal} pages</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-muted-foreground">
                Switch between light and dark dusty blue theme
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={isDark}
              onCheckedChange={onToggleTheme}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Reading Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Books Rated</span>
            <span>{stats.ratedBooksCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Books Not Rated</span>
            <span>{stats.totalBooks - stats.ratedBooksCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Pages Read</span>
            <span>{stats.totalPagesRead}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Books Finished</span>
            <span>{stats.booksFinished}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Reading Tracker</h3>
        <ReadingTracker
          books={books}
          onAddEntry={onAddReadingEntry}
        />
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Reading Chart</h3>
        <ReadingChart entries={readingEntries} streak={userProfile.readingStreak} />
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Reading Badges</h3>
        <BadgeGrid badges={userProfile.badges || []} />
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Daily Reading Goal</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="daily-goal">Daily Goal</Label>
            <p className="text-muted-foreground">
              Set your daily reading goal in pages
            </p>
          </div>
          {isEditingGoal ? (
            <div className="flex items-center">
              <Input
                id="daily-goal"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
                className="w-20"
              />
              <Button
                className="ml-2"
                onClick={handleSaveGoal}
              >
                Save
              </Button>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="text-muted-foreground">
                {userProfile.dailyGoal} pages
              </span>
              <Button
                className="ml-2"
                onClick={() => setIsEditingGoal(true)}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Full Challenges Section */}
      <ChallengesSection
        challenges={challenges}
        onChallengeClick={onChallengeClick}
      />

      {/* Full Progress Goals Section */}
      <ProgressGoals
        goals={readingGoals}
      />
    </div>
  );
}