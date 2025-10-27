import { useEffect, useState } from "react";
import { Badge } from "../types/book";
import { motion, AnimatePresence } from "motion/react";
import { Award } from "lucide-react";

interface BadgeNotificationProps {
  badge: Badge | null;
  onDismiss: () => void;
}

export function BadgeNotification({ badge, onDismiss }: BadgeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (badge) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Wait for animation to complete
      }, 4000); // Show for 4 seconds

      return () => clearTimeout(timer);
    }
  }, [badge, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && badge && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-[160px] left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border-2 border-white/30">
            <Award className="w-5 h-5 animate-pulse" />
            <div className="flex items-center gap-2">
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <p className="text-sm opacity-90">New Badge!</p>
                <p className="font-semibold">{badge.name}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}