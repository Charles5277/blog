import type { DefaultTheme } from "vitepress";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import matter from "gray-matter";

const sidebarConfigData = [
  {
    text: "Vue.js",
    collapsed: true,
    items: [
      { link: "vue/intro/" },
      { link: "vue/create-project/" },
      { link: "vue/v-bind" },
      { link: "vue/v-on" },
      { link: "vue/v-for" },
    ],
  },
  {
    text: "Nuxt",
    collapsed: true,
    items: [
      { link: "nuxt/nuxt-server-engine-nitro-h3" },
      { link: "nuxt/global-type" },
      { link: "nuxt/nuxt-import-static-file" },
    ],
  },
  {
    text: "Node.js",
    collapsed: true,
    items: [
      { link: "nodejs/nvm/" },
      { link: "nodejs/package-manager/" },
      { link: "nodejs/vite/" },
      { link: "nodejs/eslint/" },
    ],
  },
  {
    text: "VS Code",
    collapsed: true,
    items: [{ link: "vscode/intro/" }, { link: "vscode/note" }],
  },
  {
    text: "Git",
    collapsed: true,
    items: [{ link: "git/husky-and-commitlint" }, { link: "git/note" }],
  },
  {
    text: "Linux",
    collapsed: true,
    items: [
      { link: "linux/wsl/" },
      { link: "linux/ubuntu/note" },
      { link: "linux/ubuntu/sourcelist" },
      { link: "linux/ubuntu/sudo-no-password/" },
    ],
  },
  {
    text: "HTML",
    collapsed: true,
    items: [{ link: "html/note" }],
  },
  {
    text: "CSS",
    collapsed: true,
    items: [{ link: "css/note" }],
  },
];

const POST_PATH = path.resolve(process.cwd(), "docs", "post");

// 取得 FrontMatter
function getFrontMatter(filePath: string) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`文件不存在: ${filePath}`);
      return {};
    }

    const content = fs.readFileSync(filePath, "utf-8");
    if (!content.trim()) {
      console.warn(`文件為空: ${filePath}`);
      return {};
    }

    const { data } = matter(content);
    return data || {};
  } catch (error) {
    console.error(`讀取或解析文件 ${filePath} 時發生錯誤:`, error);
    return {};
  }
}

// 根據 link 路徑取得 text
function getTextFromLink(link: string): string {
  if (!link) {
    console.warn("getTextFromLink: 空的 link 參數");
    return "";
  }

  // 處理目錄型連結 (以 / 結尾)
  if (link.endsWith("/")) {
    const indexPath = path.join(POST_PATH, link, "index.md");
    if (fs.existsSync(indexPath)) {
      const frontmatter = getFrontMatter(indexPath);
      const title = frontmatter.title;
      if (title) {
        return title;
      }
      console.warn(`目錄 ${link} 的 index.md 沒有 title frontmatter`);
    } else {
      console.warn(`找不到目錄型連結的 index.md: ${indexPath}`);
    }
    // 目錄型連結的預設值：移除結尾斜線後取最後一段
    return link.replace(/\/$/, "").split("/").pop() || link;
  } else {
    // 處理文件型連結
    const filePath = path.join(POST_PATH, `${link}.md`);
    if (fs.existsSync(filePath)) {
      const frontmatter = getFrontMatter(filePath);
      const title = frontmatter.title;
      if (title) {
        return title;
      }
      console.warn(`文件 ${link} 沒有 title frontmatter`);
    } else {
      console.warn(`找不到文件: ${filePath}`);
    }
    // 文件型連結的預設值：取最後一段檔案名稱
    return link.split("/").pop() || link;
  }
}

// 處理 sidebar 項目，自動填入 text
function processSidebarItems(items: any[]): DefaultTheme.SidebarItem[] {
  return items.map((item) => {
    if (typeof item === "string") {
      // 如果是字串，轉換為物件格式
      return {
        text: getTextFromLink(item),
        link: item,
      };
    }

    if (item.link && !item.text) {
      // 如果有 link 但沒有 text，自動取得 text
      item.text = getTextFromLink(item.link);
    }

    if (item.items) {
      // 遞歸處理子項目
      item.items = processSidebarItems(item.items);
    }

    return item;
  });
}

// 導出處理後的 sidebar
export default processSidebarItems(sidebarConfigData as any[]);
