---
title: 用 NVM 管理 Node.js 版本
description: 認識 Node.js，在 Windows 跟 Linux 系統上安裝 NVM 來管理 Node.js 版本。
date: 2024-10-01
category: Node.js
tags:
  - Node.js
  - Frontend
  - Ubuntu

prev: false
next: false
---

Node.js 是一個基於 Chrome V8 引擎的 JavaScript 運行環境，可以讓 JavaScript 在伺服器端運行，並且可以使用 NPM 等 Package Manager 來安裝第三方套件。Node.js 的版本更新速度很快，因此我們需要一個工具來管理 Node.js 的版本，避免不同專案需要使用不同版本的 Node.js 時造成問題。

## 以 Ubuntu 安裝 NVM

- 參考官方文件：[🔗 nvm - GitHub](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)

1. 下載 install script

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

2. 設定環境變數

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

## 以 Windows 安裝 NVM

```

```
