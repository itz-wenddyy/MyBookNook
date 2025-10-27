import { ReadingGoal } from "../types/book";
import { Card } from "./ui/card";
import { Target, ChevronRight, Flame } from "lucide-react";
import { motion } from "motion/react";

interface ProgressGoalsMiniSummaryProps {
  goals: ReadingGoal[];
  currentStreak?: number;
  onViewDetails?: () => void;
}

export function ProgressGoalsMiniSummary({ 
  goals, 
  currentStreak = 0,
  onViewDetails 
}: ProgressGoalsMiniSummaryProps) {
  // Get monthly and yearly goals
  const monthlyGoal = goals.find(g => g.type === "monthly");
  const yearlyGoal = goals.find(g => g.type === "yearly");
  
  const getProgressPercentage = (goal: ReadingGoal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "#A7C4B5"; // Soft sage green
    if (percentage >= 75) return "#C4A57B"; // Warm tan
    if (percentage >= 50) return "#D4A574"; // Light amber
    return "#C8BDB0"; // Soft gray-beige
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card 
        className="p-5 cursor-pointer transition-all duration-300 border-0"
        onClick={onViewDetails}
        style={{
          backgroundColor: "#F5EFE7",
          boxShadow: "0px 4px 12px rgba(200, 189, 176, 0.08)",
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Icon Badge */}
            <motion.div 
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
              style={{
                background: "linear-gradient(135deg, #C4A57B 0%, #D4A574 100%)",
              }}
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Target className="w-5 h-5 text-white" />
            </motion.div>
            
            <div>
              <h3 className="text-sm mb-0.5" style={{ color: "#5A4A3A" }}>
                Reading Goals
              </h3>
              <p className="text-xs" style={{ color: "#8B7E6A" }}>
                Track your progress
              </p>
            </div>
          </div>
          
          <motion.div
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5" style={{ color: "#C4A57B" }} />
          </motion.div>
        </div>

        <div className="space-y-3">
          {/* Monthly Goal */}
          {monthlyGoal && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "#5A4A3A" }}>
                  Monthly Goal
                </span>
                <span className="text-xs" style={{ 
                  color: getProgressColor(getProgressPercentage(monthlyGoal)) 
                }}>
                  {monthlyGoal.current}/{monthlyGoal.target} {monthlyGoal.unit}
                </span>
              </div>
              <div 
                className="relative h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(200, 189, 176, 0.15)" }}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ 
                    backgroundColor: getProgressColor(getProgressPercentage(monthlyGoal)) 
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage(monthlyGoal)}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          )}

          {/* Yearly Goal */}
          {yearlyGoal && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "#5A4A3A" }}>
                  Yearly Goal
                </span>
                <span className="text-xs" style={{ 
                  color: getProgressColor(getProgressPercentage(yearlyGoal)) 
                }}>
                  {yearlyGoal.current}/{yearlyGoal.target} {yearlyGoal.unit}
                </span>
              </div>
              <div 
                className="relative h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(200, 189, 176, 0.15)" }}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ 
                    backgroundColor: getProgressColor(getProgressPercentage(yearlyGoal)) 
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage(yearlyGoal)}%` }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                />
              </div>
            </div>
          )}

          {/* Streak Summary */}
          {currentStreak > 0 && (
            <div 
              className="pt-2 flex items-center justify-between rounded-xl p-2"
              style={{ 
                backgroundColor: "rgba(248, 113, 113, 0.08)",
                border: "1px solid rgba(248, 113, 113, 0.15)"
              }}
            >
              <span className="text-xs flex items-center gap-1.5" style={{ color: "#8B7E6A" }}>
                <Flame className="w-3.5 h-3.5" style={{ color: "#F97316" }} />
                Current Streak
              </span>
              <span className="text-xs" style={{ color: "#F97316" }}>
                {currentStreak} {currentStreak === 1 ? "day" : "days"}
              </span>
            </div>
          )}

          {goals.length === 0 && (
            <p className="text-xs text-center py-2 italic" style={{ color: "#8B7E6A" }}>
              No goals set. Click to create one!
            </p>
          )}

          {goals.length > 0 && (
            <p className="text-xs italic text-center pt-1" style={{ color: "#C4A57B" }}>
              Click for full details
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
