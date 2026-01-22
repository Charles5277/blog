import { createContentLoader } from "vitepress";

interface SeriesPost {
  title: string;
  url: string;
  seriesOrder: number;
}

interface SeriesData {
  [seriesId: string]: {
    seriesTitle: string;
    posts: SeriesPost[];
  };
}

declare const data: SeriesData;
export { data, SeriesData, SeriesPost };

export default createContentLoader("post/**/*.md", {
  transform(raw): SeriesData {
    const seriesMap: SeriesData = {};

    for (const { url, frontmatter } of raw) {
      const { series, seriesTitle, seriesOrder, title } = frontmatter;

      if (series && seriesOrder !== undefined) {
        if (!seriesMap[series]) {
          seriesMap[series] = {
            seriesTitle: seriesTitle || series,
            posts: [],
          };
        }

        seriesMap[series].posts.push({
          title: title || url,
          url,
          seriesOrder,
        });

        // 更新 seriesTitle（以防第一篇沒有定義）
        if (seriesTitle) {
          seriesMap[series].seriesTitle = seriesTitle;
        }
      }
    }

    // 對每個系列的文章按 seriesOrder 排序
    for (const series of Object.values(seriesMap)) {
      series.posts.sort((a, b) => a.seriesOrder - b.seriesOrder);
    }

    return seriesMap;
  },
});
