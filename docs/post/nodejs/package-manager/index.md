---
title: 認識 Node.js 的 Package Manager
description: 使用 JS 開發專案時，我們經常需要安裝第三方套件來擴充功能，使用 Package Manager 可以讓我們更方便的管理套件版本並確保相容性。
datePublished: 2024-10-15
category: Node.js
tags:
  - Node.js
  - pnpm

prev:
  text: '用 NVM 管理 Node.js 版本'
  link: '/nodejs/nvm/'
next:
  text: 'Vite - 稱霸網頁前端開發的開發工具'
  link: '/nodejs/vite/'
---

## 認識 Node Package Manager (npm)

Node.js 的 Package Manager 稱為 npm，是 Node.js 的官方套件管理工具，提供了一個龐大的套件庫供開發者使用，並且可以透過 npm 安裝、更新、移除套件。所有可供下載的套件都會放在 npm 的官方網站 [npmjs.com](https://www.npmjs.com/) 上。

當你完成 Node 的安裝 (參考[用 NVM 管理 Node.js 版本](/nodejs/nvm/))，npm 也會一併安裝在你的電腦上，你可以透過以下指令來確認 npm 是否已經安裝：

```bash
npm -v
```

如果你看到 npm 的版本號，代表 npm 已經安裝完成。

## npm /yarn/pnpm 的差異

在 JavaScript 的開發生態中，你會經常看到一個套件同時提供了 npm、yarn、pnpm 三種安裝方式，這三種套件管理工具有什麼差異呢？

簡單來說，這三種套件管理工具的功能都是一樣的，都是用來安裝、更新、移除套件，且都是存取 npm 官網的套件，但是在效能、安全性、穩定性等方面有所不同：

- **npm**：Node.js 的官方套件管理工具，是最早出現的套件管理工具，但是在安裝套件時會將套件的依賴複製到專案的 `node_modules` 資料夾中，當專案中有多個套件使用相同的依賴時，會造成硬碟空間的浪費。

- **yarn**：由 Facebook (Meta) 開發的套件管理工具，是 npm 的替代品，改善了 npm 的一些缺點，包含並行下載加快安裝速度，複雜專案的套件相依自動處理的穩定性更佳。

- **pnpm**：是目前更主流廣泛使用的套件管理工具，與 npm、yarn 不同的是，pnpm 主打將套件的依賴放在全域的 `node_modules` 資料夾中，並且使用硬連結的方式來連結到專案的 `node_modules` 資料夾，專案數量增加時可以顯著節省硬碟空間，且可以避免套件的依賴重複安裝，也因此節省大量重新下載重複套件的時間。

### 功能比較

<table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>pnpm</th>
        <th>Yarn</th>
        <th>npm</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Workspace support</td>
        <td>✔️</td>
        <td>✔️</td>
        <td>✔️</td>
      </tr>
      <tr>
        <td>Isolated <code>node_modules</code></td>
        <td>✔️ - The default</td>
        <td>✔️</td>
        <td>✔️</td>
      </tr>
      <tr>
        <td>Hoisted <code>node_modules</code></td>
        <td>✔️</td>
        <td>✔️</td>
        <td>✔️ - The default</td>
      </tr>
      <tr>
        <td>Autoinstalling peers</td>
        <td>✔️</td>
        <td>❌</td>
        <td>✔️</td>
      </tr>
      <tr>
        <td>Plug'n'Play</td>
        <td>✔️</td>
        <td>✔️ - The default</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Zero-Installs</td>
        <td>❌</td>
        <td>✔️</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Patching dependencies</td>
        <td>✔️</td>
        <td>✔️</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Managing Node.js versions</td>
        <td>✔️</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Has a lockfile</td>
        <td>✔️ - <code>pnpm-lock.yaml</code></td>
        <td>✔️ - <code>yarn.lock</code></td>
        <td>✔️ - <code>package-lock.json</code></td>
      </tr>
      <tr>
        <td>Overrides support</td>
        <td>✔️</td>
        <td>✔️ - Via resolutions</td>
        <td>✔️</td>
      </tr>
      <tr>
        <td>Content-addressable storage</td>
        <td>✔️</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Dynamic package execution</td>
        <td>✔️ - Via <code>pnpm dlx</code></td>
        <td>✔️ - Via <code>yarn dlx</code></td>
        <td>✔️ - Via <code>npx</code></td>
      </tr>
      <tr>
        <td>Side-effects cache</td>
        <td>✔️</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Listing licenses</td>
        <td>✔️ - Via <code>pnpm licenses list</code></td>
        <td>✔️ - Via a plugin</td>
        <td>❌</td>
      </tr>
    </tbody>
  </table>

以上 3 個都是主流的 Node Package Manager，以現今環境來說，pnpm 是目前最推薦的套件管理工具。

## 如何安裝 pnpm

最簡單的方式，你可以透過 npm 來全域安裝 pnpm：

```bash
npm install -g pnpm
```

這樣就完成了，你可以透過以下指令來確認 pnpm 是否已經安裝：

```bash
pnpm -v
```

## 常用指令列表

<table>
  <thead>
    <tr>
      <th>作用</th>
      <th>npm</th>
      <th>yarn</th>
      <th>pnpm👍</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>安裝 package.json<br />的所有套件</td>
      <td>npm install</td>
      <td>yarn install</td>
      <td>pnpm install</td>
    </tr>
    <tr>
      <td>移除套件</td>
      <td>npm uninstall xxx</td>
      <td>yarn remove xxx</td>
      <td>pnpm remove xxx</td>
    </tr>
    <tr>
      <td>移除套件的簡寫</td>
      <td>npm rm xxx</td>
      <td>yarn rm xxx</td>
      <td>pnpm rm xxx</td>
    </tr>
    <tr>
      <td>全域安裝套件</td>
      <td>npm i xxx -g</td>
      <td>yarn global add xxx</td>
      <td>pnpm add -g xxx</td>
    </tr>
    <tr>
      <td>安裝套件（開發跟生產階段都要用）</td>
      <td>npm i xxx</td>
      <td>yarn add xxx</td>
      <td>pnpm add xxx</td>
    </tr>
    <tr>
      <td>安裝套件（僅開發階段使用）</td>
      <td>npm i xxx -D</td>
      <td>yarn add -D xxx</td>
      <td>pnpm add -D xxx</td>
    </tr>
    <tr>
      <td>更新套件</td>
      <td>npm update</td>
      <td>yarn upgrade</td>
      <td>pnpm update</td>
    </tr>
    <tr>
      <td>全域更新套件</td>
      <td>npm update -g</td>
      <td>yarn global upgrade</td>
      <td>pnpm update -g</td>
    </tr>
    <tr>
      <td>執行 script</td>
      <td>npm run xxx</td>
      <td>yarn run xxx</td>
      <td>pnpm run xxx</td>
    </tr>
    <tr>
      <td>清除快取</td>
      <td>npm cache clean</td>
      <td>yarn cache clean</td>
      <td>pnpm store prune</td>
    </tr>
    <tr>
      <td>動態執行套件</td>
      <td>npx xxx</td>
      <td>yarn dlx xxx</td>
      <td>pnpm dlx xxx</td>
    </tr>
    <tr>
      <td>查看全域安裝的套件</td>
      <td>npm list -g --depth 0</td>
      <td>yarn global list</td>
      <td>pnpm list -g</td>
    </tr>
    <tr>
      <td>更新 package manager 自身版本</td>
      <td>npm install -g npm</td>
      <td>yarn set version latest</td>
      <td>pnpm self-update</td>
    </tr>
  </tbody>
</table>
