import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Coffee, Book, Sparkles, Moon, Sun } from "lucide-react";

interface CozyCornerProps {
  onCozyModeToggle?: (isCozy: boolean) => void;
  isCozyMode?: boolean;
}

const quotes = [
  {
    text: "A reader lives a thousand lives before he dies.",
    author: "George R.R. Martin",
  },
  {
    text: "Books are a uniquely portable magic.",
    author: "Stephen King",
  },
  {
    text: "There is no friend as loyal as a book.",
    author: "Ernest Hemingway",
  },
  {
    text: "A room without books is like a body without a soul.",
    author: "Marcus Tullius Cicero",
  },
  {
    text: "Reading is dreaming with open eyes.",
    author: "Unknown",
  },
  {
    text: "The more that you read, the more things you will know.",
    author: "Dr. Seuss",
  },
  {
    text: "A book is a dream you hold in your hands.",
    author: "Neil Gaiman",
  },
];

export function CozyCorner({ onCozyModeToggle, isCozyMode = false }: CozyCornerProps) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Rotate quotes on page load (could be every 24h in production)
  useEffect(() => {
    // Random quote on mount
    setCurrentQuoteIndex(Math.floor(Math.random() * quotes.length));
    
    // Auto-rotate every 12 seconds for demo
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const currentQuote = quotes[currentQuoteIndex];

  // Decorative floating particles
  const particles = Array.from({ length: 8 }, (_, i) => i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-700"
      style={{
        backgroundColor: isCozyMode ? "#E8DCC7" : "#F7F4EF",
        minHeight: "280px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isCozyMode
            ? "linear-gradient(135deg, rgba(246, 201, 139, 0.15) 0%, rgba(232, 220, 199, 0) 70%)"
            : "radial-gradient(ellipse at top right, rgba(137, 175, 203, 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Decorative corner elements */}
      <div className="absolute top-4 left-4 opacity-5">
        <Sparkles className="w-8 h-8" />
      </div>
      <div className="absolute bottom-4 left-6 opacity-5 rotate-12">
        <Book className="w-6 h-6" />
      </div>

      {/* Ambient floating particles */}
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            backgroundColor: isCozyMode ? "#D4A574" : "#89AFCB",
            opacity: 0.2,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 15 - 7.5, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Dark Cozy Mode Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          onClick={() => onCozyModeToggle?.(!isCozyMode)}
          className="gap-2 rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-all text-white"
          size="sm"
          style={{
            backgroundColor: isCozyMode ? "#A67C52" : "#89AFCB",
          }}
        >
          {isCozyMode ? (
            <>
              <Sun className="w-4 h-4" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              <span className="hidden sm:inline">Dark Cozy</span>
            </>
          )}
        </Button>
      </div>

      {/* Main Content - Flex Row Layout */}
      <div className="relative z-10 py-10 px-8 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Quote Text Section - Left */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuoteIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <p
                  className="text-lg sm:text-xl md:text-2xl mb-3 leading-relaxed"
                  style={{
                    fontFamily: "'Playfair Display', 'Lora', serif",
                    color: isCozyMode ? "#4A3F35" : "#2E2E2E",
                    lineHeight: "1.6",
                  }}
                >
                  "{currentQuote.text}"
                </p>
                <p
                  className="text-sm md:text-base"
                  style={{
                    color: isCozyMode ? "#8B7D6F" : "#6F7A84",
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  — {currentQuote.author}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Quote Navigation Dots */}
            <div className="flex justify-center lg:justify-start gap-2 mt-6">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuoteIndex(index)}
                  className="w-2 h-2 rounded-full transition-all duration-300 hover:scale-125"
                  style={{
                    backgroundColor:
                      index === currentQuoteIndex
                        ? isCozyMode
                          ? "#A67C52"
                          : "#5E8CA7"
                        : isCozyMode
                        ? "#D4C4A8"
                        : "#C4D4E0",
                    transform: index === currentQuoteIndex ? "scale(1.4)" : "scale(1)",
                  }}
                  aria-label={`Go to quote ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Illustration Section - Right */}
          <motion.div
            className="flex items-center justify-center gap-6 lg:gap-8 flex-shrink-0"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Stack of Books */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-14 sm:w-16 md:w-20 h-3 md:h-4 rounded-sm shadow-sm"
                style={{ backgroundColor: isCozyMode ? "#A67C52" : "#89AFCB" }}
                animate={{ rotate: [-1.5, 1.5, -1.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="w-14 sm:w-16 md:w-20 h-3 md:h-4 rounded-sm mt-0.5 shadow-sm"
                style={{ backgroundColor: isCozyMode ? "#D4A574" : "#A5C4D8" }}
                animate={{ rotate: [1.5, -1.5, 1.5] }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}
              />
              <motion.div
                className="w-14 sm:w-16 md:w-20 h-3 md:h-4 rounded-sm mt-0.5 shadow-sm"
                style={{ backgroundColor: isCozyMode ? "#8B6F47" : "#7AA8C3" }}
                animate={{ rotate: [-1, 1, -1] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1.2, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Coffee Mug with Steam */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-10 sm:w-12 md:w-14 h-12 sm:h-14 md:h-16 rounded-b-xl border-4 shadow-md"
                style={{
                  borderColor: isCozyMode ? "#8B6F47" : "#5E8CA7",
                  backgroundColor: isCozyMode ? "#F6E9D8" : "#E8F2F7",
                }}
              >
                {/* Coffee mug handle */}
                <div
                  className="w-3 sm:w-4 h-5 sm:h-6 md:h-7 rounded-r-lg absolute -right-4 sm:-right-5 top-3 sm:top-4"
                  style={{
                    borderTop: `4px solid ${isCozyMode ? "#8B6F47" : "#5E8CA7"}`,
                    borderRight: `4px solid ${isCozyMode ? "#8B6F47" : "#5E8CA7"}`,
                    borderBottom: `4px solid ${isCozyMode ? "#8B6F47" : "#5E8CA7"}`,
                  }}
                />
              </motion.div>

              {/* Rising steam */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-4 sm:h-5 md:h-6 rounded-full"
                  style={{
                    backgroundColor: isCozyMode ? "#D4C4A8" : "#B8D4E8",
                    left: `${18 + i * 6}px`,
                    bottom: "60px",
                  }}
                  animate={{
                    y: [-8, -35],
                    opacity: [0.5, 0],
                    x: [0, i % 2 === 0 ? 4 : -4],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>

            {/* Potted Plant */}
            <motion.div
              className="relative"
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Pot */}
              <div
                className="w-8 sm:w-10 md:w-12 h-6 sm:h-7 md:h-8 rounded-b-lg shadow-md"
                style={{
                  backgroundColor: isCozyMode ? "#C4A77D" : "#D4A574",
                  clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
                }}
              />
              {/* Stem */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-1 h-8 sm:h-10 md:h-12 rounded-t-full -top-8 sm:-top-10 md:-top-12"
                style={{ backgroundColor: isCozyMode ? "#6B8E23" : "#7FAD5D" }}
              />
              {/* Leaves */}
              <motion.div
                className="absolute -top-6 sm:-top-7 md:-top-8 left-0 w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 rounded-full shadow-sm"
                style={{ backgroundColor: isCozyMode ? "#8FBC8F" : "#90D690" }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
              />
              <motion.div
                className="absolute -top-8 sm:-top-9 md:-top-10 right-0 w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 rounded-full shadow-sm"
                style={{ backgroundColor: isCozyMode ? "#8FBC8F" : "#90D690" }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Footer Tagline */}
        <motion.p
          className="text-center mt-8 text-xs italic"
          style={{ color: isCozyMode ? "#8B7D6F" : "#9CA3AF" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Your cozy reading corner awaits ☕📚
        </motion.p>
      </div>

      {/* Candle Flicker in Dark Cozy Mode */}
      {isCozyMode && (
        <motion.div
          className="absolute bottom-6 right-8 sm:right-12"
          animate={{
            opacity: [0.7, 1, 0.8, 0.95, 0.7],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative">
            {/* Flame */}
            <motion.div
              className="w-3 sm:w-4 h-5 sm:h-6 rounded-t-full"
              style={{
                backgroundColor: "#F6C98B",
                boxShadow: "0 0 15px rgba(246, 201, 139, 0.6)",
              }}
              animate={{
                scaleY: [1, 1.12, 0.95, 1.08, 1],
                scaleX: [1, 0.92, 1.05, 0.96, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Candle wax */}
            <div
              className="w-5 sm:w-6 h-8 sm:h-10 rounded-b-lg -mt-1 shadow-sm"
              style={{ backgroundColor: "#E8DCC7" }}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
