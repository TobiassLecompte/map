# LARKMAP 网站工具集合平台 🚀

这是一个现代化、高质感、带有极其流畅交互体验的网站工具收集展示应用。本项目采用最新前端技术栈打造，旨在为您打造一个可自由定制的私人/团队网站导航首页。

---

## 🛠 技术栈 (Tech Stack)

本项目使用最新的前端最佳实践搭建：

- **框架**: [Next.js 15 (React)](https://nextjs.org/) - 采用最新的 App Router，带来极速的页面渲染和优秀的开发体验。
- **样式**: [Tailwind CSS v4](https://tailwindcss.com/) - 实用优先的 CSS 框架，利用最新的 v4 特性实现极致丝滑的深/浅色主题。
- **动效**: [Framer Motion](https://www.framer.com/motion/) - 工业级动画库，实现卡片的平滑过渡、微交互与精准的 Layout 共享动画。
- **图标系统**:
  - [Lucide React](https://lucide.dev/) - 用于干净、一致的 UI 系统图标（如搜索、布局切换、侧边栏标识）。
  - [Iconify React](https://iconify.design/) - 用于还原各大知名工具的真实品牌 Logo（如 Figma, Notion, ChatGPT）。
- **状态与数据管理**: 原生 React Hooks + 轻量级 `JSON` 数据驱动。

---

## 📁 项目结构 (Project Structure)

```text
📂 src
 ┣ 📂 app              # Next.js 页面与全局配置
 ┃ ┣ 📜 globals.css    # 👑 核心样式：包含全局重置、深浅模式的自定义色彩变量
 ┃ ┣ 📜 layout.tsx     # 根布局容器 (包含字体加载、HTML骨架)
 ┃ ┗ 📜 page.tsx       # 🏠 核心首页逻辑 (搜索、过滤、视图切换、状态管理)
 ┃
 ┣ 📂 components       # 独立 UI 组件
 ┃ ┣ 📜 Header.tsx     # 顶部栏 (全局搜索、主题切换、视图切换)
 ┃ ┣ 📜 Sidebar.tsx    # 侧边栏 (分类列表、分类数量实时统计、个人主页入口)
 ┃ ┗ 📜 ToolCard.tsx   # 工具卡片 (展示工具 Logo、简介，以及复杂的响应式动效逻辑)
 ┃
 ┣ 📂 data             # 本地数据库
 ┃ ┗ 📜 tools.json     # 📝 所有网站的数据源 (分类与工具列表)
 ┃
 ┗ 📂 lib              # 工具函数
   ┗ 📜 utils.ts       # className 拼接函数 (clsx + tailwind-merge)
```

---

## ⚙️ 可自定义配置指南

您可以根据个人喜好或品牌需求，轻松修改以下文件，快速定制出独一无二的网站。

### 1. 修改网站数据 (分类与工具)
**👉 目标文件：`src/data/tools.json`**

这是整个平台的数据大脑。您可以在其中：
- `categories`: 添加或修改工具分类（注意：新增分类的 `id` 将在后续用于分类筛选）。
- `tools`: 增加您收集的网站。每个网站需提供以下属性：
  - `name`: 网站名称。
  - `description`: 一句话简介（超出会自动省略号隐藏）。
  - `categoryId`: 对应上述 `categories` 里的 `id`。
  - `url`: 点击跳转的目标链接。
  - `icon`: 对应下面将提到的 `iconMap` 标识符。

### 2. 修改网站品牌色彩 & 主题
**👉 目标文件：`src/app/globals.css`**

在这个文件中，你会看到 `:root` 和 `:root.dark` 两个部分。您可以自定义主题：
- `--background` & `--foreground`: 决定了页面的大底色和文字主颜色。
- `--accent` & `--accent-hover`: 这是网站的“品牌高亮色”（目前是靛蓝色 Indigo）。您可以将其更改为品牌色（例如绿色 `#10b981` 等），所有高亮按钮、Hover 状态都会**自动适配**。

### 3. 配置真实网站 Logo (Iconify)
**👉 目标文件：`src/components/ToolCard.tsx`**

在这个文件的开头部分，有一个 `iconMap` 变量：
```ts
const iconMap: Record<string, string> = {
  figma: "logos:figma",
  sketch: "logos:sketch",
  // ... 添加新的 Logo
};
```
当您在 `tools.json` 里写了一个 `icon: "xxx"` 时，就会在这里匹配寻找对应的真实 Logo。
> **去哪里找 Logo 代码？**
> 访问 [Iconify 官网](https://icon-sets.iconify.design/) 搜索你想要的品牌（如 Github），复制类似 `logos:github-icon` 的名称填入这里即可。

### 4. 定制侧边栏分类图标 & 个人信息
**👉 目标文件：`src/components/Sidebar.tsx`**

- **分类图标**: 开头的 `categoryIcons` 对象决定了不同分类旁边的那个黑白小图标（由 Lucide 驱动）。如果你在 `tools.json` 里添加了新分类，可以在这里加个对应的新图标。
- **个人名片**: 文件最底部，现在是您个人的小卡片（如：`Tobias` / `去我的小站看看`），您可以直接修改这里的文案、头像图标和跳转链接，把它变成您的个人名片。
