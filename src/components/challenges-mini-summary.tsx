import { Challenge } from "../types/book";
import { Card } from "./ui/card";
import { Trophy, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface ChallengesMiniSummaryProps {
  challenges: Challenge[];
  onViewDetails?: () => void;
}

export function ChallengesMiniSummary({ challenges, onViewDetails }: ChallengesMiniSummaryProps) {
  const activeCount = challenges.filter(c => !c.completed).length;
  const completedCount = challenges.filter(c => c.completed).length;
  
  // Get the most recent active challenge
  const topChallenge = challenges.find(c => !c.completed);
  
  const getProgressPercentage = (challenge: Challenge) => {
    return Math.min((challenge.current / challenge.target) * 100, 100);
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
          backgroundColor: "#E1ECF9",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Icon Badge */}
            <motion.div 
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
              style={{
                background: "linear-gradient(135deg, #74A3D4 0%, #5B8DB8 100%)",
              }}
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Trophy className="w-5 h-5 text-white" />
            </motion.div>
            
            <div>
              <h3 className="text-sm mb-0.5" style={{ color: "#1F3F5B" }}>
                Challenges
              </h3>
              <p className="text-xs" style={{ color: "#5B8DB8" }}>
                {activeCount} active • {completedCount} completed
              </p>
            </div>
          </div>
          
          <motion.div
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5" style={{ color: "#74A3D4" }} />
          </motion.div>
        </div>

        {topChallenge ? (
          <div className="space-y-2.5">
            {/* Challenge Info */}
            <div className="flex items-center justify-between">
              <span className="text-xs truncate pr-2" style={{ color: "#1F3F5B" }}>
                {topChallenge.title}
              </span>
              <span className="text-xs whitespace-nowrap" style={{ color: "#5B8DB8" }}>
                {topChallenge.current}/{topChallenge.target}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div 
              className="relative h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: "rgba(91, 141, 184, 0.12)" }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: "linear-gradient(to right, #5B8DB8, #74A3D4)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage(topChallenge)}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            
            {/* Footer */}
            <p className="text-xs italic text-center pt-1" style={{ color: "#5B8DB8" }}>
              Click to view all challenges
            </p>
          </div>
        ) : (
          <p className="text-xs text-center py-3" style={{ color: "#5B8DB8" }}>
            No active challenges. Click to get started!
          </p>
        )}
      </Card>
    </motion.div>
  );
}
