"use client";

import { useState, useMemo, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ToolCard } from "@/components/ToolCard";
import { BackToTop } from "@/components/BackToTop";
import data from "@/data/tools.json";
import { DotPatternBackground } from "@/components/DotPatternBackground";

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
              <div 
                className={`grid gap-4 md:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                }`}
              >
                  {data.tools
                    .filter((tool) => (tool as any).isFavorite)
                    .map((tool) => (
                      <div key={`fav-${tool.id}`}>
                        <ToolCard tool={tool} viewMode={viewMode} />
                      </div>
                  ))}
              </div>
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
            activeCategory === "design" ? (
              Object.entries(
                filteredTools.reduce((acc, tool) => {
                  const sub = (tool as any).subCategory || "核心工具";
                  if (!acc[sub]) acc[sub] = [];
                  acc[sub].push(tool);
                  return acc;
                }, {} as Record<string, typeof filteredTools>)
              ).sort(([a], [b]) => {
                const order = ['核心工具', '设计灵感', '设计资源', '设计社区'];
                const iA = order.indexOf(a) === -1 ? 99 : order.indexOf(a);
                const iB = order.indexOf(b) === -1 ? 99 : order.indexOf(b);
                return iA - iB;
              }).map(([subCategory, tools]) => (
                <div key={subCategory} id={subCategory} className="mb-10 scroll-mt-24">
                  {subCategory !== "核心工具" && (
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">{subCategory}</h3>
                  )}
                  <div 
                    className={`grid gap-4 md:gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                    }`}
                  >
                    {tools.map((tool) => (
                      <div key={tool.id}>
                        <ToolCard tool={tool} viewMode={viewMode} />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div 
                className={`grid gap-4 md:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                }`}
              >
                {filteredTools.map((tool) => (
                  <div key={tool.id}>
                    <ToolCard tool={tool} viewMode={viewMode} />
                  </div>
                ))}
            </div>
            )
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
