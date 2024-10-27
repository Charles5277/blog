---
title: VS Code 筆記
description: 快捷鍵與前端開發常用 Extension 推薦
datePublished: 2024-09-10
lastUpdated: 2024-09-22 07:17:00 +8
category: VS Code
tags:
  - VS Code

prev:
  text: '認識 Visual Studio Code'
  link: '/vscode/introduction'
next: false
---

## Shortcut

### 介面相關

| 快捷鍵                                           | 功能                      |
| ------------------------------------------------ | ------------------------- |
| Ctrl + B                                         | 打開檔案總管 / 關閉側邊欄 |
| Ctrl + \~                                        | 顯示 / 隱藏下方面板       |
| Ctrl + Shift + \~                                | 新增終端機頁籤            |
| Ctrl + \\                                        | 向右分割檢視區            |
| Ctrl + K Ctrl + \ <br>(建議改成 Ctrl + Alt + \\) | 向下分割檢視區            |
| Ctrl + Shift + N                                 | 開啟新 VS Code 分頁       |

### 編輯相關

| 快捷鍵              | 功能                                                  |
| ------------------- | ----------------------------------------------------- |
| Ctrl + D            | 選取所在輸入點的字詞                                  |
| Ctrl + F            | 搜尋當前頁面關鍵字                                    |
| Ctrl + Shift + F    | 在所有檔案中搜尋關鍵字                                |
| Ctrl + G            | 前往當前頁面某一行                                    |
| Ctrl + H            | 取代當前頁面關鍵字                                    |
| Ctrl + Shift + H    | 在所有檔案中取代關鍵字                                |
| Ctrl + W            | 關閉頁籤                                              |
| Shift + Alt + →     | 擴張選取範圍                                          |
| Shift + Alt + ←     | 縮小選取範圍                                          |
| Shift + Alt + ↑     | 向上複製當前行                                        |
| Shift + Alt + ↓     | 向下複製當前行                                        |
| 按住 Alt + 滑鼠左鍵 | 多選數個單字                                          |
| Ctrl + Alt + ↑ / ↓  | 向上 / 下追加編輯游標                                 |
| F2                  | 重新命名游標當前變數名稱，並更新該檔案所有出現之處    |
| Ctrl + F2           | 選取所有檔案當前相符單字                              |
| Ctrl + /            | 註解當前選取的單 / 多行                               |
| (多選狀態下)        | 如同 Excel 多選儲存格，可同時覆蓋或方向鍵同時移動游標 |

### 資料夾 / 工作區相關

| 快捷鍵              | 功能                 |
| ------------------- | -------------------- |
| Ctrl + Shift + T    | 開啟剛才關閉的檔案   |
| Ctrl + E / Ctrl + P | 開啟當前專案的某檔案 |
| Ctrl+K Ctrl+O       | 開啟專案資料夾       |
| Ctrl + R            | 開啟最近的工作區     |
| Ctrl + N            | 在當前專案新增檔案   |

### 其他擴充套件相關

| 快捷鍵                                           | 功能                                       |
| ------------------------------------------------ | ------------------------------------------ |
| Ctrl + I                                         | 觸發 GitHub Copilot Chat                   |
| Ctrl + Enter                                     | 在當前位置要求 GitHub Copilot 列出所有建議 |
| Ctrl + Alt + R <br>(建議改成 Ctrl + Alt + Enter) | 發送 REST Client 測試 API 請求             |

## Extension

- [git-commit-plugin with gitmoji](https://marketplace.visualstudio.com/items?itemName=devCharles5277.git-commit-plugin-with-gitmoji&ssr=false#overview)

  > VS Code 最方便的 Git Commit Extension

  - 功能介紹

    > 互動式介面創建約定式提交
    > ![](https://i.imgur.com/lcT0wU0.png)

    > ![](https://i.imgur.com/Hc5psjw.png)

    > 點擊 Complete 後即自動產生 commit 格式
    > ![](https://i.imgur.com/PP9b1XP.png)
    >
    > 使讓多人協作 repo 時，commit 風格統一

- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

  - 顯示當前行的 git blame (最後一次編輯的人是誰、commit 訊息)
    > ![](https://i.imgur.com/0wQND1c.png)
  - 選取兩個 commit 進行 diff 比較
    > ![](https://i.imgur.com/x5GpL0k.png)

- [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)

  - 以圖像化表示 branch 跟 commit 紀錄，方便直觀進行 git command 快捷操作
    > ![](https://i.imgur.com/LiAIhw1.png)

- [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)

  > 註解顏色分類功能
  > 使用方式可自定義
  > 範例：\ <img src="https://i.imgur.com/vaN4nYi.png" width="50%">

  - setting.json
    ```json
    "better-comments.tags": [
        {
          "tag": "!",
          "color": "#d9444a",
          "strikethrough": false,
          "backgroundColor": "transparent",
          "bold": true,
          "italic": false,
          "underline": false
        },
        {
          "tag": "?",
          "color": "#f5c018",
          "strikethrough": false,
          "backgroundColor": "transparent",
          "bold": false,
          "italic": false,
          "underline": false
        },
        {
          "tag": ">",
          "color": "#fff",
          "strikethrough": false,
          "backgroundColor": "transparent"
        },
        {
          "tag": "-",
          "color": "#b3aff7",
          "strikethrough": false,
          "backgroundColor": "transparent",
          "bold": true
        },
        {
          "tag": "//",
          "color": "#474747",
          "strikethrough": true,
          "backgroundColor": "transparent",
          "bold": false,
          "italic": false,
          "underline": false
        },
        {
          "tag": "todo",
          "color": "#FFF",
          "strikethrough": false,
          "backgroundColor": "#21ba45",
          "bold": true,
          "underline": true
        }
      ],
    ```

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

  > IDE 的 code 規範設定工具，協作專案時統一 code 風格

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

  > JS 的 Linter，依照指定風格進行程式碼語法檢測

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

  > 網頁前端各種語言 (HTML, CSS, JS, TS, JSON, Vue) 等
  > 都能自訂規則後自動格式化程式碼

- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

  > 自動檢測英文單字是否拼錯，可於 setting.json、workspace 加入例外清單 (可在報錯訊息右鍵選擇)

- [HTML CSS Support](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css)

  > HTML 與 CSS 自動完成功能

- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally)

  > 開發前端需要多國語言，使用 i18n 時使用，集成參數的多語言對照清單，編輯、翻譯功能
  > 可參考[設定教學 🔗](https://waiting4u.org/blog/i18n-ally-%E5%8F%83%E6%95%B8%E8%A8%AD%E5%AE%9A%E8%88%87%E4%BD%BF%E7%94%A8%E5%88%86%E4%BA%AB)

- [indent-rainbow](https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow)

  > 縮排區段以不同顏色為底色區隔，可以自行選擇要不要搭配 setting 中的 bracket pair (線段標記加強效果)

  > <img src="https://i.imgur.com/EXVpwur.png" width="75%">

- [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)

  > 輸入相對路徑時自動顯示檔案清單

  > <img src="https://i.imgur.com/WnS4YTM.png" width="60%">

- [TabOut](https://marketplace.visualstudio.com/items?itemName=albert.TabOut)

  > 可以使用 tab 跳出自動完成的括號配對，如：(), {}, \[ ] , '', " " 等
  > 皆可用 tab 鍵跳出

- [vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)

  > 擴充顯示更多類型檔案的 icon

  > <img src="https://i.imgur.com/acvhMA2.png" width="30%">

- [GitHub Copilot](https://docs.github.com/en/copilot/getting-started-with-github-copilot/getting-started-with-github-copilot-in-visual-studio-code)

  > AI 自動預測程式碼，支援絕大多數程式語言，打註解亦可生成 code，用 tab 自動完成

  > [取得 Github Education](https://education.github.com/) 可以免費使用 Github Copilot

- [Quasar Docs](https://marketplace.visualstudio.com/items?itemName=CodeCoaching.quasar-docs)

  > 使用 Quasar Framework (Vue 3 最佳的 Framework) 必裝
  > 可以在 VS Code 看 Quasar 文檔

- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)

  > 可以在 import 時檢查造成的檔案大小負擔

- [Console Ninja](https://marketplace.visualstudio.com/items?itemName=WallabyJs.console-ninja)

  > 可以在 console.log 等輸出時在編輯當前行看到輸出結果

- [盤古之白](https://marketplace.visualstudio.com/items?itemName=doggy8088.pangu2)

  > 自動替你在文件中所有的中文字和半形的英文、數字、符號之間插入空白。
