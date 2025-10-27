import { BookOpen, Flame, Trophy } from "lucide-react";
import { Badge as BadgeType } from "../types/book";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  recentBadges?: BadgeType[];
}

export function Header({ 
  activeTab, 
  onTabChange,
  recentBadges = []
}: HeaderProps) {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "library", label: "Library" },
    { id: "social", label: "Social" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary shadow-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => onTabChange("home")}
          >
            <BookOpen className="w-7 h-7 text-white transition-transform group-hover:scale-110" />
            <h1 className="text-white font-serif italic text-xl">MyBookNook</h1>
          </div>

          {/* Mini Badges */}
          {recentBadges.length > 0 && (
            <div className="hidden lg:flex items-center gap-2">
              {recentBadges.slice(0, 2).map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: "rgba(212, 165, 116, 0.25)",
                    color: "#FFE4C4",
                  }}
                >
                  <Trophy className="w-3 h-3" />
                  <span>{badge.name}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative transition-colors ${
                activeTab === item.id
                  ? "text-white"
                  : "text-white/70 hover:text-white"
              } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full ${
                activeTab === item.id ? "after:w-full" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}