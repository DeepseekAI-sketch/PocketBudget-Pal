
import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme, useLanguage } from "@/lib/contexts";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full bg-background"
      aria-label={t(theme === "light" ? "theme.toggle.dark" : "theme.toggle.light")}
      title={t(theme === "light" ? "theme.toggle.dark" : "theme.toggle.light")}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
        key={theme}
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </motion.div>
    </Button>
  );
};

export default ThemeToggle;
