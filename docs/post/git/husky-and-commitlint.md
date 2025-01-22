---
title: 自動檢查 Git commit 與 branch 名稱的格式
description: 使用 husky 與 commitlint 來自動檢查 commit 訊息跟 branch 名稱的格式
datePublished: 2025-01-22
lastUpdated: 2025-01-22 15:34:00 +8
category: Git
tags:
  - Git

prev: false
next: false
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
  rules: {
    'header-pattern': [
      2,
      'always',
      /^((✨ feat|🐛 fix|🧹 chore|🔨 refactor|🧪 test|🎨 style|📝 docs|📦 build|👷 ci|⏪ revert|🚀 deploy|🎉 init)): .+/,
    ],
  },
};
```

2. 設定 ./husky/commit-msg 檔案，內容如下：

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
