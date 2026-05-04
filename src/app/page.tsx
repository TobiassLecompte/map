"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ToolCard, Tool } from "@/components/ToolCard";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface ToolsData {
  categories: Category[];
  tools: Tool[];
}
import { SortableToolCard } from "@/components/SortableToolCard";
import { BackToTop } from "@/components/BackToTop";
import { DotPatternBackground } from "@/components/DotPatternBackground";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

// Ensure every tool has a unique id (fallback for data without id field)
function ensureToolIds(tools: Partial<Tool>[]): Tool[] {
  return tools.map((tool, index) => ({
    id: tool.id || tool.url || `tool-${index}-${Math.random().toString(36).slice(2, 8)}`,
    name: tool.name || 'Untitled',
    description: tool.description || '',
    categoryId: tool.categoryId || 'productivity',
    url: tool.url || '#',
    icon: tool.icon || 'logos:javascript',
    subCategory: tool.subCategory,
    isFavorite: tool.isFavorite,
  }));
}

export default function Home() {
  const [data, setData] = useState<ToolsData>({ categories: [], tools: [] });
  const [originalToolIds, setOriginalToolIds] = useState<string[]>([]); // snapshot of initial order
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check if order has changed compared to initial fetch
  const isDirty = useMemo(() => {
    if (originalToolIds.length === 0) return false;
    const currentIds = data.tools.map(t => t.id);
    if (currentIds.length !== originalToolIds.length) return true;
    return currentIds.some((id, i) => id !== originalToolIds[i]);
  }, [data.tools, originalToolIds]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    fetch('/api/bookmarks')
      .then(res => res.json())
      .then(json => {
        if (!json.error) {
          const tools = ensureToolIds(json.tools || []);
          setData({
            categories: json.categories || [],
            tools,
          });
          setOriginalToolIds(tools.map(t => t.id)); // snapshot
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setData((prev) => {
        const activeIdStr = active.id.toString().replace(/^(fav-|all-)/, '');
        const overIdStr = over.id.toString().replace(/^(fav-|all-)/, '');
        
        const oldIndex = prev.tools.findIndex((t) => t.id === activeIdStr);
        const newIndex = prev.tools.findIndex((t) => t.id === overIdStr);
        
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
          return prev;
        }

        const newTools = arrayMove(prev.tools, oldIndex, newIndex);
        // Only local state update — no auto-fetch
        return { ...prev, tools: newTools };
      });
    }
  };

  const handleSaveOrder = useCallback(async (toolsToSave?: Tool[]) => {
    // 1. Get or prompt for admin secret
    let secret = localStorage.getItem('ADMIN_SECRET');
    if (!secret) {
      const input = window.prompt('请输入管理员密钥 (API_SECRET) 以覆盖保存：');
      if (!input) return; // user cancelled
      secret = input;
      localStorage.setItem('ADMIN_SECRET', secret);
    }

    const payload = toolsToSave || data.tools;

    // 2. Send the request
    setIsSaving(true);
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secret}`
        },
        body: JSON.stringify({ action: 'update_all', payload })
      });

      if (res.ok) {
        // Sync the snapshot so button hides
        setOriginalToolIds(payload.map(t => t.id));
        setToast({ message: '✅ 更新已同步至云端', type: 'success' });
      } else if (res.status === 401) {
        localStorage.removeItem('ADMIN_SECRET');
        setToast({ message: '❌ 密钥错误，请重试', type: 'error' });
      } else {
        setToast({ message: `⚠️ 保存失败：状态码 ${res.status}`, type: 'error' });
      }
    } catch (err) {
      setToast({ message: '❌ 网络异常，保存失败', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  }, [data.tools]);

  const handleDelete = useCallback((id: string) => {
    const updatedTools = data.tools.filter(t => t.id !== id);
    setData(prev => ({ ...prev, tools: updatedTools }));
    // 自动触发同步
    handleSaveOrder(updatedTools);
  }, [data.tools, handleSaveOrder]);

  const filteredTools = useMemo(() => {
    return data.tools.filter((tool) => {
      const matchesCategory =
        activeCategory === "all" || tool.categoryId === activeCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [data.tools, activeCategory, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex h-[100dvh] bg-slate-50 dark:bg-[#0a0a0a] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

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
          isEditing={isEditing}
          onEditToggle={() => setIsEditing(prev => !prev)}
        />
        
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 md:px-8 pb-12 pt-4 scroll-smooth">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {/* 我的常用 */}
            {activeCategory === "all" && !searchQuery && (
              <div className="mb-10">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">⭐</span> 我的常用
                </h2>
                <SortableContext 
                  items={data.tools.filter((tool) => tool.isFavorite).map(t => `fav-${t.id}`)}
                  strategy={rectSortingStrategy}
                >
                  <div 
                    className={`grid gap-4 md:gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                    }`}
                  >
                      {data.tools
                        .filter((tool) => tool.isFavorite)
                        .map((tool) => (
                          <SortableToolCard key={`fav-${tool.id}`} sortableId={`fav-${tool.id}`} tool={tool} viewMode={viewMode} isEditing={isEditing} onDelete={handleDelete} />
                      ))}
                  </div>
                </SortableContext>
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
                  (Object.entries(
                    filteredTools.reduce<Record<string, Tool[]>>((acc, tool) => {
                      const sub = tool.subCategory || "核心工具";
                      if (!acc[sub]) acc[sub] = [];
                      acc[sub].push(tool);
                      return acc;
                    }, {})
                  ) as [string, Tool[]][]).sort(([a], [b]) => {
                    const order = ['核心工具', '设计灵感', '设计资源', '设计社区'];
                    const iA = order.indexOf(a) === -1 ? 99 : order.indexOf(a);
                    const iB = order.indexOf(b) === -1 ? 99 : order.indexOf(b);
                    return iA - iB;
                  }).map(([subCategory, tools]) => (
                    <div key={subCategory} id={subCategory} className="mb-10 scroll-mt-24">
                      {subCategory !== "核心工具" && (
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">{subCategory}</h3>
                      )}
                      <SortableContext 
                        items={tools.map(t => `all-${t.id}`)}
                        strategy={rectSortingStrategy}
                      >
                        <div 
                          className={`grid gap-4 md:gap-6 ${
                            viewMode === "grid"
                              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                          }`}
                        >
                          {tools.map((tool) => (
                            <SortableToolCard key={`all-${tool.id}`} sortableId={`all-${tool.id}`} tool={tool} viewMode={viewMode} isEditing={isEditing} onDelete={handleDelete} />
                          ))}
                        </div>
                      </SortableContext>
                    </div>
                  ))
                ) : (
                <SortableContext 
                  items={filteredTools.map(t => `all-${t.id}`)}
                  strategy={rectSortingStrategy}
                >
                  <div 
                    className={`grid gap-4 md:gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                    }`}
                  >
                    {filteredTools.map((tool) => (
                      <SortableToolCard key={`all-${tool.id}`} sortableId={`all-${tool.id}`} tool={tool} viewMode={viewMode} isEditing={isEditing} onDelete={handleDelete} />
                    ))}
                  </div>
                </SortableContext>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500">
                <p className="text-lg">未找到匹配的工具</p>
              </div>
            )}
          </DndContext>
        </div>
        <BackToTop scrollContainerRef={scrollContainerRef} />

        {/* Floating Save Button — only visible when order has changed */}
        {isEditing && isDirty && (
          <button
            onClick={() => handleSaveOrder()}
            disabled={isSaving}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed animate-in fade-in slide-in-from-bottom-4"
          >
            {isSaving ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                保存中...
              </>
            ) : (
              <>💾 保存当前排序</>
            )}
          </button>
        )}

        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
              toast.type === 'success'
                ? 'bg-emerald-600 shadow-emerald-500/30'
                : 'bg-red-600 shadow-red-500/30'
            }`}
          >
            {toast.message}
          </div>
        )}
      </main>
    </div>
  );
}
