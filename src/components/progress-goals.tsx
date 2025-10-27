import { ReadingGoal } from "../types/book";
import { Card } from "./ui/card";
import { Target, BookOpen, FileText } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface ProgressGoalsProps {
  goals: ReadingGoal[];
}

export function ProgressGoals({ goals }: ProgressGoalsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getGoalIcon = (unit: ReadingGoal["unit"]) => {
    return unit === "books" ? <BookOpen className="w-5 h-5" /> : <FileText className="w-5 h-5" />;
  };

  const getProgressPercentage = (goal: ReadingGoal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "#A7C4B5"; // Soft sage green - completed
    if (percentage >= 75) return "#C4A57B"; // Warm tan - on track
    if (percentage >= 50) return "#D4A574"; // Light amber - halfway
    return "#C8BDB0"; // Soft gray-beige - just started
  };

  const getGoalTitle = (goal: ReadingGoal) => {
    if (goal.type === "monthly") {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${monthNames[goal.month! - 1]} ${goal.year} Goal`;
    }
    return `${goal.year} Yearly Goal`;
  };

  return (
    <Card 
      className="p-6 border-0"
      style={{ backgroundColor: "#FAFAF8" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center gap-2" style={{ color: "#5A4A3A" }}>
          <Target className="w-5 h-5" style={{ color: "#C4A57B" }} />
          Progress Toward Goals
        </h2>
      </div>

      {goals.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: "#8B7E6A" }}>
          Set reading goals to track your progress!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => {
            const percentage = getProgressPercentage(goal);
            const color = getProgressColor(percentage);
            const isHovered = hoveredId === goal.id;
            const circumference = 2 * Math.PI * 45; // radius = 45
            const strokeDashoffset = circumference - (percentage / 100) * circumference;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredId(goal.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative"
              >
                <div
                  className="p-6 rounded-2xl transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: "#F5EFE7",
                    border: `2px solid ${isHovered ? color : "rgba(200, 189, 176, 0.2)"}`,
                    boxShadow: isHovered ? `0 8px 24px ${color}30` : "0 4px 12px rgba(200, 189, 176, 0.08)",
                  }}
                >
                  {/* Circular Progress */}
                  <div className="flex flex-col items-center mb-4">
                    <div className="relative w-28 h-28">
                      {/* Background Circle */}
                      <svg className="transform -rotate-90 w-28 h-28">
                        <circle
                          cx="56"
                          cy="56"
                          r="45"
                          stroke="rgba(200, 189, 176, 0.15)"
                          strokeWidth="8"
                          fill="none"
                        />
                        {/* Progress Circle */}
                        <motion.circle
                          cx="56"
                          cy="56"
                          r="45"
                          stroke={color}
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          style={{
                            strokeDasharray: circumference,
                          }}
                        />
                      </svg>

                      {/* Center Content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                          className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
                          style={{ backgroundColor: `${color}20`, color }}
                        >
                          {getGoalIcon(goal.unit)}
                        </motion.div>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="text-xs"
                          style={{ color }}
                        >
                          {Math.round(percentage)}%
                        </motion.span>
                      </div>
                    </div>
                  </div>

                  {/* Goal Info */}
                  <div className="text-center">
                    <h3 className="text-sm mb-2" style={{ color: "#5A4A3A" }}>
                      {getGoalTitle(goal)}
                    </h3>
                    <p className="text-xs mb-3" style={{ color: "#8B7E6A" }}>
                      {goal.current} / {goal.target} {goal.unit}
                    </p>

                    {/* Progress Bar Alternative */}
                    <div 
                      className="w-full rounded-full h-1.5 overflow-hidden"
                      style={{ backgroundColor: "rgba(200, 189, 176, 0.15)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>

                    {/* Status */}
                    <div className="mt-3">
                      {percentage >= 100 ? (
                        <span 
                          className="text-xs px-3 py-1 rounded-full" 
                          style={{ backgroundColor: `${color}30`, color }}
                        >
                          🎉 Goal Complete!
                        </span>
                      ) : percentage >= 75 ? (
                        <span 
                          className="text-xs px-3 py-1 rounded-full" 
                          style={{ backgroundColor: `${color}30`, color }}
                        >
                          Almost there!
                        </span>
                      ) : percentage >= 50 ? (
                        <span 
                          className="text-xs px-3 py-1 rounded-full" 
                          style={{ backgroundColor: `${color}30`, color }}
                        >
                          Halfway done
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: "#8B7E6A" }}>
                          {goal.target - goal.current} to go
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center p-4"
                      style={{ backgroundColor: "rgba(245, 239, 231, 0.98)" }}
                    >
                      <div className="space-y-2 text-sm w-full">
                        <div className="flex justify-between">
                          <span style={{ color: "#8B7E6A" }}>Target:</span>
                          <span style={{ color: "#5A4A3A" }}>{goal.target} {goal.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: "#8B7E6A" }}>Current:</span>
                          <span style={{ color }}>{goal.current} {goal.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: "#8B7E6A" }}>Remaining:</span>
                          <span style={{ color: "#5A4A3A" }}>{goal.target - goal.current} {goal.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: "#8B7E6A" }}>Progress:</span>
                          <span style={{ color }}>{Math.round(percentage)}%</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
