import type { Post } from './posts.data';

interface Data {
  [key: string]: Post[];
}

// export function initArchives(posts: Post[]): Data {
//   const data: Data = {};
//   for (let i = 0; i < posts.length; i++) {
//     const post = posts[i];
//     const year = post.date.string.slice(0, 4);
//     if (!data[year]) {
//       data[year] = [];
//     }
//     data[year].push(post);
//   }

//   return data;
// }

export function initCategory(posts: Post[]): Data {
  const data: Data = {};
  posts.forEach((post) => {
    const category = post.category;
    if (!data[category]) {
      data[category] = [];
    }
    data[category].push(post);
  });

  return data;
}

export function initTags(posts: Post[]): Data {
  const data: Data = {};
  posts.forEach((post) => {
    const tags = post.tags;
    if (Array.isArray(tags)) {
      // - Tags 為 null 的不收集
      if (tags[0] === null) {
        return;
      }

      tags.forEach((tag) => {
        if (!data[tag]) {
          data[tag] = [];
        }
        data[tag].push(post);
      });
    }
  });

  return Object.fromEntries(Object.entries(data).sort());
}
