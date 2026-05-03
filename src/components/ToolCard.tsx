"use client";

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
  "figma": "logos:figma",
  "pixso": "logos:pixso",
  "modao": "mingcute:layout-line",
  "sketch": "logos:sketch",
  "adobe": "logos:adobe-xd",
  "uizard": "logos:uizard-icon",
  "uxbot": "logos:uxbot",
  "framer": "logos:framer",
  "nextjs": "logos:nextjs-icon",
  "tailwind": "logos:tailwindcss-icon",
  "vscode": "logos:visual-studio-code",
  "cursor": "simple-icons:cursor",
  "github": "logos:github-icon",
  "trae": "simple-icons:bytedance",
  "codeium": "logos:codeium",
  "tabnine": "logos:tabnine",
  "claude": "logos:claude",
  "replit": "logos:replit-icon",
  "postman": "logos:postman-icon",
  "docker": "logos:docker-icon",
  "supabase": "logos:supabase-icon",
  "langchain": "simple-icons:langchain",
  "jetbrains": "logos:jetbrains-icon",
  "openai": "logos:openai-icon",
  "anthropic": "logos:anthropic-icon",
  "google": "logos:google-icon",
  "midjourney": "simple-icons:midjourney",
  "stability": "simple-icons:stabilityai",
  "notion": "logos:notion-icon",
  "gptnet": "simple-icons:openai",
  "perplexity": "simple-icons:perplexity",
  "xai": "simple-icons:x",
  "runway": "simple-icons:runway",
  "suno": "simple-icons:suno",
  "obsidian": "logos:obsidian-icon",
  "clickup": "logos:clickup-icon",
  "asana": "logos:asana-icon",
  "monday": "logos:monday-icon",
  "todoist": "logos:todoist-icon",
  "trello": "logos:trello",
  "slack": "logos:slack-icon",
  "worktile": "simple-icons:worktile",
  "feishu": "simple-icons:lark",
  "linear": "logos:linear-icon",
  "nuclino": "simple-icons:nuclino",
  "colorhexa": "noto:artist-palette",
  "canva": "logos:canva",
  "affinity": "simple-icons:affinity",
  "gravit": "simple-icons:gravitdesigner",
  "vectr": "simple-icons:vectr",
  "craft": "logos:craft",
  "invision": "logos:invision-icon",
  "protopie": "logos:protopie",
  "principle": "logos:principle",
  "lunacy": "simple-icons:lunacy",
  "photoshop": "logos:adobe-photoshop",
  "gimp": "logos:gimp",
  "sai": "simple-icons:painttoolsai",
  "clipstudiopaint": "simple-icons:clipstudiopaint",
  "procreate": "simple-icons:procreate",
  "blender": "logos:blender",
  "cinema4d": "simple-icons:cinema4d",
  "aftereffects": "logos:adobe-after-effects",
  "lottie": "logos:lottiefiles",
  "behance": "logos:behance",
  "dribbble": "logos:dribbble-icon",
  "pinterest": "logos:pinterest",
  "awwwards": "simple-icons:awwwards",
  "siteinspire": "simple-icons:siteinspire",
  "onepagelove": "simple-icons:onepagelove",
  "minimalgallery": "simple-icons:minimalgallery",
  "designspiration": "simple-icons:designspiration",
  "niice": "simple-icons:niice",
  "Muzli": "simple-icons:muzli",
  "landbook": "simple-icons:landbook",
  "uimovement": "simple-icons:uimovement",
  "collectui": "simple-icons:collectui",
  "designerio": "simple-icons:designerio",
  "cargo": "simple-icons:cargo",
  "squarespace": "simple-icons:squarespace",
  "wix": "logos:wix",
  "webflow": "logos:webflow",
  "readymag": "simple-icons:readymag",
  "unsplash": "logos:unsplash",
  "pexels": "simple-icons:pexels",
  "pixabay": "simple-icons:pixabay",
  "freepik": "simple-icons:freepik",
  "flaticon": "simple-icons:flaticon",
  "icons8": "simple-icons:icons8",
  "fontawesome": "logos:font-awesome",
  "heroicons": "simple-icons:heroicons",
  "lucide": "simple-icons:lucide",
  "tabler": "simple-icons:tabler",
  "googlefonts": "logos:google-fonts",
  "adobefonts": "logos:adobe-fonts",
  "notosans": "logos:google-fonts",
  "zcool": "simple-icons:zcool",
  "qiuziti": "simple-icons:qiuziti",
  "adobecolor": "logos:adobe",
  "coolors": "simple-icons:coolors",
  "colorhunt": "simple-icons:colorhunt",
  "webgradients": "simple-icons:webgradients",
  "uigradients": "simple-icons:uigradients",
  "tintui": "simple-icons:tintui",
  "material": "logos:material-ui",
  "antdesign": "logos:ant-design",
  "shadcn": "simple-icons:shadcnui",
  "radix": "simple-icons:radixui",
  "headlessui": "simple-icons:headlessui",
  "chakra": "simple-icons:chakraui",
  "primeng": "simple-icons:primeng",
  "bootstrap": "logos:bootstrap",
  "storybook": "logos:storybook",
  "picsum": "simple-icons:picsum",
  "removebg": "simple-icons:removebg",
  "tinypng": "simple-icons:tinypng",
  "squoosh": "simple-icons:squoosh",
  "uicn": "simple-icons:uicn",
  "uisdc": "simple-icons:uisdc",
  "zhisheji": "simple-icons:zhisheji",
  "shejihao": "simple-icons:shejihao",
  "codrops": "simple-icons:codrops",
  "smashing": "simple-icons:smashingmagazine",
  "alistapart": "simple-icons:alistapart",
  "csstricks": "simple-icons:css3",
  "medium": "logos:medium-icon",
  "tencentcdc": "logos:tencent-qq",
  "aliued": "logos:alibaba",
  "wyyx": "logos:netease",
  "xueui": "simple-icons:xueui",
  "huke": "simple-icons:huke",
  "lanhu": "simple-icons:lanhu",
  "jike": "simple-icons:jike",
  "xiaohongshu": "simple-icons:xiaohongshu",
};

export function ToolCard({ tool, viewMode = "grid" }: ToolCardProps) {
  const iconName = iconMap[tool.icon] || "logos:javascript";

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] active:scale-95 flex overflow-hidden ${
        viewMode === "compact" ? "p-4 items-center gap-4" : "p-5 flex-col block"
      }`}
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
          className={`${viewMode === "compact" ? "w-10 h-10 text-xl" : "w-12 h-12 text-2xl"} rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center border border-slate-100 dark:border-slate-700/50 group-hover:scale-110 transition-transform duration-300 ease-out flex-shrink-0`}
        >
          <Icon icon={iconName} />
        </div>
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className={`font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate ${viewMode === "compact" ? "text-base pr-6" : "text-lg mb-1 pr-6"}`}>
          {tool.name}
        </h3>
        {viewMode !== "compact" && (
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate leading-relaxed mt-1 transition-opacity duration-300">
            {tool.description}
          </p>
        )}
      </div>
    </a>
  );
}
