---
title: Ubuntu 筆記
description: Ubuntu 操作入門筆記
date: 2024-09-11
lastUpdated: 2024-09-22 07:17:00 +8
category: Ubuntu
tags:
  - Linux
  - Ubuntu

prev: false
next: false
---

### shortcut

- 關閉 Terminal
  > exit 或 Ctrl + D
- 複製
  > Ctrl + Shift + C
  >
  > Ctrl + Insert
  >
  > 滑鼠中鍵按住拖曳
- 貼上
  > Ctrl + Shift + V
  >
  > Shift + Insert
  >
  > 點擊滑鼠中鍵

### command line editing

#### Cursor Movement

- Ctrl + a (ahead)
  > 將游標移到行首
- Ctrl + e (end)
  > 將游標移到行尾
- Ctrl + f (forward)
  > 方向鍵⬅️
- Ctrl + b (backward)
  > 方向鍵➡️
- Alt + f (forward)
  > 移到前一個 word (以空白分隔)
- Alt + b (backward)
  > 移到下一個 word (以空白分隔)
- Ctrl + l (clear)
  > 清除螢幕資訊

#### modifying text

- Ctrl + d (delete)
  > delete 鍵
- Ctrl + t (transpose)
  > 將當前字元跟前一個字元交換
- Alt + t (transpose)
  > 將當前 word 跟前一個 word 交換
- Alt + l (lowercase)
  > 當前位置到 EOF 轉為小寫
- Alt + u (uppercase)
  > 當前位置到 EOF 轉為大寫

#### cutting and pasting text

> 在 linux 又稱 killing and yanking

- Ctrl + k (kill)
  > 將當前位置到 EOF 剪下
- Ctrl + u (kill line)
  > 將當前位置到開頭剪下
- Alt + d (delete)
  > 將當前位置到當前 word 的結尾剪下
- Alt + backspace (delete word)
  > 將當前位置到當前 word 的開頭剪下，如果已經在開頭，則將前一個 word 剪下
- Ctrl + y (yank)
  > 貼上到當前位置

#### completion

- Tab (或 Alt + ?)
  > 可以自動完成當前 command、username、hostname、當前位置的檔案名稱等等
- Alt + \*
  > 將所有可用的參數插入

### command

> 使用 semicolon ( `;` ) 可以將多個 command 串在一起

- 查看目前使用的 shell

```bash
echo $0
# 通常可得到 bash 或 /usr/bin/bash
```

- 註解
  > 單行註解為 #
  > 多行註解為
  > << comment
  >        <內容>
  >     comment

```bash
# 內容

<< comment
內容
comment
```

- 時間

  - date (current time and date)
    > 當前時間跟日期
    ```bash
    date
    #Thu Mar  2 17:59:42 CST 2023
    ```
  - cal (calendar of the current month)
    > 這個月的月曆
    ```bash
    #from ncal
    cal
    << comment
         March 2023
    Su Mo Tu We Th Fr Sa
              1  2  3  4
     5  6  7  8  9 10 11
    12 13 14 15 16 17 18
    19 20 21 22 23 24 25
    26 27 28 29 30 31
    comment
    ```

- 硬碟資訊

  - df (current amount of free space on disk drives)
    > 硬碟空間資訊
    ```bash
    df
    ```
    ![](https://i.imgur.com/paflpni.png)

- 記憶體資訊

  - free (amount of free memory)
    > 記憶體使用情況
    ```bash
    free
    ```
    ![](https://i.imgur.com/C1g8rML.png)

- 當前工作目錄

  - pwd (print working directory)
    > 顯示當前工作目錄
    ```bash
    pwd
    #/home/charles
    ```

- 當前目錄資訊

  - ls (list the files and directories)

    > 顯示當前工作目錄中的檔案跟資料夾

    ```bash
    ls
    ```

    ![](https://i.imgur.com/WT1f4pn.png)

    > 顯示當前工作目錄中的檔案跟資料夾 (包含被隱藏的)

    ```bash
    #(all)
    ls -a
    ```

    > 顯示更多資料

    ```bash
    #(long listing format)
    ls -l
    ```

    > 使用多個參數

    ```bash
    ls -a -l
    ls -al
    ls -la
    #以上效果皆相同
    ```

    ![](https://i.imgur.com/ug61vbG.png)

    > 指定位置

    ```bash
    ls /usr
    ```

    > 指定多個位置

    ```bash
    ls ~ /opt
    ```

    ![](https://i.imgur.com/QEzRG5g.png)

- 移動目前位置

  - cd (change working directory)

    ```bash
    #回home directory
    cd

    #移動到當前目錄下存在的某個資料夾
    cd <filename>

    #移動到上層資料夾
    cd ..
     #或
    cd -

    #到某個user的home directory
    cd ~<user_name>
     #cd ~John

    ```

- 檔案內容資訊

  - file
    > 獲得 file_name 的資訊
    ```bash
    file <file_name>
    ```
  - less
    > 檢視文字檔案內容
    ```bash
    less <file_name>
    #以下指令進行操作
    << comment
        PageUp or b ：上一頁
        PageDown or space：下一頁
        Up arrow：上一行
        Down arrow：下一行
        G：移到檔案結尾
        1G or g：移到檔案開頭
        /：搜尋文字
        n：搜尋結果的下一筆
        h：顯示幫助訊息
        q：離開
    comment
    ```
  - zless
    > 檢視.gz (gzip) 的壓縮檔內容
    ```bash
    zless <file>
    ```

- 檔案管理

  - cp (copy)

    > 複製檔案跟資料夾

    - optional

      ```bash
      #cp 來源(資料夾或檔案) 目的地(資料夾或檔案)

      #複製item1的內容到item2
      cp item1 item2

      #複製item到directory (directory必須存在)
      cp item directory
      #複製多個item到directory
      cp item1 item2 item3 directory

      #複製dir1的內容到dir2 (只複製一層，子目錄不會被複製，且dir2必須存在)
      cp dir1/* dir2
      #複製dir1的內容(包含每一層子內容)到dir2 (若dir2不存在，自動建立dir2)
      cp -r dir1 dir2

      #以下指令進行操作
      << comment
          -a ：archive，將屬性、owner關係、檔案權限等保留，並且將子內容一起複製，若沒有使用-a，則會使用目的的位置的預設值重新配置
          -i：interactive，若覆蓋已存在的檔案前進行詢問
          -r：recursive，將子內容全部複製目的地，若來源是資料夾，則-a或-r是必填參數
          -u：update，將目的地不存在的檔案跟資料夾加入，以及存在同名稱但更改時間比我早的檔案進行複寫
          -v：verbose，詳細模式，顯示正在進行的操作，從哪裡複製到哪裡
      comment
      ```

  - mv (move)

    > 移動或重新命名檔案跟資料夾

    - optional

      ```bash
      #mv 來源(資料夾或檔案) 目的地(資料夾或檔案)

      #移動file1的內容到file2，若file2本來就存在會被覆蓋，否則相當於file1被重新命名成file2
      mv file1 file2

      #將file1、file2移到dir1(dir1必須要存在)
      mv file1 file2 dir1

      #將dir1移到dir2裡面
      mv dir1 dir2

      #以下指令進行操作
      << comment
          -i：interactive，移動檔案或資料夾會造成覆蓋前進行詢問
          -u：update，將目的地不存在的檔案跟資料夾加入，以及存在同名稱但更改時間比我早的檔案進行複寫
          -v：verbose，詳細模式，顯示正在進行的操作，從哪裡移動到哪裡
      comment
      ```

  - mkdir (make directory)

    > 新增資料夾

    ```bash
    #建立一個指定名稱的資料夾
    mkdir <dir name>

    #建立多個指定名稱的資料夾
    mkdir <dir name> <dir name> <dir name>...
    ```

  - rm (remove)

    > 刪除檔案跟資料夾

    > ⚠️注意刪除不可逆，刪除資料前要再三注意
    > 如： rm \_.txt 若打成 rm \_ .txt 則相當於先執行 rm \*

    - optional

      ```bash
      #刪除file1
      rm file1

      #刪除dir1
      rm -r dir1

      #刪除file1跟dir1及其底下內容
      rm -r file1 dir1

      #強制刪除file1跟dir1及其底下內容，即便有指定的item不存在產生錯誤訊息也直接忽略
      rm -rf file dir1

      #以下指令進行操作
      << comment
          -i：interactive，刪除檔案前進行詢問
          -r：recursive，將資料夾與其子內容全部刪除，是刪除資料夾時必填參數
          -f：force，強制移除，無視interactive
          -v：verbose，詳細模式，顯示正在進行的操作，從哪裡複製到哪裡
      comment
      ```

  - ln (link files)

    > 建立 hard 跟 symbolic link (硬連結跟軟連結)

    > hard link
    > 預設每個檔案只會有 1 個 hard link，當創建了新的 hard link 時，即 directory 開了新的入口指向 file
    > 只能針對同一個硬碟分割 (disk partition) 的檔案進行 hard link
    > 只能針對檔案 hard link，不能針對目錄
    > 不會有任何特徵顯示 hard link
    > 只要這個檔案還存在 hard link，內容就還存在
    > 間單來說，可以理解為建立捷徑或別名

    > symbolic link
    > 可以針對檔案或資料夾
    > 可以跨不同檔案分割 (disk partition) 位置的檔案或資料夾
    > 當刪除 symbolic link 時，不會刪除原檔案
    > 當原檔案被刪除，symbolic link 會斷掉 (broken)

    ```bash
    #建立hard link (only file)
    ln file hard_link_name
    #在dir1建立file的名稱為file_hard的hard link
    ln file dir1/file_hard

    #建立symbolic link (file或dir)

    #建立file1的symbolic link(跟file1在同一層)
    ln -s file1 file1-sym

    #在子資料夾dir1針對這層的file1建立symbolic link
    #針對被建立的symbolic link的角度去定義來源檔案file1的位置，因此使用"../file1"
    ln -s ../file1 dir1/file1-sym

    #使用絕對路徑建立symbolic link
    ln -s /home/charles/file1 dir1/file1-sym

    #針對directory建立symbolic link
    ln -s dir1 dir1-sym

    #若來源檔案/資料夾被rm刪除，則symbolic link會broken(ls呈現紅色)
    ```

- 指令、檔案、程式資訊

  - type
    > 查詢某個 command 的功能類型
    ```bash
    type <command>
    ```
    > 可得到 4 種結果：
    >  An executable program (可執行程式)
    >  A command built into the shell itself (shell 內建的指令)
    >  A shell function (shell 的功能函數)
    >  An alias (別名)
  - which
    > 輸出某個 command 存在的絕對路徑
    ```bash
    which <command>
    ```
    > 常用於某個程式裝了多個版本的情況進行確認
    > 只適用 executable programs，對 builtins, aliases 無效
  - help
    > 查詢某個 command 的使用說明
    ```bash
    help <command>
     #or
    <command> --help
    ```
    > square brackets `[ ]` 代表選填參數
    > vertical bar `|` 即 or，只能擇一填參數
  - man (manual)
    > 取得操作手冊
    ```bash
    man <program>
    ```
    > 通常是 program 功能說明，不包含教學步驟跟 example
    > man 顯示的方式基於 less，因此適用 less 的相關 shortcut
    - apropos
      > 搜尋 man pages 的內容
      ```bash
      apropos <keyword>
       #or
      man -k <keyword>
      ```
  - whatis
    > 用一行文字簡介操作手冊內容
    ```bash
    whatis <program>
    ```
  - info
    > 以樹狀結構，帶有超連結的說明文件
    ```bash
    info
    << comment
    ?：顯示help
    PgUp or Backspace：上一頁
    PgDn or Space：下一頁
    n：下一個節點
    p：上一個節點
    u：移到parent node
    Enter：進入超連結
    q：離開
    comment
    ```

- 快捷、別名

  - alias
    > 將一連串 command 建立別名

  ```bash
  #所有alias清單
  alias

  #新增alias
  alias <name>='<string>'
  #e.g.
  alias foo='cd /usr; ls; cd-'

  #移除alias
  unalias <name>
  ```

  > 此方法建立的 alias 會在 shell section 結束後消失
  > 若要永久建立 alias，需要寫入到\~/.bashrc，然後執行 source \~/.bashrc 或重開 shell
  > 如果對現有 command 加上 alias，可以用來指定參數，之後就不用手動補參數

## File System Tree

> 系統檔案樹

- Linux 與 Windows 差別
  > Linux：整個系統一棵樹，即只有一個 root，硬碟 mount (掛接) 位置由 administrator 決定
  > Windows：每個硬碟一棵樹，每個磁碟機有各自的 root
- 目前工作目錄 (current working directory)
  > 任何狀態下都會有當前處於的工作目錄
  > 使用 pwd 可以查看位置
- home directory
  > 打開 terminal 預設會在 home directory
  > 每個 user 都有專屬的 home directory，也只有權限管理自己 home 底下的檔案跟資料夾

## Filename rule

> 檔案名稱規則

- hidden
  > period (.) 開頭的檔案名稱會被隱藏
- case sensitive
  > 大小寫差異會視為不同檔案
- filename characters
  > 可以使用的很多，但良好習慣應只使用包含：
  - period (.)
  - dash (-)
  - underscore (\_)

## File long list information

> 檔案資訊

- 屬性
  - 文件類型
    > 第 1 個字元 `-` 表示普通文件，`d` 表示目錄，`l` 表示 Symbolic Links
  - 權限
    > Owner (2 3 4)、Group (5 6 7)、User (8 9 10)
    > r：讀取 (read)
    > w：寫入 (write)
    > x：執行 (execute)
    > 若對應的位置是 - 代表沒有該權限
- 文件數
  > 若為資料夾，數量即子項目 (檔案 + 資料夾) 的數量，即 hardlinks
  > 若為文件，則為 1
- 擁有者
  - Owner 的 name
- 所屬 Group
  - Group 的 name
- 文件大小
  - 預設用 byte，可配合 - h
- 建檔日期
  - month date HH:MM
- 文件名稱

## System Directory

> 系統資料夾

- /
  > 根目錄
- /bin
  > binaries programs，系統開機時執行的檔案
- /boot
  > Linux kernel (Linux 核心)、RAM disk image (for 驅動程式)
- /dev
  > device，linux 將所有東西視為檔案，此處為與硬體裝置有關的資料
- /etc
  > and so on (法文縮寫 et cetera)，包含系統組態檔 (config)，shell 的腳本 (script)
  > /etc/crontab：自動執行的程式
  > /etc/fstab：儲存的裝置及其安裝位置
  > /etc/passwd：所有 user 的帳戶資訊
- /home
  > 存放所有使用者的 home 目錄 (會在這層有自己 username 的資料夾)
- /lib
  > library，核心系統程式共用的檔案 (DLLs)
- /lost+found
  > 損毀檔案的回復位置
- /media
  > 可攜式裝置 (如 USB Driver) 位置，通常是較新的 linux system 使用
- /mnt
  > mount，可移除裝置掛載位置 (如虛擬磁碟機)，通常是較舊的 linux system 使用，或 WSL (Windows 的 Linux 子系統)
- /opt
  > optional，主要用來安裝第三方應用程序的位置
- /proc
  > process，一個虛擬的檔案系統，將系統的資訊以檔案的方式呈現
- /root
  > root 帳號的 home directory
- /sbin
  > system binaries，存放 root 跟 superuser 需要使用的系統管理工具，例如用於啟動、修復系統的可執行程式
- /tmp
  > Temporary，存放暫存檔案
- /usr
  > user，使用者會用到的內容
- /usr/bin
  > 存放所有 user 都可用的程式，通常包含 ls、cp、mv 等等
- /usr/lib
  > /usr/bin 的程式共用的 library 檔案位置
- /usr/local
  > user 手動安裝的軟體位置
- /usr/sbin
  > superuser、root 才能用的系統程式位置
- /usr/share
  > 保存 /usr/bin 的程式中共享的資料，例如文檔、圖片和程式語言文件等
- /usr/share/doc
  > /usr/bin 中的程式或軟體說明文件 (即 README)
- /var
  > variable，系統會寫入的造成內容變動的資料位置
- /var/log
  > 系統狀況記錄的文件

## Symbolic Link

> 軟連結，使用絕對或相對路徑指向檔案或資料夾的參照，類似 windows 系統的捷徑功能，使常會變更檔名的檔案或文件 (如版本會更新) 更方便管理

## Wildcards

> 萬用字元，如以下清單：\*：所有長度的字串
> ?：單個字元
> \[characters]：符合 \[] 中的字元，如 \[abc]，即可以對應 a 或 b 或 c
> \[!characters]：不符合 \[] 中的字元，如 \[abc]，即可以對應 a 或 b 或 c 以外的檔案

\[\[:class:]]：使用以下類別：

> \[:alnum:]：任何文字跟數字
> \[:alpha:]：任何文字
> \[:digit:]：任何數字
> \[:lower:]：任何小寫
> \[:upper:]：任何大寫
> \[:alnum:]：任何數字

```bash
# sample

#BACKUP.(三個任意數字) 的檔案
BACKUP.[0-9][0-9][0-9]

#任何以大寫字元開始的檔案
[[:upper:]]*

#任何以數字開頭以外的檔案
[![:digit]]*

#最後一個字元必須是小寫字母或1或2或3
*[[:lower:]123]
```

## Using History

### Searching History

- history

  ```bash
  history
  # 列出輸入紀錄

  history | grep (command || path)
  # 將輸入紀錄中包含指定內容的指令列出
  ![編號]

  # example
  history | grep ls
  !173
  ```

  ```bash
  Ctrl + r
  ```

  > 由當前往過去搜尋歷史紀錄
  > 會出現 (reverse-i-search)\`':
  > 開始輸入關鍵字，冒號後會出現配對的指令
  > 使用 Enter ： 直接執行
  > 使用 Ctrl + J ： 複製到 command line 以供編輯

- history shortcut
  - Ctrl + p
    > 移到前一筆歷史紀錄 (同方向鍵⬆️)
  - Ctrl + n
    > 移到下一筆歷史紀錄 (同方向鍵⬇️)
  - Alt + <
    > 移到第一筆歷史紀錄
  - Alt + >
    > 移到最後一筆歷史紀錄
  - Ctrl + r
    > reverse-i-search
  - Alt + p
    > 輸入搜尋內容後按 enter 才開始搜尋，從最新的開始往前搜尋
  - Alt + n
    > 輸入搜尋內容後按 enter 才開始搜尋，從最舊的開始往前搜尋
  - Ctrl + o
    > 執行目前的歷史紀錄，並顯示下一筆歷史紀錄 (用於要執行連續的歷史紀錄)
  - !(number)
    > 執行標號為 (number) 的歷史紀錄，e.g, `!193`
  - !(string)
    > 執行最近一筆開頭是 (string) 的歷史紀錄，e.g, `!cd`
  - !?(string)
    > 執行最近一筆指令包含 (string) 的歷史紀錄，e.g, `!?/data`
