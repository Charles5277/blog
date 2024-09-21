---
title: Git 筆記
description: 編輯拆分中
date: 2024-09-10
lastUpdated: 2024-09-22 07:17:00 +8
category: Git
tags:
  - Git
  - VS Code

prev: false
next: false
---

## 參考教學：

> 此篇 HackMD 筆記以 Git 2.38.1 為基準，因此會有像是 switch、restore 等新指令用法

> 前半段的示範教學較多，後半段多為整理常用指令，可以搭配 [git command](#git-command總覽) 查看，透過[🔗W3Hexschool - Git & GitHub 教學手冊](https://w3c.hexschool.com/git/cfdbd310)輔助學習

> 另外可以善用[🔗Learn Git Branching](https://learngitbranching.js.org/?locale=zh_TW) 線上練習 Git 管理操作

> 最完整實例的[🔗繁中 Git 教學](https://gitbook.tw/)

> 使用 VS Code 開發可以參考此教學[🔗進行初始設定](https://www.roboleary.net/vscode/2020/09/15/vscode-git.html)

## 認識 Git & GitHub

#### 如何備份程式碼

> ![](https://hackmd.io/_uploads/SkKfTwjWa.jpg)

> ![](https://hackmd.io/_uploads/rku5tvo-T.png)

> ![](https://hackmd.io/_uploads/B18YUwjWp.png)

## Git 概念

![](https://i.imgur.com/Rrc1c69.png)

### working directory 跟 worktree 的差別

> 在中文的 Git 文章容易看到 "工作目錄"
>
> 有時指的是 working directory
>
> 有時卻是 worktree
>
> 可以理解為中文廣義跟狹義的差別
>
> worktree 包含 working directory + stage

![](https://i.imgur.com/6glonJ7.png)

> 每一次提交會產生 snapshot 與對應的 hash 值
>
> 口語上我們可能會聽到用 "commit 紀錄"、"commit 節點" 來稱呼 snapshot
>
> 這是因為每一個節點都是 snapshot，由 snapshots 組成 branch

- 工作目錄 (狹義) (workdir、wd)

  > 當前實際進行編輯文件的資料夾位置，亦稱作工作區域
  >
  > 即 VS Code 檔案總管開啟的 "資料夾" 或 "工作區"

- 暫存區 (stage、index、staging area、.git/index)

  > git 管理該專案暫存變更的對照清單，紀錄目前程式碼跟上個版本的所有差異，亦稱作暫存區
  >
  > 若使用 VS Code 或 IDE，會在原始檔控制 (Source Control) 呈現，以圖形化檢視與編輯

- 工作目錄 (廣義) (work tree)

  > work tree 是一個抽象的概念，他讓編輯的工作區域可以虛擬出來
  >
  > 我可以在同一個專案中，開設不同的 work tree
  >
  > 他們可以完全獨立的去處理檔案的修改、commit、在不同 branch 中切換變更

  > 關於同一個專案為什麼可以同時用不同 work tree 編輯而不會互相干擾？
  > <https://chat.openai.com/share/c57b02c6-18c5-4884-8f71-97e71a8dc0a9>

- 數據庫 (Repository、Repo)

  > 通常一個 Repo 為一個或多個專案，以程式碼跟說明檔為主的檔案庫
  >
  > 數據庫由 branch (分支) 組成，每個 Repo 會有一個預設的 Branch，也可以新增更多 Branch 來分類

- 本地數據庫 (Local Repo)

  > git 在當前作業系統中保存的 Repo

- 遠端數據庫 (Remote Repo)
  > 如 Github、GitLab 等，用於個人專案版本控制或團隊協作開發專案，方便共同更新與同步數據庫，或是開源讓任何人共同維護、更新專案

### 以下將使用簡稱：

- workdir
- stage
- worktree
- branch
- Local Repo
- Remote Repo

## Git 操作

> 操作 Git 需要有基本 Terminal 能力，以 Linux 為例包含 cd、mkdir 等
>
> 可參考 [Linux - Ubuntu 操作筆記教學](https://hackmd.io/@Charles5277/r19yxcQni/%2FBB6KG8NCTQ-1Ps2KRr82AA)

### 安裝

> [🔗Git 官網安裝](https://git-scm.com/downloads)

Windows 也可以透過 winget 安裝

> 打開終端機 / 命令提示字元 / 終端機
>
> 執行以下指令

```bash
winget install Git.Git -i
```

> ![](https://hackmd.io/_uploads/Hkh4Nw5ba.png)
>
> ![](https://hackmd.io/_uploads/HJtuEPqb6.png)

> [🔗Mac 安裝 Git 教學](https://w3c.hexschool.com/git/fd6f6be)

> 使用 `git --version` 確認是否安裝成功

---

## 建議安裝的 VS Code Extension

搭配 VS Code 進行 Git 的操作會方便許多，我們可以安裝以下套件，讓提交的歷史紀錄以圖形化顯示

- [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)
  - 以圖像化表示 branch 跟 commit 紀錄，方便直觀進行 git command 快捷操作
    > ![](https://i.imgur.com/LiAIhw1.png)

---

以下建議可以開始搭配 VS Code 終端機操作

## 設定 Git config 內容

> 由於每次發佈檔案時，都會記錄該版本是哪位開發者變更的
>
> 因此初次需要設定姓名跟 Email

```
git config --global user.name "姓名"
git config --global user.email "Email"
```

> 將 "姓名" 跟 "Email" 換成個人資訊

以下為進階 Optional 設定

> 這個 git config 檔案設定了一些 Git 與 VS Code 的整合設定，讓你可以在使用 Git 時使用 VS Code 作為編輯器、差異檢視工具和合併工具。以下是各個設定的指令說明：

1. 編輯器設定:

   - 指令: `git config --global core.editor "code --wait"`
   - 功能: 將 VS Code 設定為全域（global）的 Git 編輯器，使用 `code --wait` 命令開啟 VS Code 並等待編輯器關閉後再繼續 Git 操作。

2. 差異檢視工具設定:

   - 指令: `git config --global diff.tool vscode`
   - 功能: 設定 VS Code 為差異檢視工具，當使用 `git diff` 命令時，Git 會使用 VS Code 來顯示差異。

3. VS Code 差異檢視工具設定:

   - 指令: `git config --global difftool.vscode.cmd "code --wait --diff $LOCAL $REMOTE"`
   - 功能: 設定使用 VS Code 作為差異檢視工具的命令，當你執行 `git difftool` 命令時，Git 會使用 VS Code 打開兩個檔案的差異。

4. 合併工具設定:

   - 指令: `git config --global merge.tool vscode`
   - 功能: 設定 VS Code 為合併工具，當執行 `git merge` 命令時，Git 會使用 VS Code 來進行合併操作。

5. VS Code 合併工具設定:
   - 指令: `git config --global mergetool.vscode.cmd "code --wait $MERGED"`
   - 功能: 設定使用 VS Code 作為合併工具的命令，當執行 `git mergetool` 命令時，Git 會使用 VS Code 打開合併後的檔案。

這些設定可以通過在終端機或命令提示字元中輸入相應的指令進行配置。請確保已經在系統中安裝了 Git 和 VS Code，以及將 `code` 命令設定為可從終端機中啟動 VS Code 的全域指令。

- 查看已設定的 Git config

```bash
git config --list
```

> 也可以直接修改 Windows user/Linux home 資料夾底下的.gitconfig 檔案
>
> 例如：
> `C:\Users\user\.gitconfig`
> 或
> `/home/user/.gitconfig`

```txt
[user]
  email = example@gmail.com
  name = your_name
[core]
  editor = code --wait
[diff]
  tool = vscode
[difftool "vscode"]
  cmd = code --wait --diff $LOCAL $REMOTE
[merge]
  tool = vscode
[mergetool "vscode"]
  cmd = code --wait $MERGED
```

## 建立 Local Repo (本地數據庫)

1. cd 到想存放 Repo 的資料夾
2. 執行 `git init`
   > 應可看到以下資訊

```
Initialized empty Git repository in "專案路徑"/.git/
```

## 檔案追蹤與提交版本 (add and commit)

### git add

當我們在 workdir 進行了檔案的任何變更，包含新增、檔名或內容的修改、刪除等，此時這些變更是尚未被追蹤的。
舉例，創建一個 index.html 的檔案，使用 `git status` 會看到以下資訊

```
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        index.html

nothing added to commit but untracked files present (use "git add" to track)
```

意思是 Git 偵測到一個未追蹤的檔案為 `index.html`，將它加入 stage 就可以追蹤它 (track)，將檔案加入到 stage 使用

```
git add <檔案名稱>
```

如 `git add index.html`
會產生以下結果

```
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   index.html
```

> ![](https://hackmd.io/_uploads/rJBF5vs-6.jpg)

### git commit

stage 中的檔案就是被追蹤 (經過 git add) 後的檔案清單，將檔案從 stage 加入到 Local Repo 使用

```
git commit -m "<填寫版本資訊(即commit log)>"
```

例如 `git commit -m "feat: 新增網頁標題"`
接著就能在 `git status` 看到結果：

```
On branch main
nothing to commit, working tree clean
```

接著可以使用 `git log`，查看 commit 的紀錄

```
commit ef070ed2cc39d72e203822a6e1ffd89d3be52f1e (HEAD -> main)
Author: Charles5277 <abcd854884@gmail.com>
Date:   Sat Mar 25 15:40:00 2023 +0800

    feat: 新增網頁標題
```

#### 修改上次的 commit 訊息跟檔案內容

當剛進行 commit 後，突然想修改 commit 的 message，或是想多加、多刪除內容，可以使用 `git commit --amend -m "要修改的訊息"` ，若此時 stage 區沒有其他變更，就只會變更 message，如果 stage 區有內容，會直接把 stage 區合併進去

若使用 vscode 的 "提交暫存 (修改)" 功能
![](https://i.imgur.com/clCCpOT.png)
此時 workdir 有內容，但 stage 區是空的，會詢問是否要將 workdir 的內容直接丟上去，此時若不想使用 never 功能，又不想先清空 worktree，以及使用 stash (隱藏) 功能的話，可以直接在終端機打上述指令，就可以不影響 worktree，單純改 commit

#### 約定式提交 (Conventional Commits)

不同人在寫 commit 時可能會有自己的習慣，導致當多人維護 repo 時，commit log 會難以閱讀，因此我們需要遵循統一的約定式提交規範

- 以下是如果沒有規則，會發生的事情：

  > ![](https://hackmd.io/_uploads/HkAZiwqWT.png)
  >
  > ![](https://hackmd.io/_uploads/r1xQoD5-a.png)
  >
  > ![](https://hackmd.io/_uploads/S19msw5ba.png)
  >
  > 以上這些提交描述「First Beautiful Commit」、「Fix again」、「Another one」都無法讓未來追程式碼的人立刻理解「改了什麼」和「為何要這樣修改」。因此，導入約定式提交能讓團隊成員強制遵守固定的規範和格式，填寫適當的內容。

  > 參考素材來源：[約定式提交 Conventional Commits - by Summer。桑莫。夏天](https://www.cythilya.tw/2021/03/16/conventional-commits/)

- 清楚詳細的撰寫範例
  > 參考素材來源：[Git Commit Message 這樣寫會更好，替專案引入規範與範例 - by WadeHuang 的學習迷航記](https://wadehuanglearning.blogspot.com/2019/05/commit-commit-commit-why-what-commit.html)
  > 參考素材來源：Charles 的團隊專案
  >
  > - 加上 icon 前
  >   ![](https://hackmd.io/_uploads/H1we0w5W6.png)
  > - 加上 icon 後
  >   ![](https://hackmd.io/_uploads/HkFmRDqba.png)<br> > ![](https://hackmd.io/_uploads/Byo_Rwq-6.png)

以下遵照 Angular 風格，提供範例

```
<icon><space><type>(<scope>):<space><subject><enter><body><enter><footer>
```

- `<icon>`

  > 建議遵循 gitmoji 規則使用 icon，以及對應的 type 關係
  > [gitmoji | An emoji guide for your commit messages](https://gitmoji.dev/)

- `<space>`

  > 單純一個空白字元

- `<type>`

  > 以我使用 extension 所自訂的 config 為例，提供了以下這些，有些版本可能不會拆分這麼多細項，只需與協作夥伴協調好要使用的 type 清單即可

  - 🔀merge
    > 合併分支
  - 🧹chore
    > 小幅度修改，包含修改註解或顯示文字等
  - ✨feat
    > 新增功能
  - 🐛fix
    > 修復 bug
  - 🔨refactor
    > 重構現有程式碼，無新增功能或修復 bug
  - 🧪test
    > 更新測試檔案
  - 🎨style
    > 調整 code 風格或 UI 樣式，不影響程式碼的內容。例如縮排、分號、空格、CSS 變更等。
  - 📝docs
    > 修改說明文檔
  - 📦build
    > 新增、更新或刪除依賴 package
  - 🚀deploy
    > 部屬新版本
  - 🚑hotfix
    > 緊急修復發行版本的錯誤
  - ⏪revert
    > 抵銷目標版本
  - 👷ci
    > 更新 CI 配置，例如 Docker、GitHub Action、k8s 等設定檔
  - 🎉init
    > 初始化專案

- `<scope>`

  > 影響的範圍，例如專案中的特定層面，非必填

- `<subject>`

  > \[必填] 50 字內簡短敘述，不須加句號

- `<body>`

  > 詳細敘述，可以分成多行，單行不要超過 72 字元，非必填

- `<footer>`
  > 如果有的話，填寫對應的 issue，例如 #17，非必填

> 以上參數皆可依照團隊需要將規範調整，但需要確保所有協作夥伴有共識，才能維持 repo 的 commit 整齊性

#### 輔助 commit log 工具 - `git-commit-plugin`

> VS Code 可自定義，最方便的 git commit extension

- 功能介紹

  互動式介面創建約定式提交

  > ![](https://i.imgur.com/lcT0wU0.png)
  >
  > ![](https://i.imgur.com/Hc5psjw.png)

  點擊 Complete 後即自動產生 commit 格式

  > ![](https://i.imgur.com/PP9b1XP.png)

  使讓多人協作 repo 時，commit 風格統一

## 分支管理

### git branch

#### 關於 HEAD

HEAD 是一個指標，代表你目前指定的版本狀態，HEAD 可以指到

- branch

  > 分支，預設有一主線為 main
  > 由 snapshot (或稱 commit 節點) 組成，多個分支可以共享相同的節點

  > 從 2022/10 開始，Github 的預設分支主線由 master 改為 main，而 git 預設仍為 master

- commit 版本
  > git graph 上的節點，可以透過 `git log` 查看 hash 來指定 HEAD 移動到該節點

要將 HEAD 指到 commit 版本，可以使用 `git switch -d <hash>`
執行 `git log`

```
commit 5cac503a14baec3ad3da6618f08f577ae048567b (HEAD -> main)
Author: Charles5277 <abcd854884@gmail.com>
Date:   Thu Mar 30 16:22:48 2023 +0800

    feat: 新增css檔案

commit ef070ed2cc39d72e203822a6e1ffd89d3be52f1e
Author: Charles5277 <abcd854884@gmail.com>
Date:   Sat Mar 25 15:40:00 2023 +0800

    feat: 新增網頁標題
```

執行 `git switch -d ef070ed2cc39d72e203822a6e1ffd89d3be52f1e`
再執行 `git log`

```
commit ef070ed2cc39d72e203822a6e1ffd89d3be52f1e (HEAD)
Author: Charles5277 <abcd854884@gmail.com>
Date:   Sat Mar 25 15:40:00 2023 +0800

    feat: 新增網頁標題
```

> 此時 HEAD 單獨指在第一個版本，而 main 目前在第二個版本

將 HEAD 移回最新狀態
執行 `git swtich main`
及 `git log`

```
commit 5cac503a14baec3ad3da6618f08f577ae048567b (HEAD -> main)
Author: Charles5277 <abcd854884@gmail.com>
Date:   Thu Mar 30 16:22:48 2023 +0800

    feat: 新增css檔案

commit ef070ed2cc39d72e203822a6e1ffd89d3be52f1e
Author: Charles5277 <abcd854884@gmail.com>
Date:   Sat Mar 25 15:40:00 2023 +0800

    feat: 新增網頁標題
```

#### 創建分支

使用 `git branch <新分支名稱>` 創建分支
這個新分支會以當前 HEAD 指到的位置作為起點

```bash
git branch dev
```

或使用 `git switch -c <新分支名稱>`
可以直接在創建後同時將 HEAD 指過去

```bash
git switch -c dev
```

#### HEAD 指向 commit 跟 branch 的差別

HEAD 身為指標，一次只能指向一個目標
先前提到 HEAD 可以指定在 branch 或某個 commit 版本
目前的 git graph 如圖
![](https://i.imgur.com/3rmt1VP.png)
有 2 個 branch，分別為 main 跟 dev

- 情況 1 HEAD 指向 main

  > 使用 git switch main

  ![](https://i.imgur.com/ZgiEy6M.png)

  ```bash
  git switch main
  git log
  ```

  得到結果

  ```
  commit 5cac503a14baec3ad3da6618f08f577ae048567b (HEAD -> main, dev)
  Author: Charles5277 <abcd854884@gmail.com>
  Date:   Thu Mar 30 16:22:48 2023 +0800

      feat: 新增css檔案
  ```

  > 標示為 (HEAD -> main, dev)，代表 HEAD 指向 main，而 dev 分支目前也處在同個版本

- 情況 2 HEAD 指向 dev

  > 使用 git switch dev

  ![](https://i.imgur.com/2dl1O9c.png)

  ```bash
  git switch dev
  git log
  ```

  得到結果

  ```
  commit 5cac503a14baec3ad3da6618f08f577ae048567b (HEAD -> dev, main)
  Author: Charles5277 <abcd854884@gmail.com>
  Date:   Thu Mar 30 16:22:48 2023 +0800

      feat: 新增css檔案
  ```

  > 標示為 (HEAD -> dev, main)，代表 HEAD 指向 dev，而 main 分支目前也處在同個版本

- 情況 3 HEAD 指向 commit 版本

> 使用 `git switch -d <hash>`
> 此處以 `git switch -d 5cac503a14baec3ad3da6618f08f577ae048567b` 示範
> 對應圖上的 C2

![](https://i.imgur.com/ERIXxUj.png)

```bash
git switch -d 5cac503a14baec3ad3da6618f08f577ae048567b
git log
```

得到結果

```
commit 5cac503a14baec3ad3da6618f08f577ae048567b (HEAD, main, dev)
Author: Charles5277 <abcd854884@gmail.com>
Date:   Thu Mar 30 16:22:48 2023 +0800

    feat: 新增css檔案
```

> 標示為 (HEAD, main, dev)，可以理解為 HEAD 指向了這個 commit 版本，而 main 跟 dev 的版本狀態也在這個版本

#### 分支差異

目前 main 跟 dev 兩個 branch 都在 5cac50 的版本上，現在我們試著在 dev 上更新版本

![](https://i.imgur.com/dA8Gy7t.png)

此時對於 main 來說只有兩筆 commit 紀錄

```bash
git switch main
git log
```

```
commit 5cac503a14baec3ad3da6618f08f577ae048567b (HEAD -> main)
Author: Charles5277 <abcd854884@gmail.com>
Date:   Thu Mar 30 16:22:48 2023 +0800

    feat: 新增css檔案

commit ef070ed2cc39d72e203822a6e1ffd89d3be52f1e
Author: Charles5277 <abcd854884@gmail.com>
Date:   Sat Mar 25 15:40:00 2023 +0800

    feat: 新增網頁標題
```

#### 刪除分支

若需要刪除分支，請將 HEAD 移到其他分支後，使用 `git branch -d <branch_name>` 將分支刪除，若刪除後該分支會有 commit 紀錄丟失，則會跳出警告，請將該分支目前的進度合併到其他 branch 上，再刪除該 branch

若不在意刪除該 branch 後會有 commit 丟失，則可以使用 `git branch -D <branch_name>`

使用 - D 刪除後，該分支上的節點若沒有其他分支共同持有，則會直接消失，所以請配合 git graph 等 git 分支圖檢視工具確認是否會丟失非預期的 commit 節點

### git merge

#### branch merge - fast forward (分支合併 - 快轉模式)

目前 main 跟 dev 在同一條線上，因為 main 的位置是 dev 的起點。
而且 main 的版本比 dev 舊，此時要將 main 更新到 dev 時，
可以使用 `git switch main` 切換到 main 後
使用 `git merge dev -e`，將 main 更新到 dev 的位置
![](https://i.imgur.com/Bb26KZv.png)

#### branch merge - no fast forward (分支合併 - 不進行快轉)

若我們想要在上述情況產生另外的合併紀錄，而不是看起來都是一條直線往前推進的話，可以在 merge 時加上參數，改為 `git merge dev --no-ff`
![](https://i.imgur.com/yicGzKj.png)
若使用 git graph、git lens 等套件進行 merge，可能會有自動產生 message 而無法編輯的情況，若希望自定 merge 時的 message，可以直接使用 `git merge dev --no-ff -m "message"`，或是使用 `git merge dev --no-ff -e`，會在輸入後跳出編輯視窗讓你輸入訊息

若在 main 在進行與 dev 的合併前，已經有新的 commit 版本
![](https://i.imgur.com/bMWHVib.png)
則嘗試進行合併時，就自動不會執行 fast forward
![](https://i.imgur.com/2Ggpagf.png)

> 若要將 main 保持主線，而不想在某次 merge 變成支線，需特別注意合併時，
> 必須將 HEAD 移到 main，再執行 merge 其他分支，才能形成其他分支匯入 main 的效果

#### 合併訊息填寫

當使用 vscode 進行 git merge 合併時，有使用 `-e` 參數進行編輯合併訊息，會出現以下視窗
![](https://i.imgur.com/Np1wcnY.png)
第一行就是會成為紀錄的 merge 訊息，下方的註解區可以忽略或刪除
編輯完訊息後只需存檔，並關閉檔案就會完成合併

#### 進階合併分支

![](https://i.imgur.com/ijjm0QE.png)
![](https://i.imgur.com/yu1nv6x.png)

第二次從 dev 匯入 main 時，顏色變更的原因是，先前都是以 main 去 merge dev，
因此 main 會取得 dev 的所有 commit 紀錄跟變更。

而此處在 main 進行 merge dev 後，再將 dev 進行 merge main
此舉會讓 main 跟 dev 都進展到同樣的進度上，之後 dev 再繼續推展，
接著 main 又進行 merge dev。

#### 合併衝突處理

### git rebase

rebase 中文翻譯成重訂基底，使用 `git rebase` 對分支進行管理

rebase 的作用跟 merge 同樣為合併分支，實際應用場景有 2 類：

#### 濃縮 commit

當我們在同一條 branch 上 commit 太多版本，想把一部分的 commit 合併成一個時，可以使用 `git rebase -i HEAD~數字`進行合併

範例如下：
![](https://i.imgur.com/OCxbraR.png)
使用 `git rebase -i HEAD~3`
![](https://i.imgur.com/q4K8IID.png)
依序為
HEAD~~3
HEAD~~2
HEAD\~1

假設要把 HEAD\~1 跟 HEAD\~2 併到 HEAD\~3
即將要拿掉的 commit 的 pick 改成 squash
![](https://i.imgur.com/It80IuQ.png)
然後存檔，關閉此檔案
![](https://i.imgur.com/yKYg0oR.png)
接著會跳出這些檔案原本的 commit 紀錄，此時將內容全部註解掉，再到最上方編輯 commit 訊息 (若有裝 git-commit-plugin 可以將引導生成的 commit 訊息複製後貼過來
![](https://i.imgur.com/i4sviwX.png)
然後存檔，關閉此檔案
如果有使用 git graph 等，需要按一下重新整理，即可看到濃縮完成
![](https://i.imgur.com/LW1F2DX.png)

若完成後想取消操作，可以按照 [reset --hard 取消](#使用reset---hard後想反悔)的方式

#### 將目前分支整根接到其他分支上

使用 `git rebase <目標分支>`
將當前 branch 追朔到根源，剪下後接到 <目標分支> 上
![](https://i.imgur.com/NL6ny2g.png)

此處試著將 test 接到 dev 上，使用 `git rebase dev`
由於 test 的原基底為 10a197eb
因此會將 2c3b8450 跟 df043ca4 剪下接到 dev 上
![](https://i.imgur.com/qbgqRgT.png)

## 遠端數據庫 (Remote Repo)

### Local Repo 與 Remote Repo 的綁定

- `git remote`

  > 查看 remote repo 列表的 branch 簡稱

  - `git remote add <remote repo簡稱的branch簡稱> <url>`
    > 添加 remote repo
  - `git remote -v`
    > 觀看 remote repo 的 branch 列表 (包含 url)
  - `git clone <url>`

    > 下載 remote repo

    > 當進行 git clone 時，會將 remote repo 下載到當前的資料夾，並且自動執行 `git remote add origin`，因此若執行 `git remote`，就會看到已經自動產生了 origin

### 將 Local Repo 更新到 Remote Repo

- `git push`
  > 將 local repo 推送同步到 remote repo (github)
  - `git push <數據庫簡稱> <分支名稱>`
    > clone 後的 remote 預設會設為 origin，且 github 等主流 remote repo 的預設分支為 main，因此可以使用
    > `git push origin main`
    > 或直接使用 `git push`
  - `git push -f`
    > 強行將 Local Repo 覆寫到 Remote Repo
    > 在本地進行 reset、rebase 等操作後，若執行 pull 或 sync 都會被 Remote Repo 覆蓋操作，因此需要先使用 `git push -f` 將較舊的狀態覆寫到 Remote Repo

### 更新 Local Repo 變成 Remote Repo 狀態

- `git fetch`
  > 將 Remote Repo 的內容下載到 Local Repo
- `git pull`
  > 將 Remote Repo 的內容抓下來並且合併對應的 branch
  > 相當於 git fetch + git merge
  > 有合併衝突時與 git merge 處理流程相同

#### fetch 跟 pull 的使用時機

使用 fetch 當抓下來的資料還不想立即合併，例如 worktree 尚未清空，但想先將 Remote 目前 commit 狀態下載時

#### 先拉再推 (The First Pull and Push)

當多人協作時，想將 Local Repo Push 到 Remote Repo 時可能會發生衝突，因此會遵照「先拉再推」的準則
也就是執行 `git pull` 再執行 `git push`
若使用 VS Code 可以使用 Sync 功能一鍵完成這兩步

另外，這麼做會導致 pull 下來有需要合併 branch 時會自動產生 merge 的 commit 紀錄，如果不希望產生的話，必須改使用 `git pull --rebase` 再 `git push`，等同以 rebase 取代 merge

而使用 VS Code 時，可以在設定的 `git.rebaseWhenSync` 指定 Sync 時是否要 Rebase，預設為否
![](https://i.imgur.com/SicTje0.png)

## 恢復、撤銷變更

### git restore

- `git restore <file_name>`
  > 將檔案的變更捨棄 (只限定未放到 stage 區的 workdir 變更)
  > 預設即為 - W (worktree)
  > 因此 `git restore -W <file_name>` 的效果是一樣的
- `git restore -S <file_name>`
  > 將檔案從 stage 區移回 workdir (但內容變更不改變)
  > 相當於取消 git add
- `git restore -W -S <file_name>`
  > 一次完成從 stage 區直接捨棄變更

#### 從其他 commit 拿檔案

- `git restore -s <hash/branch> <file_name>`
  > 抓某個 commit 版本的指定檔案到目前的 workdir

### git reset

當我們想要取消最近一次的 commit 操作時，可以使用 `git reset HEAD~`，若要取消當前 branch 的多筆 commit 可以使用 `git reset HEAD~數字`或 `git reset HEAD~..~`，例如想要取消 3 筆可以用 `git reset HEAD~~~` 或 `git reset HEAD~3`

原本最新的變更會退回到 worktree 的 workdir，若確定退回後不需要這些變更紀錄，可以使用 `git reset HEAD~ --hard`

當我們是要帶著 HEAD 當前指向的 branch 變更到指定位置，可以使用 `git reset <hash>` 或 `git reset <branch_name>` 將當前 branch 直接變更為指定 commit 的狀態，同樣可以選用 `--hard` 將原本位置的檔案變更捨棄

#### 使用 reset --hard 後想反悔

當誤用 `git reset --hard` 刪掉 commit 紀錄後，可以用 `git reflog` 找回操作的所有歷史紀錄，找到想要復原 commit 的 hash 值，再透過 `git reset <hash>` 將當前的 branch 指回該 commit 即可

#### 搭配 Git Graph

![](https://hackmd.io/_uploads/Hyw85q7Gp.png)

- Soft：提交過的 commit 放到暫存區、當前 worktree 保留，
- Mixed：提交過的 commit 放到工作目錄、當前 stage 清除、workdir 保留
- Hard：提交過的跟當前變更都不要了，直接變成目標的狀態

> 指令預設採 Mixed 模式，可以改指定 `--hard` 或 `--soft`

### git revert

> 否決掉某個指定的版本

當 branch 發展到一半，突然想改掉某個版本的設定，就會使用 `git revert`，但 revert 的操作不像 rebase，並不會影響先前的 commit 紀錄，而是以新增 commit 的方式反向抵銷指定版本的操作，由於在 git 的檔案變更邏輯是以 `+` `-` 標示每行的異動狀況，因此進行 revert 時只要不是涉及 merge 的情況，大多能自動完成反向操作

`git revert <指定的commit>`
會自動產生對指定 commit 的反向操作

#### 同樣可以搭配 Git Graph

![](https://hackmd.io/_uploads/ryw1GhQM6.png)

同時 revert 指定 commit 會參照該 commit 的前一個節點
若要恢復的版本，來源是 2 個以上的分支匯集，則需要指定 `-m` 參數
![](https://i.imgur.com/rlnmiDm.png)
如圖，da3d4ab 是由 2 個分支組成，`git revert da3d4ab` 會無法得知應該參照的前一個節點應該取哪條分支，由左到右從 1 開始排序，因此若要參照 parent1 需要使用 `git revert da3d4ab -m 1`

### reset、revert，以及合併分支的 rebase/merge 使用取捨

由於 reset 跟 rebase 都會變更歷史 commit 紀錄，可以做到濃縮、減少、刪除 commit 等效果，因此較不建議使用在已經 push 到 Remote Repo 的情況，因為這代表需要用 `git push -f` 做強行推送，蓋掉原先的 commit，在多人協作中容易產生困擾，因此若要在已經 push 到 Remote Repo 的情況使用 reset 跟 rebase 需要確定取得協作夥伴的共識

而 revert 就可以放心地使用，不過每次使用 revert 都會產生更多的 commit 紀錄，會造成 commit 更加臃腫

因此必要的時候在遠端使用 rebase 濃縮，或多開 branch 整理分支也是優化開發環境的好選擇

## worktree 打包隱藏

### git stash

在進行 git 的日常操作時常有要求當前 worktree 必須淨空的條件，此時可以選擇將目前的變更 commit 或捨棄，但如果臨時想要先打包起來，進行完操作後再解開，可以使用 `git stash`，將目前的 worktree (包含 workdir 跟 stage 區一起) 打包並隱藏，要還原回來時使用 `git stash apply`

若有多個 stash 要管理，可以使用以下指令

- `git stash save "message"`

  > 在建立 stash 時加上備註。

- `git stash list`

  > 列出所有 stash。

- `git stash clear`
  > 刪除所有 stash

> 其餘指令使用 stash@{n} 即可指定第 n 個 stash

> 若使用 stash 則指定目前最新的

- `git stash show`

  > 顯示最新 stash 的詳情

- `git stash@{n} branch <branch_name>`

  > 創建一個新的分支，並將第 n 個 stash 的內容丟進去

- `git stash drop stash@{n}`
  > 刪除第 n 個 stash。

#### 搭配 VS Code + Git Graph

常用組合

- 將整個 worktree 打包
  ![](https://hackmd.io/_uploads/S1a1Q2Qza.png)
- 透過 Git Graph 管理 Stash
  ![](https://hackmd.io/_uploads/H1NHXh7G6.png)

> 搭配[🔗VS-Code-Git 介面中英對照表](#vs-code-git介面中英對照表)

## Git Command 總覽

- `git init`

  > 當前位置創建 Local Repo

- `git config`

  > 設定檔相關操作

  - `git config --list`
    > 查看目前設定檔

- `git add <檔案名稱>`

  > 將檔案從 workdir 加入 stage

- `git commit -m "<填寫說明訊息>"`

  > 將 stage 區提交到 local repo，並加上 commit log

  - `git commit --amend -m "要修改的訊息"`
    > 修改最近一次的 commit 訊息，或是連同檔案修改內容一同變更

- `git log`

  > 查看當前有效的版本紀錄 (即 commit history)
  > 不會查看到已經斷開連接 (沒有任何 branch 或 HEAD 綁定) 的 commit，需要的話請往下使用 git reflog

- `git switch`

  - `git switch <branch>`
    > 切換 HEAD 到指定分支
    > 需要先清空 worktree
    > 若 stage 區還有資料未 commit、workdir 有還沒 add 到 stage 區的內容，需要先處理
    - `git switch main`
      > 回到最新版本主線
    - `git switch -f <branch>`
      > 強制切換分支，直接捨棄 worktree 中未 commit 的內容
  - `git switch -d <hash>`
    > 切換 HEAD 到 commit 節點，可以先透過 git log 查看 hash
    > d 指的是 detach，讓 HEAD 指向節點，非指向 branch 的狀態
  - `git switch -c <new_branch>`
    > 創造新的分支並將 HEAD 切過去

- `git remote`

  > 查看 remote repo 的 branch 列表

  - `git remote add <remote repo的branch簡稱> <url>`
    > 添加 remote repo
    > 可以在一個 local repo 中添加多個 remote repo branch
  - `git remote -v`
    > 觀看 remote repo branch (包含 url)
  - `git clone <url>`
    > 下載 remote repo

- `git push`

  > 將 local repo 更新到 remote repo

  - `git push`
    > 推送到 Remote Repo 預設的名稱：origin，到預設的分支：main
    > 等同 git push origin main
  - `git push -f`
    > 強行將 Local Repo 覆寫到 Remote Repo

- `git pull`

  > 將 remote repo 更新到 local repo

- `git branch`

  - `git branch -a`
    > 查看所有現有分支
  - `git branch <新分支名稱>`
    > 在 HEAD 處創建新 branch
  - `git branch -d <分支名稱>`
    > 將分支刪除，若有未合併的 commit 會提示並阻止，需要合併到其他分支後才能順利刪掉
  - `git branch -D <分支名稱>`
    > 將分支強行刪除，若有未合併的 commit 會直接丟棄
  - `git branch -m <原名稱> <新名稱>`
    > 將某個分支更名

- `git merge`

  - `git merge <分支名稱>`
    > 將 HEAD 指向的 branch 跟 <分支名稱合併>
  - `git merge <分支名稱> --no-ff`
    > 指定不使用 fast forward 快進模式合併，而是留下分支線紀錄
  - `git merge <分支名稱> --no-ff -m <訊息>`
    > 指定不使用 fast forward，且自訂 merge 時的訊息
  - `git merge <分支名稱> -e`
    > 在合併前編輯 message

- `git cherry-pick`

- `git cherry-pick <hash>`

  > 將某個 commit 單獨複製到當前分支上

  - `git cherry-pick <start-hash>..<end-hash>`
    > 將 start 到 end 的 commit 都擷取

- `git cherry-pick <hash> -e <target-branch>`

  > 將指定 commit 單獨複製到指定分支上 (而非當前分支)

- `git restore`

  - `git restore <file_name>`
    > 將檔案的變更捨棄 (只限定未放到 stage 區的 workdir 變更)
    > 預設即為 - W (worktree)
    > 因此 `git restore -W <file_name>` 的效果是一樣的
  - `git restore -S <file_name>`
    > 將檔案從 stage 區移回 workdir (但內容變更不改變)
    > 相當於取消 git add
  - `git restore -W -S <file_name>`
    > 一次完成從 stage 區直接捨棄變更
  - `git restore -s <hash/branch> <file_name>`
    > 抓某個 commit 版本的指定檔案到目前的 workdir

- `git reset`

  > 將 HEAD 目前所在的 branch 帶著移動到指定位置

- `git reset <hash> [--mixed]`

  > 預設就是 mixed，所以可以不用加
  > 將 HEAD 指向的 branch 帶到指定的 commit 節點上
  > 原本位置的 commit 檔案狀態回到 workdir

  - `git reset <hash>/HEAD~數字 --soft`
    > 同 mixed，差在退回 stage 而不是 workdir
  - `git reset <hash> --hard`
    > 同上，原本位置的 commit 檔案變更捨棄
  - `git reset HEAD~數字`
    > 將 HEAD 指向的 branch 返回線上前幾個的版本
    - `git reset HEAD~`
      > 將上一個 commit 的紀錄取消
      > 使用 --hard 同樣可以拋棄檔案變更

- `git rebase`

  > 重新訂定該 branch 的基底 (起點)

  - `git rebase -i HEAD~數字`
    > 將同 branch 上多個 commit 濃縮合併
  - `git rebase <目標分支>`
    > 將當前 branch 追朔到根源，剪下後接到 <目標分支> 上

- `git revert`

  - `git revert <指定的commit>`
    > 否定某個 commit 紀錄，自動進行反操作，試圖回到其 commit 的上一版狀態
  - `git revert <指定的commit> -m <parent_number>`

    > 當 commit 為多個分支匯入，有多個「上一個 commit」時，由左到右從 1 開始排序，要指定最左邊的 branch 使用 `git revert <指定的commit> -m 1`

    > ' 左 '/' 右 ' 為 Git Graph 的相對表示

- `git reflog`

  > 查看所有操作紀錄
  > 常用於救回已經斷開連結的 commit 紀錄

- `git stash`

  > 將 worktree 打包隱藏

  - `git stash -u`

    > 將.gitignore 的檔案也加入

  - `git stash save "message"`

    > 在建立 stash 時加上備註。

  - `git stash list`

    > 列出所有 stash

  - `git stash clear`
    > 刪除所有 stash

  > 使用 stash@{n} 即可指定第 n 個 stash
  > 若使用 stash 則指定目前最新的

  - `git stash show`
    > 顯示最新 stash 的詳情
  - `git stash@{n} branch <branch_name>`
    > 創建一個新的分支，並將第 n 個 stash 的內容丟進去
  - `git stash drop stash@{n}`
    > 刪除第 n 個 stash

## VS Code Git 介面中英對照表

> 未寫說明為上述有完整介紹或使用頻率較低的功能

### 主選單

|    中文    |    英文     |       說明       |
| :--------: | :---------: | :--------------: |
| 檢視及排序 | View & Sort |                  |
|    提取    |    Pull     |                  |
|    推送    |    Push     |                  |
|    複製    |    Clone    |                  |
|  簽出至…   | Checkout to | 對應新版 Switch  |
|    擷取    |    Fetch    |                  |
|    提交    |   Commit    |                  |
|    變更    |   Changes   | 對應新版 Restore |
| 提取、推送 | Pull、Push  |                  |
|    分支    |   Branch    |                  |
|    遠端    |   Remote    |                  |
|    隱藏    |    Stash    |                  |
|    標籤    |    Tags     |                  |

### 提交

|                中文                |                   英文                   |                                      說明                                       |
| :--------------------------------: | :--------------------------------------: | :-----------------------------------------------------------------------------: |
|          提交<br>提交暫存          |          Commit<br>Commit Stage          |                           實務上兩者無差別<br>\* 註 1                           |
|              全部提交              |                Commit All                |           將 worktree 變更直接 commit<br>包含未 add 到 stage 區的變更           |
|            復原上個提交            |             Undo Last commit             |                         相當於 git reset HEAD\~ --soft                          |
|            中止重訂基底            |               Abort Rebase               |                                取消 Rebase 操作                                 |
| 提交暫存 (修改)<br>全部提交 (修改) | Commit Stage(Amend)<br>Commit All(Amend) |                         參考 [git commit](#git-commit)                          |
|         提交暫存 (已登出)          |         Commit Stage(Signed off)         | 增加簽章驗證<br>通常為嚴謹的 Repo、<br>特定的開源 Repo 才會要求<br>一般不會使用 |
|         全部提交 (已簽章)          |          Commit All(Signed off)          |                                                                                 |

> \* 註 1：若 Stage 區有內容，只會送出 Stage 區；<br>若 Stage 區沒有內容，則會詢問是否要順便加到 Stage 區並做 Commit
>
> ![](https://hackmd.io/_uploads/B1tJSBYZ6.png)

### 變更

|       中文       |        英文         |               說明               |
| :--------------: | :-----------------: | :------------------------------: |
|   暫存所有變更   |  Stage All Changes  | 參考 [git restore](#git-restore) |
| 取消所有暫存變更 | Unstage All Changes |                                  |
|   捨棄所有變更   | Discard All Changes |                                  |

### 提取、推送

| 中文            | 英文                   | 說明                                        |
| --------------- | ---------------------- | ------------------------------------------- |
| 同步處理        | Sync                   | 先 git pull<br>再 git push 的整合快捷       |
| 提取            | Pull                   | 參考 [Remote Repo](#遠端數據庫-remote-repo) |
| 提取 (重訂基底) | Pull(Rebase)           |                                             |
| 從… 提取        | Pull from…             | Pull Remote Repo 的指定 Branch              |
| 推送            | Push                   |                                             |
| 推送至…         | Push to                | 當有多個 Remote Repo 時以此指定             |
| 擷取            | Fetch                  |                                             |
| 擷取 (剪除)     | Fetch Prune            |                                             |
| 從所有遠端擷取  | Fetch From All Remotes |                                             |

### 分支

|        中文        |          英文          |                       說明                        |
| :----------------: | :--------------------: | :-----------------------------------------------: |
|      合併分支      |      Merge Branch      |           參考 [git merge](#git-merge)            |
|   重訂基底分支…    |     Rebase Branch      |           參考 [git rebase](#git-merge)           |
|      建立分支      |     Create Branch      |                                                   |
| 從下列來源建立分支 |   Create Branch From   |        switch 到指定位置後，建立新 branch         |
|    重新命名分支    |     Rename Branch      |                                                   |
|      刪除分支      |     Delete Branch      |                                                   |
|      發布分支      |     Publish Branch     | 將 HEAD 當前的 branch<br>更新並綁定到 Remote Repo |
|    擷取 (剪除)     |      Fetch Prune       |                                                   |
|   從所有遠端擷取   | Fetch From All Remotes |                                                   |

### 遠端

|      中文      |     英文      |                    說明                     |
| :------------: | :-----------: | :-----------------------------------------: |
| 新增遠端存取庫 |  Add Remote   | 參考 [Remote Repo](#遠端數據庫-remote-repo) |
| 移除遠端存取庫 | Remove Remote |                                             |

### 隱藏

|             中文              |           英文            |                 說明                 |
| :---------------------------: | :-----------------------: | :----------------------------------: |
|           擱置變更            |           Stash           | 參考 [Worktree 打包隱藏](#git-stash) |
| 擱置變更 (包含未被追蹤的檔案) | Stash (Include Untracked) |                                      |
|         套用最新擱置          |    Apply Latest Stash     |                                      |
|           套用擱置…           |        Apply Stash        |                                      |
|        取回最近的擱置         |     Pop Latest Stash      |                                      |
|           取回擱置…           |        Pop Stash…         |                                      |
|         卸除隱藏項目…         |        Drop Stash…        |                                      |
|       卸除所有隱藏項目…       |     Drop All Stashes…     |                                      |

### 標籤

|   中文   |    英文    | 說明 |
| :------: | :--------: | :--: |
| 建立標籤 | Create Tag |      |
| 刪除標籤 | Remove Tag |      |
