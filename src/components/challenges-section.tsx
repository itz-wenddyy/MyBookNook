import { Challenge } from "../types/book";
import { Card } from "./ui/card";
import { Trophy, Flame, Users, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface ChallengesSectionProps {
  challenges: Challenge[];
  onChallengeClick?: (challenge: Challenge) => void;
}

export function ChallengesSection({ challenges, onChallengeClick }: ChallengesSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getChallengeIcon = (type: Challenge["type"]) => {
    switch (type) {
      case "monthly":
        return <Calendar className="w-5 h-5" />;
      case "friend":
        return <Users className="w-5 h-5" />;
      case "streak":
        return <Flame className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  const getProgressPercentage = (challenge: Challenge) => {
    return Math.min((challenge.current / challenge.target) * 100, 100);
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <Card className="p-6 border-0" style={{ backgroundColor: "#FAFBFD" }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center gap-2" style={{ color: "#1F3F5B" }}>
          <Trophy className="w-5 h-5" style={{ color: "#74A3D4" }} />
          Reading Challenges
        </h2>
      </div>

      {challenges.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: "#5B8DB8" }}>
          No active challenges. Start one to motivate your reading!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((challenge, index) => {
            const percentage = getProgressPercentage(challenge);
            const daysRemaining = getDaysRemaining(challenge.endDate);
            const isHovered = hoveredId === challenge.id;

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -2 }}
                onMouseEnter={() => setHoveredId(challenge.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onChallengeClick?.(challenge)}
                className="relative p-5 rounded-2xl cursor-pointer transition-all duration-300"
                style={{
                  backgroundColor: "#E1ECF9",
                  boxShadow: isHovered
                    ? "0px 8px 24px rgba(91, 141, 184, 0.2)"
                    : "0px 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              >
                {/* Completion Badge */}
                {challenge.completed && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, #74A3D4 0%, #5B8DB8 100%)",
                      boxShadow: "0 0 20px rgba(116, 163, 212, 0.4)",
                    }}
                  >
                    <Trophy className="w-6 h-6 text-white" />
                  </motion.div>
                )}

                <div className="flex items-start gap-3 mb-4">
                  {/* Icon Badge */}
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                    style={{
                      background: challenge.completed
                        ? "linear-gradient(135deg, #74A3D4 0%, #5B8DB8 100%)"
                        : "rgba(116, 163, 212, 0.15)",
                      color: challenge.completed ? "#FFFFFF" : "#5B8DB8",
                    }}
                    whileHover={{ rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {getChallengeIcon(challenge.type)}
                  </motion.div>

                  {/* Title and Description */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm mb-1 truncate" style={{ color: "#1F3F5B" }}>
                      {challenge.title}
                    </h3>
                    <p className="text-xs" style={{ color: "#5B8DB8" }}>
                      {challenge.description}
                    </p>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: "#3A6C99" }}>
                      {challenge.current} / {challenge.target}
                    </span>
                    <span className="text-xs" style={{ color: "#5B8DB8" }}>
                      {Math.round(percentage)}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div 
                    className="relative h-2.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: "rgba(91, 141, 184, 0.12)" }}
                  >
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        background: challenge.completed
                          ? "linear-gradient(to right, #3A6C99, #5B8DB8)"
                          : "linear-gradient(to right, #5B8DB8, #74A3D4)",
                        boxShadow: isHovered
                          ? "0 0 12px rgba(91, 141, 184, 0.4)"
                          : "none",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between text-xs">
                  {challenge.participants && challenge.participants.length > 0 ? (
                    <div className="flex items-center gap-1.5" style={{ color: "#5B8DB8" }}>
                      <Users className="w-3.5 h-3.5" />
                      <span>{challenge.participants.length} participants</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5" style={{ color: "#5B8DB8" }}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Personal challenge</span>
                    </div>
                  )}
                  
                  {!challenge.completed && daysRemaining > 0 && (
                    <span style={{ color: "#5B8DB8" }}>
                      {daysRemaining} {daysRemaining === 1 ? "day" : "days"} left
                    </span>
                  )}
                  {challenge.completed && (
                    <span className="flex items-center gap-1" style={{ color: "#3A6C99" }}>
                      <Trophy className="w-3.5 h-3.5" />
                      Completed!
                    </span>
                  )}
                </div>

                {/* Hover Details Overlay */}
                {isHovered && !challenge.completed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-center backdrop-blur-sm"
                    style={{
                      background: "rgba(225, 236, 249, 0.98)",
                    }}
                  >
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span style={{ color: "#5B8DB8" }}>Started:</span>
                        <span style={{ color: "#1F3F5B" }}>
                          {challenge.startDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: "#5B8DB8" }}>Ends:</span>
                        <span style={{ color: "#1F3F5B" }}>
                          {challenge.endDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: "#5B8DB8" }}>Progress:</span>
                        <span style={{ color: "#3A6C99" }}>
                          {challenge.current} / {challenge.target}
                        </span>
                      </div>
                      {challenge.badge && (
                        <div className="flex justify-between items-center">
                          <span style={{ color: "#5B8DB8" }}>Reward:</span>
                          <span className="flex items-center gap-1" style={{ color: "#74A3D4" }}>
                            <Trophy className="w-4 h-4" />
                            {challenge.badge}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
