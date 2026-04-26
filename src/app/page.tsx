"use client";

import { useState, useMemo, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ToolCard } from "@/components/ToolCard";
import { BackToTop } from "@/components/BackToTop";
import data from "@/data/tools.json";
import { DotPatternBackground } from "@/components/DotPatternBackground";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredTools = useMemo(() => {
    return data.tools.filter((tool) => {
      const matchesCategory =
        activeCategory === "all" || tool.categoryId === activeCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex h-[100dvh] bg-slate-50 dark:bg-[#0a0a0a] overflow-hidden selection:bg-indigo-500/30">
      <Sidebar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 h-full relative z-0">
        <DotPatternBackground />
        
        {/* Background gradient effect */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-900/10 dark:to-transparent pointer-events-none -z-10" />
        
        <Header 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onMenuToggle={() => setIsMobileMenuOpen(true)}
        />
        
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 md:px-8 pb-12 pt-4 scroll-smooth">
          {/* 我的常用 */}
          {activeCategory === "all" && !searchQuery && (
            <div className="mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">⭐</span> 我的常用
              </h2>
              <motion.div 
                layout
                className={`grid gap-4 md:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {data.tools
                    .filter((tool) => ["figma", "notion", "colorhexa"].includes(tool.name.toLowerCase()))
                    .map((tool) => (
                      <motion.div
                        key={`fav-${tool.id}`}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ToolCard tool={tool} viewMode={viewMode} />
                      </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              {activeCategory === "all" 
                ? "全部工具" 
                : data.categories.find(c => c.id === activeCategory)?.name}
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm py-1 px-3 rounded-full font-medium">
                {filteredTools.length}
              </span>
            </h2>
          </div>

          {filteredTools.length > 0 ? (
              <motion.div 
                layout
                className={`grid gap-4 md:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                }`}
              >
              <AnimatePresence mode="popLayout">
                {filteredTools.map((tool) => (
                  <motion.div
                    key={tool.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ToolCard tool={tool} viewMode={viewMode} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500">
              <p className="text-lg">未找到匹配的工具</p>
            </div>
          )}
        </div>
        <BackToTop scrollContainerRef={scrollContainerRef} />
      </main>
    </div>
  );
}
