// 分類配置
export interface CategoryConfig {
  name: string;
  icon: string;
  order: number;
}

// 分類資料 - 按照期望的自定義順序排列
export const CATEGORIES: CategoryConfig[] = [
  { name: 'Vue.js', icon: 'vue', order: 1 },
  { name: 'Nuxt', icon: 'nuxt', order: 2 },
  { name: 'Node.js', icon: 'nodejs', order: 3 },
  { name: 'VS Code', icon: 'vscode', order: 4 },
  { name: 'Git', icon: 'git', order: 5 },
  { name: 'GitHub', icon: 'github', order: 6 },
  { name: 'Linux', icon: 'linux', order: 7 },
  { name: 'HTML', icon: 'html', order: 8 },
  { name: 'CSS', icon: 'css', order: 9 },
  { name: 'VitePress', icon: 'vitepress', order: 10 },
  { name: 'Docker', icon: 'docker', order: 11 },
  { name: 'Database', icon: 'database', order: 12 },
];

// 建立名稱到圖標的對應關係
export const CATEGORY_ICON_MAP: Record<string, string> = CATEGORIES.reduce(
  (acc, category) => {
    acc[category.name] = category.icon;
    return acc;
  },
  {} as Record<string, string>,
);

// 分類順序陣列
export const CATEGORY_ORDER: string[] = CATEGORIES.map(
  (category) => category.name,
);

// 工具函數：根據名稱獲取圖標
export function getCategoryIcon(categoryName: string): string {
  return CATEGORY_ICON_MAP[categoryName] || '';
}

// 工具函數：獲取排序後的分類名稱陣列
export function getSortedCategories(categories: string[]): string[] {
  return categories.sort((a, b) => {
    const orderA = CATEGORY_ORDER.indexOf(a);
    const orderB = CATEGORY_ORDER.indexOf(b);
    return orderA - orderB;
  });
}
