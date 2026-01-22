import type { DefaultTheme } from "vitepress";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import matter from "gray-matter";

const POST_PATH = path.resolve(process.cwd(), "docs", "post");

interface SeriesPost {
  title: string;
  link: string;
  seriesOrder: number;
}

interface SeriesInfo {
  seriesId: string;
  seriesTitle: string;
  posts: SeriesPost[];
}

// 掃描所有文章，收集系列資訊
function collectSeriesData(): Map<string, SeriesInfo> {
  const seriesMap = new Map<string, SeriesInfo>();

  function scanDirectory(dir: string, relativePath: string = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = relativePath
        ? `${relativePath}/${entry.name}`
        : entry.name;

      if (entry.isDirectory()) {
        // 檢查目錄下的 index.md
        const indexPath = path.join(fullPath, "index.md");
        if (fs.existsSync(indexPath)) {
          processMarkdownFile(indexPath, `${relPath}/`, seriesMap);
        }
        // 繼續遞歸掃描子目錄
        scanDirectory(fullPath, relPath);
      } else if (entry.name.endsWith(".md") && entry.name !== "index.md") {
        // 處理獨立的 .md 文件
        processMarkdownFile(fullPath, relPath.replace(/\.md$/, ""), seriesMap);
      }
    }
  }

  scanDirectory(POST_PATH);
  return seriesMap;
}

function processMarkdownFile(
  filePath: string,
  link: string,
  seriesMap: Map<string, SeriesInfo>,
) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);

    if (data.series && data.seriesOrder !== undefined) {
      const seriesId = data.series;

      if (!seriesMap.has(seriesId)) {
        seriesMap.set(seriesId, {
          seriesId,
          seriesTitle: data.seriesTitle || seriesId,
          posts: [],
        });
      }

      const series = seriesMap.get(seriesId)!;
      series.posts.push({
        title: data.title || link,
        link,
        seriesOrder: data.seriesOrder,
      });

      // 更新 seriesTitle（以防第一篇沒有定義）
      if (data.seriesTitle) {
        series.seriesTitle = data.seriesTitle;
      }
    }
  } catch (error) {
    console.error(`處理文件 ${filePath} 時發生錯誤:`, error);
  }
}

// 根據系列 ID 生成 sidebar 配置
function generateSeriesSidebar(seriesId: string): DefaultTheme.SidebarItem[] {
  const seriesMap = collectSeriesData();
  const series = seriesMap.get(seriesId);

  if (!series) {
    return [];
  }

  // 按 seriesOrder 排序
  const sortedPosts = series.posts.sort(
    (a, b) => a.seriesOrder - b.seriesOrder,
  );

  return [
    {
      text: series.seriesTitle,
      items: sortedPosts.map((post, index) => ({
        text: `${index + 1}. ${post.title}`,
        link: `/${post.link}`,
      })),
    },
  ];
}

// 收集所有系列資訊（用於生成多 sidebar 配置）
function getAllSeriesSidebars(): Record<string, DefaultTheme.SidebarItem[]> {
  const seriesMap = collectSeriesData();
  const sidebars: Record<string, DefaultTheme.SidebarItem[]> = {};

  for (const [_seriesId, series] of seriesMap) {
    // 按 seriesOrder 排序
    const sortedPosts = series.posts.sort(
      (a, b) => a.seriesOrder - b.seriesOrder,
    );

    // 為每篇文章的路徑設定 sidebar
    for (const post of sortedPosts) {
      const pathKey = `/${post.link}`;
      sidebars[pathKey] = [
        {
          text: series.seriesTitle,
          items: sortedPosts.map((p, index) => ({
            text: `${index + 1}. ${p.title}`,
            link: `/${p.link}`,
          })),
        },
      ];
    }
  }

  return sidebars;
}

// 導出所有系列 ID 列表
function getSeriesIds(): string[] {
  const seriesMap = collectSeriesData();
  return Array.from(seriesMap.keys());
}

// 導出系列資訊（用於顯示系列索引頁）
function getSeriesInfo(seriesId: string): SeriesInfo | undefined {
  const seriesMap = collectSeriesData();
  const series = seriesMap.get(seriesId);

  if (series) {
    series.posts.sort((a, b) => a.seriesOrder - b.seriesOrder);
  }

  return series;
}

export {
  collectSeriesData,
  generateSeriesSidebar,
  getAllSeriesSidebars,
  getSeriesIds,
  getSeriesInfo,
};
