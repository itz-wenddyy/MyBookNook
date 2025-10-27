import { Flame, BookOpen, Award } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ReadingStreakBarProps {
  streak: number;
  dailyGoal: number;
  pagesReadToday: number;
  booksFinishedThisMonth: number;
}

export function ReadingStreakBar({
  streak,
  dailyGoal,
  pagesReadToday,
  booksFinishedThisMonth,
}: ReadingStreakBarProps) {
  const pagesRemaining = Math.max(0, dailyGoal - pagesReadToday);
  const goalMet = pagesReadToday >= dailyGoal;

  return (
    <div className="sticky top-16 z-40 w-full bg-primary/25 backdrop-blur-sm border-b border-primary/15">
      <div className="container mx-auto px-4">
        {/* Desktop Layout - Single Line */}
        <div className="hidden md:flex items-center justify-center gap-3 py-1.5 text-[0.8rem]">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help transition-opacity hover:opacity-80">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-cream/90">
                    <span className="font-medium">{streak}</span>-Day Streak
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white text-primary border-primary/20">
                <p>
                  {streak > 0
                    ? `You've read for ${streak} consecutive day${streak > 1 ? "s" : ""}.`
                    : "Read today to start your streak!"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span className="text-cream/30 text-xs">•</span>

          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help transition-opacity hover:opacity-80">
                  <BookOpen className="w-3.5 h-3.5 text-cream/80" />
                  <span className="text-cream/90">
                    <span className="font-medium">{pagesReadToday}</span> / {dailyGoal} Pages Today
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white text-primary border-primary/20">
                <p>
                  {goalMet
                    ? `Goal achieved! You've read ${pagesReadToday} pages today.`
                    : `${pagesRemaining} page${pagesRemaining !== 1 ? "s" : ""} left to meet today's goal.`}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span className="text-cream/30 text-xs">•</span>

          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help transition-opacity hover:opacity-80">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-cream/90">
                    <span className="font-medium">{booksFinishedThisMonth}</span> Book{booksFinishedThisMonth !== 1 ? "s" : ""} This Month
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white text-primary border-primary/20">
                <p>
                  {booksFinishedThisMonth > 0
                    ? `You've finished ${booksFinishedThisMonth} book${booksFinishedThisMonth !== 1 ? "s" : ""} this month!`
                    : "No books finished this month yet. Keep reading!"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Mobile Layout - 2 Lines, Compact */}
        <div className="md:hidden flex flex-col items-center gap-1 py-1.5 text-[0.75rem]">
          <div className="flex items-center gap-2.5">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 cursor-help">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="text-cream/90">
                      <span className="font-medium">{streak}</span>d
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{streak}-day reading streak</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span className="text-cream/30 text-xs">•</span>

            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 cursor-help">
                    <BookOpen className="w-3 h-3 text-cream/80" />
                    <span className="text-cream/90">
                      <span className="font-medium">{pagesReadToday}</span>/{dailyGoal}p
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{pagesRemaining} pages left to meet goal</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 cursor-help">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span className="text-cream/90">
                      <span className="font-medium">{booksFinishedThisMonth}</span> book{booksFinishedThisMonth !== 1 ? "s" : ""} this month
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{booksFinishedThisMonth} books finished this month</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}