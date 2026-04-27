"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, User, PenTool, Layout, Monitor, Globe, Settings, Cpu, X, Lightbulb, Package, Users } from "lucide-react";
import data from "@/data/tools.json";
import avatar from "@/app/avatar.png";

const categoryIcons: Record<string, React.ReactNode> = {
  design: <PenTool size={18} />,
  dev: <Monitor size={18} />,
  ai: <Cpu size={18} />,
  productivity: <Layout size={18} />,
  inspiration: <Lightbulb size={18} />,
  resource: <Package size={18} />,
  community: <Users size={18} />,
};

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ activeCategory, onSelectCategory, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-full w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-r border-slate-200 dark:border-slate-700 flex flex-col pt-6 flex-shrink-0 z-[70] transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
              <Compass size={20} />
            </div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              Inspire Station
            </h1>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => {
              onSelectCategory("all");
              onClose?.();
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
              activeCategory === "all"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            )}
          >
            {activeCategory === "all" && (
              <motion.div
                layoutId="active-nav"
                className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-3">
              <Globe size={18} />
              全部网站
            </span>
          </button>

          {data.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onSelectCategory(category.id);
                onClose?.();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
                activeCategory === category.id
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              )}
            >
              {activeCategory === category.id && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3 w-full">
                {categoryIcons[category.id] || <Settings size={18} />}
                <span className="flex-1 text-left">{category.name}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">
                  {data.tools.filter((t) => t.categoryId === category.id).length}
                </span>
              </span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-700">
          <a 
            href="https://tobiasys.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full px-2 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center overflow-hidden">
               <img src={avatar.src} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-medium text-slate-900 dark:text-white">Tobias</span>
              <span className="text-xs opacity-70">去我的小站看看</span>
            </div>
          </a>
        </div>
      </aside>
    </>
  );
}
