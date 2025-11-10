---
title: 自動檢查 Git commit 與 branch 名稱的格式
description: 使用 husky 與 commitlint 來自動檢查 commit 訊息跟 branch 名稱的格式
datePublished: 2025-01-22
lastUpdated: 2025-11-10 16:28:00 +8
category: Git
tags:
  - Git

---

以下以 pnpm 跟已經有 git 初始化的專案為例。

## 安裝 husky

1. 參考[官網指引](https://typicode.github.io/husky/get-started.html)，以 pnpm 為例：

```bash
pnpm add --save-dev husky
```

2. 初始化設定

```bash
pnpm exec husky init
```

## 安裝 commitlint

1. 參考[官網指引](https://commitlint.js.org/guides/getting-started.html)，以 pnpm 為例：

```bash
pnpm add --save-dev @commitlint/{cli,config-conventional}
```

2. 初始化設定

```bash
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

## 針對 commit 訊息的格式檢查

1. 將 commitlint.config.js 檔案改為以下檔案
   此操作會檢查 commit 訊息是否符合 conventional commit 的格式，並且參照 [git commit plugin with gitmoji](https://marketplace.visualstudio.com/items?itemName=devCharles5277.git-commit-plugin-with-gitmoji) 的 emoji 來區分不同的 commit 類型。

```js
export default {
  extends: ['@commitlint/config-conventional'],
  
  // 自定義解析器：支援 "✨ feat: message" 格式  
  parserPreset: {
    parserOpts: {
      headerPattern: /^(✨ feat|🐛 fix|🧹 chore|🔨 refactor|🧪 test|🎨 style|📝 docs|📦 build|👷 ci|⏪ revert|🚀 deploy|🎉 init): (.+)$/,
      headerCorrespondence: ['type', 'subject'],
    },
  },
  
  rules: {
    // 允許的 commit 類型（包含 emoji）
    'type-enum': [
      2,
      'always',
      [
        '✨ feat',
        '🐛 fix',
        '🧹 chore',
        '🔨 refactor',
        '🧪 test',
        '🎨 style',
        '📝 docs',
        '📦 build',
        '👷 ci',
        '⏪ revert',
        '🚀 deploy',
        '🎉 init',
      ],
    ],
    // 關閉 type-case 檢查（因為我們的 type 包含 emoji 和空格）
    'type-case': [0],
    // 關閉 type-empty 檢查（由 type-enum 處理）
    'type-empty': [0],
    // 允許 subject 以小寫或大寫開頭（中文沒有大小寫）
    'subject-case': [0],
  },
};
```

2. 透過 Husky 在 `commit-msg` hook 觸發 commitlint，確保每次 `git commit` 時都會套用上述規則：

```bash
pnpm exec husky add .husky/commit-msg "pnpm exec commitlint --edit $1"
```

3. 若希望提供更友善的錯誤訊息，可將 `./husky/commit-msg` 檔案內容改成：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# 自訂的 commit 訊息驗證
commit_msg=$(cat "$1")
if ! echo "$commit_msg" | grep -qE '^(✨ feat|🐛 fix|🧹 chore|🔨 refactor|🧪 test|🎨 style|📝 docs|📦 build|👷 ci|⏪ revert|🚀 deploy|🎉 init): .+'; then
  echo "提交訊息格式不正確。請使用以下格式之一：

  ✨ feat: 新增功能
  🐛 fix: 修復錯誤
  🧹 chore: 修改註解、顯示文字等小異動
  🔨 refactor: 重構程式碼
  🧪 test: 新增測試
  🎨 style: 調整介面或程式碼樣式
  📝 docs: 更新文件
  📦 build: 更新建置設定
  👷 ci: 更新 CI 設定
  ⏪️ revert: 抵銷更改
  🚀 deploy: 部署新版本
  🎉 init: 初始新專案

  範例: ✨ feat: 新增用戶認證功能

  提示: 可使用 VS Code 擴充套件 \"Git Commit Plugin with Gitmoji\" 快速產生正確格式"
  exit 1
fi
```

## 使用 lint-staged 在 commit 前自動檢查檔案

除了檢查 commit 訊息外，也可以在提交前自動檢查程式碼品質，確保程式碼狀態良好再進入版本庫。

1. 安裝 [lint-staged](https://github.com/lint-staged/lint-staged)：

```bash
pnpm add --save-dev lint-staged
```

2. 新增 `lint-staged.config.js` 檔案，根據專案需求設定要執行的檢查。例如以下會在提交前針對 TS/JS 進行 ESLint、針對 CSS/SCSS 進行 Stylelint，再由 Prettier 格式化所有支援的檔案：

```js
export default {
  '*.{ts,tsx,js,jsx,vue}': ['pnpm lint'],
  '*.{css,scss}': ['pnpm stylelint'],
  '*': ['pnpm format'],
};
```

3. 新增 `./husky/pre-commit` 檔案，讓 Husky 在 `git commit` 時只對 staged 檔案執行上述檢查：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm exec lint-staged
```

若檢查失敗，commit 會被取消並提示錯誤；修正後重新 `git add`、`git commit` 即可。

## 針對 branch 名稱的格式檢查

- 在 git push 前針對 branch 名稱的格式檢查，以 pnpm 為例：

建立 ./husky/pre-push 檔案，內容如下：

```bash
#!/bin/sh

branch_name=$(git symbolic-ref --short HEAD)
regex='^(feat|fix|chore|refactor|test|style|docs|build|ci|revert|deploy|init)\/.*$'

if [ "$branch_name" = "main" ]; then
  exit 0
fi

echo "當前分支名稱：$branch_name"
if ! echo "$branch_name" | grep -qE "$regex"; then
  echo "🚨 分支名稱格式錯誤，請使用 type/title 格式"
  echo "可用的 type: feat, fix, chore, refactor, test, style, docs, build, ci, revert, deploy, init"
  echo "範例: feat/add-login-page"
  exit 1
fi
```
