"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Icon } from "@iconify/react";

interface Tool {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  url: string;
  icon: string;
}

interface ToolCardProps {
  tool: Tool;
  viewMode?: "grid" | "compact";
}

// Map local icon strings to Iconify icon names for better logos
const iconMap: Record<string, string> = {
  // Design
  figma: "logos:figma",
  pixso: "logos:pixso",
  modao: "mingcute:layout-line",
  sketch: "logos:sketch",
  adobe: "logos:adobe-xd",
  uizard: "logos:uizard-icon",
  uxbot: "logos:uxbot",
  framer: "logos:framer",
  
  // Dev
  nextjs: "logos:nextjs-icon",
  tailwind: "logos:tailwindcss-icon",
  vscode: "logos:visual-studio-code",
  cursor: "simple-icons:cursor",
  github: "logos:github-icon",
  trae: "simple-icons:bytedance",
  codeium: "logos:codeium",
  tabnine: "logos:tabnine",
  claude: "logos:claude",
  replit: "logos:replit-icon",
  postman: "logos:postman-icon",
  docker: "logos:docker-icon",
  supabase: "logos:supabase-icon",
  langchain: "simple-icons:langchain",
  jetbrains: "logos:jetbrains-icon",
  
  // AI
  openai: "logos:openai-icon",
  anthropic: "logos:anthropic-icon",
  google: "logos:google-icon",
  midjourney: "simple-icons:midjourney",
  stability: "simple-icons:stabilityai",
  notion: "logos:notion-icon",
  gptnet: "simple-icons:openai",
  perplexity: "simple-icons:perplexity",
  xai: "simple-icons:x",
  runway: "simple-icons:runway",
  suno: "simple-icons:suno",
  
  // Productivity
  obsidian: "logos:obsidian-icon",
  clickup: "logos:clickup-icon",
  asana: "logos:asana-icon",
  monday: "logos:monday-icon",
  todoist: "logos:todoist-icon",
  trello: "logos:trello",
  slack: "logos:slack-icon",
  worktile: "simple-icons:worktile",
  feishu: "simple-icons:lark",
  linear: "logos:linear-icon",
  nuclino: "simple-icons:nuclino",
  colorhexa: "noto:artist-palette",
};

export function ToolCard({ tool, viewMode = "grid" }: ToolCardProps) {
  const iconName = iconMap[tool.icon] || "logos:javascript";

  return (
    <motion.a
      layout
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-colors duration-300 ease-out flex overflow-hidden ${
        viewMode === "compact" ? "p-4 items-center gap-4" : "p-5 flex-col block"
      }`}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ layout: { duration: 0.3, type: "spring", bounce: 0.2 } }}
    >
      <div className={`absolute right-4 opacity-0 group-hover:opacity-100 transform transition-all duration-300 text-indigo-500 z-10 ${
        viewMode === "compact" 
          ? "top-1/2 -translate-y-1/2 translate-x-2 group-hover:translate-x-0" 
          : "top-4 translate-x-2 group-hover:translate-x-0"
      }`}>
        <ExternalLink size={18} />
      </div>
      
      <motion.div layout className={`${viewMode === "compact" ? "" : "flex items-start justify-between mb-4"}`}>
        <motion.div 
          layout 
          className={`${viewMode === "compact" ? "w-10 h-10 text-xl" : "w-12 h-12 text-2xl"} rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center border border-slate-100 dark:border-slate-700/50 group-hover:scale-110 transition-colors duration-300 ease-out flex-shrink-0`}
        >
          <Icon icon={iconName} />
        </motion.div>
      </motion.div>
      
      <motion.div layout className="flex-1 min-w-0 flex flex-col justify-center">
        <motion.h3 layout className={`font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate ${viewMode === "compact" ? "text-base pr-6" : "text-lg mb-1 pr-6"}`}>
          {tool.name}
        </motion.h3>
        <AnimatePresence initial={false}>
          {viewMode !== "compact" && (
            <motion.p 
              layout
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 4 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-slate-500 dark:text-slate-400 truncate leading-relaxed"
            >
              {tool.description}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.a>
  );
}
