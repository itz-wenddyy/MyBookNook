import { Coffee, BookOpen, Heart, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function Footer() {
  const currentMonth = new Date().getMonth();
  
  // Seasonal decorations
  const getSeasonalEmoji = () => {
    if (currentMonth >= 2 && currentMonth <= 4) return "🌸"; // Spring
    if (currentMonth >= 5 && currentMonth <= 7) return "☀️"; // Summer
    if (currentMonth >= 8 && currentMonth <= 10) return "🍂"; // Fall
    return "❄️"; // Winter
  };

  const getSeasonalText = () => {
    if (currentMonth >= 2 && currentMonth <= 4) return "Spring Reading";
    if (currentMonth >= 5 && currentMonth <= 7) return "Summer Reading";
    if (currentMonth >= 8 && currentMonth <= 10) return "Cozy Fall Reading";
    return "Winter Reading";
  };

  return (
    <footer 
      className="mt-16 py-8 border-t"
      style={{ 
        backgroundColor: "rgba(247, 244, 239, 0.5)",
        borderColor: "rgba(137, 175, 203, 0.15)"
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          {/* Seasonal Decoration */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm"
            style={{ color: "#8B7E6A" }}
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {getSeasonalEmoji()}
            </motion.span>
            <span className="italic">{getSeasonalText()}</span>
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {getSeasonalEmoji()}
            </motion.span>
          </motion.div>

          {/* Main Footer Text */}
          <div className="flex items-center gap-2 text-sm" style={{ color: "#6F7A84" }}>
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Coffee className="w-4 h-4" style={{ color: "#C4A57B" }} />
            </motion.div>
            <span>&</span>
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <BookOpen className="w-4 h-4" style={{ color: "#89AFCB" }} />
            </motion.div>
            <span>for book lovers everywhere</span>
          </div>

          {/* Decorative Elements */}
          <div className="flex items-center gap-4 mt-2">
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" style={{ color: "#D4A574" }} />
            </motion.div>
            <Heart className="w-3 h-3" style={{ color: "#E8A5A5" }} />
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            >
              <Sparkles className="w-4 h-4" style={{ color: "#D4A574" }} />
            </motion.div>
          </div>

          {/* Copyright */}
          <p className="text-xs mt-2" style={{ color: "#C4D4E0" }}>
            © {new Date().getFullYear()} MyBookNook • Your Personal Reading Sanctuary
          </p>
        </div>
      </div>
    </footer>
  );
}
