#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import matter from "gray-matter";

const POST_PATH = path.resolve(process.cwd(), "docs", "post");

// 從 sidebar.ts 提取 link 配置
function extractLinksFromSidebar() {
  const sidebarPath = path.resolve(
    process.cwd(),
    "docs/.vitepress/utils/sidebar.ts",
  );

  if (!fs.existsSync(sidebarPath)) {
    console.error("❌ 找不到 sidebar.ts 文件");
    process.exit(1);
  }

  const content = fs.readFileSync(sidebarPath, "utf-8");

  // 提取 sidebarConfigData 中的所有 link
  const links = new Set();
  const linkRegex = /link:\s*['"`]([^'"`]+)['"`]/g;
  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = linkRegex.exec(content)) !== null) {
    links.add(match[1]);
  }

  return Array.from(links);
}

// 從文章 frontmatter 收集系列文章的 links
function extractSeriesLinks() {
  const seriesLinks = new Set();

  function scanDirectory(dir, relativePath = "") {
    if (!fs.existsSync(dir)) {
      return;
    }

    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // 檢查目錄下的 index.md
        const indexPath = path.join(fullPath, "index.md");
        if (fs.existsSync(indexPath)) {
          const relPath = path.join(relativePath, item);
          checkSeriesFrontmatter(indexPath, `${relPath}/`, seriesLinks);
        }
        scanDirectory(fullPath, path.join(relativePath, item));
      } else if (item.endsWith(".md") && item !== "index.md") {
        const relPath = path.join(relativePath, item).replace(/\.md$/, "");
        checkSeriesFrontmatter(fullPath, relPath, seriesLinks);
      }
    }
  }

  scanDirectory(POST_PATH);
  return Array.from(seriesLinks);
}

function checkSeriesFrontmatter(filePath, link, seriesLinks) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);

    // 如果有 series frontmatter，就加入 seriesLinks
    if (data.series && data.seriesOrder !== undefined) {
      seriesLinks.add(link.replace(/\\/g, "/"));
    }
  } catch {
    // 忽略解析錯誤
  }
}

// 掃描所有 post 目錄下的 .md 文件
function getAllMarkdownFiles() {
  const files = [];

  function scanDirectory(dir, relativePath = "") {
    if (!fs.existsSync(dir)) {
      return;
    }

    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath, path.join(relativePath, item));
      } else if (item.endsWith(".md")) {
        const relativeFilePath = path
          .join(relativePath, item)
          .replace(/\\/g, "/");
        files.push(relativeFilePath);
      }
    }
  }

  scanDirectory(POST_PATH);
  return files;
}

// 將文件路徑轉換為 sidebar link 格式
function convertFilePathToLink(filePath) {
  // 如果是 index.md，轉換為目錄格式（以 / 結尾）
  if (filePath.endsWith("/index.md")) {
    return filePath.replace("/index.md", "/");
  }

  // 移除 .md 擴展名
  return filePath.replace(/\.md$/, "");
}

// 主檢查邏輯
function checkSidebarCoverage() {
  console.log("🔍 檢查 sidebar 配置覆蓋度...\n");

  const sidebarLinks = extractLinksFromSidebar();
  const seriesLinks = extractSeriesLinks();
  const markdownFiles = getAllMarkdownFiles();

  // 合併 sidebar links 和 series links
  const allConfiguredLinks = [...new Set([...sidebarLinks, ...seriesLinks])];

  console.log(`📊 統計資訊：`);
  console.log(`   Sidebar 中的 links: ${sidebarLinks.length}`);
  console.log(`   系列文章 links: ${seriesLinks.length}`);
  console.log(`   專案中的 .md 文件: ${markdownFiles.length}\n`);

  // 轉換文件路徑為 link 格式
  const expectedLinks = markdownFiles.map(convertFilePathToLink);

  // 找出缺失的文件（不在 sidebar 也不在系列中）
  const missingFiles = [];

  for (const expectedLink of expectedLinks) {
    if (!allConfiguredLinks.includes(expectedLink)) {
      missingFiles.push(expectedLink);
    }
  }

  // 找出多餘的 links（指向不存在的文件）
  const extraLinks = [];

  for (const link of sidebarLinks) {
    if (!expectedLinks.includes(link)) {
      // 檢查對應的文件是否存在
      let filePath;
      if (link.endsWith("/")) {
        // 目錄型 link
        filePath = path.join(POST_PATH, link, "index.md");
      } else {
        // 文件型 link
        filePath = path.join(POST_PATH, `${link}.md`);
      }

      if (!fs.existsSync(filePath)) {
        extraLinks.push(link);
      }
    }
  }

  // 輸出結果
  if (missingFiles.length === 0 && extraLinks.length === 0) {
    console.log("✅ 所有 Markdown 文件都已包含在 sidebar 配置中！");
    return true;
  } else {
    console.log("❌ 發現不一致的地方：\n");

    if (missingFiles.length > 0) {
      console.log("📝 以下文件未包含在 sidebar 配置中：");
      missingFiles.forEach((file) => {
        console.log(`   - ${file}`);
      });
      console.log("");
    }

    if (extraLinks.length > 0) {
      console.log("🔗 以下 sidebar links 指向不存在的文件：");
      extraLinks.forEach((link) => {
        console.log(`   - ${link}`);
      });
      console.log("");
    }

    console.log(
      "💡 請更新 docs/.vitepress/utils/sidebar.ts 中的 sidebarConfigData",
    );
    return false;
  }
}

// 執行檢查
const isValid = checkSidebarCoverage();
process.exit(isValid ? 0 : 1);
