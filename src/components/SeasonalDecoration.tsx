"use client";

import { useEffect, useState } from "react";
import { Snowflake, Sparkles, Music, Ghost, Flower, Star, PartyPopper, Info, Umbrella, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SeasonalDecoration({ message }: { message: string | null }) {
  const [theme, setTheme] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          setTheme(document.documentElement.getAttribute("data-theme") || "");
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    setTheme(document.documentElement.getAttribute("data-theme") || "");

    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  const renderElements = () => {
    let count = 50;
    const particles = [];

    for (let i = 0; i < count; i++) {
      let content = null;
      let color = "text-white/30";
      let isEaster = theme === "easter";

      if (isEaster) {
        const isLion = i % 2 === 0;
        content = (
          <span style={{ fontSize: '24px', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.2))' }}>
            {isLion ? '🦁' : '🐑'}
          </span>
        );
        color = ""; // Emojis já têm cor própria
      } else {
        let Icon = Snowflake;
        switch (theme) {
          case "carnival":
            Icon = Umbrella;
            const carnivalColors = ["text-yellow-400/40", "text-red-400/40", "text-blue-400/40", "text-green-400/40"];
            color = carnivalColors[i % carnivalColors.length];
            break;
          case "halloween":
            Icon = Ghost;
            color = "text-purple-400/20";
            break;
          case "christmas":
          case "newyear":
            Icon = Snowflake;
            color = "text-white/30";
            break;
          default:
            Icon = Star;
            color = "text-white/10";
        }
        content = <Icon size={Math.random() * 15 + 10} />;
      }

      particles.push(
        <motion.div
          key={`particle-${theme}-${i}`}
          initial={{ y: -50, opacity: 0 }}
          animate={{ 
            y: "110vh", 
            opacity: [0, 0.2, 0.2, 0],
            x: [0, Math.random() * 100 - 50],
            rotate: theme === "easter" ? 0 : 360
          }}
          transition={{ 
            duration: Math.random() * 15 + 10, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 20
          }}
          style={{ 
            position: 'fixed',
            left: `${Math.random() * 100}%`,
            top: -50,
            zIndex: 0,
            pointerEvents: 'none',
          }}
          className={color}
        >
          {content}
        </motion.div>
      );
    }
    return particles;
  };

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
        <AnimatePresence>
          {renderElements()}
        </AnimatePresence>
      </div>

      {message && (
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[99] w-full max-w-lg px-4 pointer-events-none"
        >
          <div className="bg-primary/10 backdrop-blur-xl border border-primary/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto">
            <div className="bg-primary/20 p-2 rounded-xl text-primary shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <p className="text-sm font-medium text-white/90 leading-relaxed">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}
