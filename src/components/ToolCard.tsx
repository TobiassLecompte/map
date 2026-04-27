"use client";

import { memo } from "react";
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
  index?: number;
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

// Cache favicon URLs to avoid recomputation
const faviconCache = new Map<string, string | null>();
function getFaviconUrl(url: string): string | null {
  if (faviconCache.has(url)) return faviconCache.get(url)!;
  try {
    const domain = new URL(url).hostname;
    const result = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    faviconCache.set(url, result);
    return result;
  } catch {
    faviconCache.set(url, null);
    return null;
  }
}

export const ToolCard = memo(function ToolCard({ tool, viewMode = "grid", index = 0 }: ToolCardProps) {
  // Determine icon strategy
  const mappedIcon = iconMap[tool.icon];
  const isDirectIconify = tool.icon && tool.icon.includes(":");
  const iconName = mappedIcon || (isDirectIconify ? tool.icon : null);
  const faviconUrl = !iconName ? getFaviconUrl(tool.url) : null;

  // Stagger delay: cap at 20 items so later items don't wait forever
  const staggerDelay = Math.min(index, 20) * 0.03;

  return (
    <motion.a
      layout
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300 ease-out flex overflow-hidden will-change-transform ${
        viewMode === "compact" ? "p-4 items-center gap-4" : "p-5 flex-col block"
      }`}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`absolute right-4 opacity-0 group-hover:opacity-100 transform transition-all duration-300 text-indigo-500 z-10 ${
        viewMode === "compact" 
          ? "top-1/2 -translate-y-1/2 translate-x-2 group-hover:translate-x-0" 
          : "top-4 translate-x-2 group-hover:translate-x-0"
      }`}>
        <ExternalLink size={18} />
      </div>
      
      <div className={`${viewMode === "compact" ? "" : "flex items-start justify-between mb-4"}`}>
        <div 
          className={`${viewMode === "compact" ? "w-10 h-10 text-xl" : "w-12 h-12 text-2xl"} rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center border border-slate-100 dark:border-slate-700/50 group-hover:scale-110 transition-transform duration-300 ease-out flex-shrink-0 overflow-hidden`}
        >
          {iconName ? (
            <Icon icon={iconName} />
          ) : faviconUrl ? (
            <img 
              src={faviconUrl} 
              alt={tool.name}
              loading="lazy"
              className="w-2/3 h-2/3 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://api.iconify.design/lucide:globe.svg";
              }}
            />
          ) : (
            <Icon icon="lucide:globe" />
          )}
        </div>
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className={`font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate ${viewMode === "compact" ? "text-base pr-6" : "text-lg mb-1 pr-6"}`}>
          {tool.name}
        </h3>
        {viewMode !== "compact" && (
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate leading-relaxed">
            {tool.description}
          </p>
        )}
      </div>
    </motion.a>
  );
});
