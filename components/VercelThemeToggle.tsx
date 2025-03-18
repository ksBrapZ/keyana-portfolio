"use client";

import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { Moon, Sun, Monitor } from "lucide-react";

export function VercelThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-secondary/50 rounded-full p-0.5 text-muted-foreground">
      <button
        className={cn(
          "flex items-center justify-center rounded-full p-1.5 transition-colors",
          theme === "light" ? "bg-background text-foreground" : "hover:text-foreground"
        )}
        onClick={() => setTheme("light")}
        aria-label="Light mode"
      >
        <Sun className="h-3.5 w-3.5" />
      </button>
      
      <button
        className={cn(
          "flex items-center justify-center rounded-full p-1.5 transition-colors",
          theme === "dark" ? "bg-background text-foreground" : "hover:text-foreground"
        )}
        onClick={() => setTheme("dark")}
        aria-label="Dark mode"
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
      
      <button
        className={cn(
          "flex items-center justify-center rounded-full p-1.5 transition-colors",
          theme === "system" ? "bg-background text-foreground" : "hover:text-foreground"
        )}
        onClick={() => setTheme("system")}
        aria-label="System theme"
      >
        <Monitor className="h-3.5 w-3.5" />
      </button>
    </div>
  );
} 