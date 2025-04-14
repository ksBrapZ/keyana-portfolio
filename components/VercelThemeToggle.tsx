"use client";

import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function VercelThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  
  useEffect(() => {
    // Check system preference
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(darkModeMediaQuery.matches);
    
    // Add listener for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    
    darkModeMediaQuery.addEventListener('change', handleChange);
    
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // This effectively gives us the actual applied theme, regardless of whether
  // it's explicitly set or derived from system preferences
  const effectiveTheme = theme === "system" 
    ? (systemPrefersDark ? "dark" : "light") 
    : theme;

  return (
    <div className="flex items-center bg-secondary/50 rounded-full p-0.5 text-muted-foreground">
      <button
        className={cn(
          "flex items-center justify-center rounded-full p-1.5 transition-colors",
          effectiveTheme === "light"
            ? "bg-background text-foreground" 
            : "hover:text-foreground"
        )}
        onClick={() => setTheme("light")}
        aria-label="Light mode"
      >
        <Sun className="h-3.5 w-3.5" />
      </button>
      
      <button
        className={cn(
          "flex items-center justify-center rounded-full p-1.5 transition-colors",
          effectiveTheme === "dark"
            ? "bg-background text-foreground" 
            : "hover:text-foreground"
        )}
        onClick={() => setTheme("dark")}
        aria-label="Dark mode"
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
} 