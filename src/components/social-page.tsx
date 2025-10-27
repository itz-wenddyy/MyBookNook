import { Friend, FriendActivity, Challenge } from "../types/book";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Trophy, Book, Award, TrendingUp, Flame, Heart, MessageCircle, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface SocialPageProps {
  friends: Friend[];
  friendActivities: FriendActivity[];
  challenges: Challenge[];
}

export function SocialPage({ friends, friendActivities, challenges }: SocialPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "friends" | "challenges">("all");

  const getActivityIcon = (type: FriendActivity["type"]) => {
    switch (type) {
      case "finished_book":
        return <Book className="w-4 h-4" style={{ color: "#89AFCB" }} />;
      case "badge_earned":
        return <Award className="w-4 h-4" style={{ color: "#D4A574" }} />;
      case "pages_logged":
        return <TrendingUp className="w-4 h-4" style={{ color: "#89AFCB" }} />;
      case "streak":
        return <Flame className="w-4 h-4" style={{ color: "#F97316" }} />;
      default:
        return <Book className="w-4 h-4" style={{ color: "#89AFCB" }} />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredActivities = friendActivities.filter(activity => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "friends") return activity.type === "finished_book" || activity.type === "pages_logged";
    if (selectedFilter === "challenges") return activity.type === "badge_earned" || activity.type === "streak";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="flex items-center gap-2" style={{ color: "#4F6D7A" }}>
            <Users className="w-6 h-6" style={{ color: "#89AFCB" }} />
            Reading Community
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6F7A84" }}>
            Connect with friends and track your progress together
          </p>
        </div>

        {/* Filter Tabs */}
        <div 
          className="flex items-center gap-2 p-1 rounded-2xl"
          style={{ backgroundColor: "rgba(247, 244, 239, 0.6)" }}
        >
          {["all", "friends", "challenges"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter as typeof selectedFilter)}
              className="px-4 py-2 rounded-xl text-xs transition-all duration-300"
              style={{
                backgroundColor: selectedFilter === filter ? "#89AFCB" : "transparent",
                color: selectedFilter === filter ? "#FFFFFF" : "#6F7A84",
              }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Friend Feed */}
        <div className="lg:col-span-2 space-y-4">
          <Card 
            className="p-6 border-0"
            style={{ backgroundColor: "#FAFBFD" }}
          >
            <h2 className="mb-4 flex items-center gap-2" style={{ color: "#1F3F5B" }}>
              <Flame className="w-5 h-5" style={{ color: "#F97316" }} />
              Recent Activity
            </h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
              <AnimatePresence mode="popLayout">
                {filteredActivities.length === 0 ? (
                  <p className="text-sm text-center py-8 italic" style={{ color: "#8B7E6A" }}>
                    No recent activity yet
                  </p>
                ) : (
                  filteredActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="rounded-2xl p-4 cursor-pointer transition-all duration-300"
                      style={{
                        background: "linear-gradient(135deg, rgba(247, 244, 239, 0.8) 0%, rgba(232, 220, 199, 0.4) 100%)",
                        boxShadow: "0 2px 8px rgba(137, 175, 203, 0.06)",
                      }}
                    >
                      <div className="flex items-start gap-4">
                        {/* Friend Avatar */}
                        <Avatar className="w-12 h-12 border-2 shadow-md" style={{ borderColor: "#FFFFFF" }}>
                          <AvatarImage src={friends.find(f => f.id === activity.friendId)?.avatar} />
                          <AvatarFallback style={{ backgroundColor: "#89AFCB", color: "#FFFFFF" }}>
                            {activity.friendName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Activity Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm mb-1">
                            <span style={{ color: "#5E8CA7" }}>
                              {activity.friendName}
                            </span>
                            {" "}
                            <span style={{ color: "#6F7A84" }}>
                              {activity.description}
                            </span>
                          </p>

                          {activity.bookTitle && (
                            <p className="text-xs italic truncate" style={{ color: "#9CA3AF" }}>
                              "{activity.bookTitle}"
                            </p>
                          )}

                          {activity.badgeName && (
                            <div className="flex items-center gap-1 mt-1">
                              <Award className="w-3.5 h-3.5" style={{ color: "#D4A574" }} />
                              <span className="text-xs" style={{ color: "#D4A574" }}>
                                {activity.badgeName}
                              </span>
                            </div>
                          )}

                          {activity.pagesCount && (
                            <p className="text-xs mt-1" style={{ color: "#89AFCB" }}>
                              {activity.pagesCount} pages
                            </p>
                          )}
                        </div>

                        {/* Activity Icon & Time */}
                        <div className="flex flex-col items-end gap-2">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "rgba(137, 175, 203, 0.12)" }}
                          >
                            {getActivityIcon(activity.type)}
                          </div>
                          <span className="text-xs whitespace-nowrap" style={{ color: "#C4D4E0" }}>
                            {getTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                      </div>

                      {/* Interaction Buttons */}
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t" style={{ borderColor: "rgba(137, 175, 203, 0.1)" }}>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-xs gap-1.5 hover:bg-transparent"
                          style={{ color: "#89AFCB" }}
                        >
                          <Heart className="w-3.5 h-3.5" />
                          Encourage
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-xs gap-1.5 hover:bg-transparent"
                          style={{ color: "#89AFCB" }}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Comment
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* Right Column - Active Challenges */}
        <div className="space-y-4">
          <Card 
            className="p-6 border-0"
            style={{ backgroundColor: "#E1ECF9" }}
          >
            <h3 className="mb-4 flex items-center gap-2" style={{ color: "#1F3F5B" }}>
              <Trophy className="w-5 h-5" style={{ color: "#74A3D4" }} />
              Active Challenges
            </h3>

            <div className="space-y-3">
              {challenges.filter(c => !c.completed && c.participants).slice(0, 3).map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
                >
                  <p className="text-sm mb-2" style={{ color: "#1F3F5B" }}>
                    {challenge.title}
                  </p>
                  <div className="flex items-center justify-between text-xs" style={{ color: "#5B8DB8" }}>
                    <span>{challenge.participants?.length || 0} participants</span>
                    <span>{Math.round((challenge.current / challenge.target) * 100)}%</span>
                  </div>
                  <div 
                    className="h-1.5 rounded-full mt-2 overflow-hidden"
                    style={{ backgroundColor: "rgba(91, 141, 184, 0.15)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(to right, #5B8DB8, #74A3D4)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((challenge.current / challenge.target) * 100, 100)}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}