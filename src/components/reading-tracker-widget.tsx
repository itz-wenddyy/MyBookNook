import { useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { BookOpen, Plus, Minus, Flame } from "lucide-react";
import { ReadingEntry } from "../types/book";
import { toast } from "sonner@2.0.3";

interface ReadingTrackerWidgetProps {
  readingEntries: ReadingEntry[];
  dailyGoal: number;
  readingStreak: number;
  onAddPages: (pages: number) => void;
}

export function ReadingTrackerWidget({
  readingEntries,
  dailyGoal,
  readingStreak,
  onAddPages,
}: ReadingTrackerWidgetProps) {
  const [pagesToAdd, setPagesToAdd] = useState(10);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayEntries = useMemo(() => {
    return readingEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
  }, [readingEntries, today]);

  const pagesReadToday = todayEntries.reduce(
    (sum, entry) => sum + entry.pagesRead,
    0
  );

  const progress = Math.min((pagesReadToday / dailyGoal) * 100, 100);
  const goalMet = pagesReadToday >= dailyGoal;

  const handleAddPages = () => {
    if (pagesToAdd > 0) {
      onAddPages(pagesToAdd);
      toast.success(`Added ${pagesToAdd} pages to today's reading!`);
    }
  };

  const handleQuickAdd = (pages: number) => {
    if (pages > 0) {
      onAddPages(pages);
      toast.success(`Added ${pages} pages to today's reading!`);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h3>Today's Reading</h3>
          </div>
          {readingStreak > 0 && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-700 dark:text-orange-400">
                {readingStreak} day streak!
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Daily Goal Progress</Label>
            <span className={`${goalMet ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
              {pagesReadToday} / {dailyGoal} pages
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          {goalMet && (
            <p className="text-sm text-green-600 dark:text-green-400">
              🎉 Goal achieved! Keep it up!
            </p>
          )}
          {!goalMet && pagesReadToday > 0 && (
            <p className="text-sm text-muted-foreground">
              {dailyGoal - pagesReadToday} pages to go!
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label>Log Pages Read</Label>
          
          {/* Quick Add Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAdd(10)}
              className="flex-1"
            >
              +10
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAdd(25)}
              className="flex-1"
            >
              +25
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAdd(50)}
              className="flex-1"
            >
              +50
            </Button>
          </div>

          {/* Custom Input */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1 flex-1">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setPagesToAdd(Math.max(1, pagesToAdd - 1))}
                className="h-10 w-10"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                min="1"
                value={pagesToAdd}
                onChange={(e) => setPagesToAdd(Math.max(1, parseInt(e.target.value) || 1))}
                className="text-center"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => setPagesToAdd(pagesToAdd + 1)}
                className="h-10 w-10"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={handleAddPages} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Pages
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
