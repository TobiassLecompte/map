"use client";

import { Search, Moon, Sun, LayoutGrid, List, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import data from "@/data/tools.json";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "grid" | "compact";
  onViewModeChange: (mode: "grid" | "compact") => void;
  onMenuToggle?: () => void;
}

export function Header({ 
  searchQuery, 
  onSearchChange, 
  viewMode, 
  onViewModeChange,
  onMenuToggle 
}: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const totalCount = data.tools.length;
  const displayCount = totalCount > 100 ? "99+" : totalCount;

  useEffect(() => {
    // 默认使用浅色模式，除非显式存在 dark 类
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <header className="h-20 px-4 md:px-8 flex items-center justify-between bg-transparent w-full z-10 gap-4">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <button 
          onClick={onMenuToggle}
          className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div className="relative group flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder={`站内搜索 ${displayCount} 个网站...`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm group-hover:shadow-md"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <div className="flex gap-1">
              <kbd className="hidden lg:inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded px-1.5 py-0.5 text-[10px] font-medium font-sans">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button
          onClick={() => onViewModeChange(viewMode === "grid" ? "compact" : "grid")}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
          aria-label="Toggle view mode"
        >
          {viewMode === "grid" ? <List size={18} /> : <LayoutGrid size={18} />}
        </button>

        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
