import { Friend, FriendActivity } from "../types/book";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { UserPlus, Book, Award, TrendingUp, Flame, Sparkles, Trophy } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface FriendsCommunityProps {
  friends: Friend[];
  recentActivities: FriendActivity[];
  onAddFriend?: (friendName: string) => void;
}

export function FriendsCommunity({ friends, recentActivities, onAddFriend }: FriendsCommunityProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hoveredFriendId, setHoveredFriendId] = useState<string | null>(null);

  const handleAddFriend = () => {
    if (searchQuery.trim() && onAddFriend) {
      onAddFriend(searchQuery);
      setSearchQuery("");
      setIsDialogOpen(false);
    }
  };

  const getActivityIcon = (type: FriendActivity["type"]) => {
    switch (type) {
      case "finished_book":
        return <Book className="w-3 h-3" style={{ color: "#89AFCB" }} />;
      case "badge_earned":
        return <Award className="w-3 h-3" style={{ color: "#D4A574" }} />;
      case "pages_logged":
        return <TrendingUp className="w-3 h-3" style={{ color: "#89AFCB" }} />;
      case "streak":
        return <Flame className="w-3 h-3" style={{ color: "#F97316" }} />;
      default:
        return <Book className="w-3 h-3" style={{ color: "#89AFCB" }} />;
    }
  };

  const getFriendActivity = (friendId: string) => {
    const activity = recentActivities.find(a => a.friendId === friendId);
    if (!activity) return null;
    return activity.description.split(" ").slice(0, 3).join(" ") + "...";
  };

  const hasChallenges = (friend: Friend) => {
    // Check if friend is participating in any challenges
    return Math.random() > 0.5; // Mock for now
  };

  return (
    <TooltipProvider delayDuration={200}>
      {/* Compact Friends Ribbon */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="relative rounded-3xl p-4 sm:px-6"
        style={{
          background: "linear-gradient(135deg, rgba(247, 244, 239, 0.4) 0%, rgba(232, 220, 199, 0.2) 100%)",
          boxShadow: "0 1px 8px rgba(137, 175, 203, 0.06)",
        }}
      >
        {/* Subtle decorative element */}
        <div className="absolute top-2 right-2 opacity-5">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Friends Ribbon */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-xs" style={{ color: "#6F7A84" }}>
                Reading Circle
              </h4>
              {friends.length > 0 && (
                <span className="text-xs" style={{ color: "#C4D4E0" }}>
                  • {friends.length} {friends.length === 1 ? "friend" : "friends"}
                </span>
              )}
            </div>
            
            <div className="overflow-x-auto scrollbar-hide -mx-1">
              <div className="flex gap-2 px-1 pb-1">
                {friends.length === 0 ? (
                  <p className="text-xs py-2 italic" style={{ color: "#9CA3AF" }}>
                    Add friends to share your journey ☕
                  </p>
                ) : (
                  friends.map((friend, index) => (
                    <Tooltip key={friend.id}>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05, type: "spring", stiffness: 400 }}
                          onMouseEnter={() => setHoveredFriendId(friend.id)}
                          onMouseLeave={() => setHoveredFriendId(null)}
                          className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0"
                        >
                          <motion.div
                            className="relative"
                            whileHover={{ scale: 1.05, y: -1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <Avatar 
                              className="w-12 h-12 border-2 transition-all duration-300"
                              style={{
                                borderColor: hoveredFriendId === friend.id ? "#89AFCB" : "rgba(255, 255, 255, 0.9)",
                                boxShadow: hoveredFriendId === friend.id
                                  ? "0 6px 16px rgba(137, 175, 203, 0.2)"
                                  : "0 3px 10px rgba(137, 175, 203, 0.1)",
                              }}
                            >
                              <AvatarImage src={friend.avatar} alt={friend.name} />
                              <AvatarFallback 
                                className="text-white text-xs"
                                style={{ backgroundColor: "#89AFCB" }}
                              >
                                {friend.initials}
                              </AvatarFallback>
                            </Avatar>
                            
                            {/* Online indicator */}
                            {friend.isOnline && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"
                              />
                            )}
                            
                            {/* Challenge participation badge */}
                            {hasChallenges(friend) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: "#74A3D4", boxShadow: "0 2px 6px rgba(116, 163, 212, 0.3)" }}
                              >
                                <Trophy className="w-2.5 h-2.5 text-white" />
                              </motion.div>
                            )}
                          </motion.div>
                          
                          {/* Compact nickname */}
                          <p 
                            className="text-xs text-center transition-colors duration-200 truncate max-w-[50px]"
                            style={{ 
                              color: hoveredFriendId === friend.id ? "#5E8CA7" : "#6F7A84",
                            }}
                          >
                            {friend.name.split(" ")[0]}
                          </p>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        className="rounded-xl border-0"
                        style={{
                          background: "rgba(247, 244, 239, 0.98)",
                          boxShadow: "0 4px 12px rgba(137, 175, 203, 0.15)",
                        }}
                      >
                        <div className="text-xs">
                          <p style={{ color: "#1F3F5B" }}>{friend.name}</p>
                          {getFriendActivity(friend.id) && (
                            <p className="mt-0.5 italic" style={{ color: "#6F7A84" }}>
                              {getFriendActivity(friend.id)}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Compact Add Friend Button */}
          <motion.button
            onClick={() => setIsDialogOpen(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow flex-shrink-0"
            style={{ backgroundColor: "#89AFCB" }}
          >
            <UserPlus className="w-3.5 h-3.5 text-white" />
          </motion.button>
        </div>
      </motion.div>

      {/* Add Friend Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Add a Friend</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddFriend()}
              className="rounded-2xl"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleAddFriend} 
                className="flex-1 rounded-2xl"
                style={{ backgroundColor: "#89AFCB" }}
              >
                Send Request
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="rounded-2xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </TooltipProvider>
  );
}
