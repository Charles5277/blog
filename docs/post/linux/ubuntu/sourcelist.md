---
title: Ubuntu 修改 sources.list
description: 將 Ubuntu 的 apt 來源更換為台灣國網中心，提升 package 下載速度。
date: 2024-10-05
category: Linux
tags:
  - Linux
  - Ubuntu

prev:
  text: 'Ubuntu 入門筆記'
  link: '/linux/ubuntu/note'
next:
  text: 'Ubuntu 讓 sudo 時不用輸入密碼'
  link: '/linux/ubuntu/sudo-no-password'
---

## 修改 source

- 適用 Ubuntu 24.04 及之後版本

```bash
sudo sed -i 's/archive.ubuntu.com/free.nchc.org.tw/g' /etc/apt/sources.list.d/ubuntu.sources
sudo sed -i 's/security.ubuntu.com/free.nchc.org.tw/g' /etc/apt/sources.list.d/ubuntu.sources
```

- 適用 Ubuntu 22.04 及之前版本

```bash
sudo sed -i 's/archive.ubuntu.com/free.nchc.org.tw/g' /etc/apt/sources.list
sudo sed -i 's/security.ubuntu.com/free.nchc.org.tw/g' /etc/apt/sources.list
```

## 更新檔案清單

```bash
sudo apt clean all   # 清除先前的檔案清單
sudo apt update      # 更新檔案清單
sudo apt upgrade     # 升級套件
```