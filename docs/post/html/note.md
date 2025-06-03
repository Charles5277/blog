---
title: HTML 筆記
description: HTML 基礎語法與常用標籤
datePublished: 2024-09-13
lastUpdated: 2024-09-22 07:17:00 +8
category: HTML
tags:
  - Frontend
  - HTML

---

## 基本框架

```html=
<!DOCTYPE html>
<html lang="en"> <!-- 可以設定其他語言 -->
  <head>
    <!--全域設定-->
    <meta charset="UTF-8" /> <!-- 此行必須在head內第一行 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> 標題 </title>
  </head>

  <body>
    <script type="module" src="/main.js"></script>
    <!-- 網頁內容 -->
  </body>
</html>
```

> `<meta>`：用來定義網頁本身設定的標籤

## block elements

- 組成一個可見區塊
- 單獨佔據一行
- 前後以換行分隔
  > e.g. `<p>` `<li>` `<nav>` `<footer>` `<div>`
  > block elements 可以巢狀其他 block elements，但不能套在 inline elements 中

```html=
<!-- 正確👍 -->
<div>
  <p>This is a paragraph inside a div.</p>
  <div>
    <h2>Heading 2 inside a nested div</h2>
    <p>Another paragraph inside the nested div.</p>
  </div>
</div>

<!-- 錯誤❌ -->
<p>This is a paragraph with a <div>block element</div> inside.</p>
```

## inline elements

- 專門放在 block elements 裡的內容
- 非完整段落或群組，通常只出現在一段文字中
- 不會產生新的一行
  > e.g. `<a>` `<span>` `<br>`

## paragraph ( p )

將一段內容標註為段落，成為 block

```html
<p>>context</p>
```

## break ( br )

```html
在同個block中換行
<p>>text<br />1234</p>
```

> text
> 1234

## horizontal rule ( hr )

```html
<hr />
```

> 水平分隔線

## strong

```html
強調標示內容
<strong>text</strong>

<p><strong>text</strong></p>
```

## anchor target (a target) (錨點)

```html
<a href="https://www.google.com">Google首頁</a>
```

- \_self (default)：覆蓋當前頁面
- \_blank：開新分頁
- \_parent：在父框架開啟頁面
- \_top：在最頂端框架開啟頁面
  > href=#id 可以連結到同頁面指定的 block element

## img

```html
<img src="./images/1.png" alt="圖片1" />
<img src="https://blog.hubspot.com/hubfs/image8-2.jpg" alt="G_logo" />
```

## ordered list (ol)

```html
<ol type="1">
  <li>項目1</li>
  <li>項目2</li>
  <li>項目3</li>
</ol>
<ol type="A">
  <li>項目1</li>
  <li>項目2</li>
  <li>項目3</li>
</ol>
<ol type="a">
  <li>項目1</li>
  <li>項目2</li>
  <li>項目3</li>
</ol>
<ol type="I">
  <li>項目1</li>
  <li>項目2</li>
  <li>項目3</li>
</ol>
<ol type="i">
  <li>項目1</li>
  <li>項目2</li>
  <li>項目3</li>
</ol>
```

<p>
<img src="https://i.imgur.com/S3mgTvo.png" width="50">
</p>

## Unordered List (ul)

```html
<ul>
  <li>項目1</li>
  <li>項目2</li>
  <li>項目3</li>
</ul>
```

<p>
<img src="https://i.imgur.com/lQVTItF.png" width="50">
</p>

> 項目符號樣式交由 CSS list-style-type 設定

## table

`<th>`：表格標題 (table header)
`<tr>`：表格列 (table row)
`<td>`：表格資料 (table data)

```html
<table>
  <tr>
    <th>title A</th>
    <th>title B</th>
    <th>title C</th>
  </tr>
  <tr>
    <td>content A</td>
    <td>content B</td>
    <td>content C</td>
  </tr>
</table>
```

<p>
<img src="https://i.imgur.com/RPBIGfj.png" width="200">
</p>

> 可以在 `<th>`、`<tr>`、`<td>` 中加入 ` colspan="n"` 或 ` rowspan="n"` 讓該儲存格跨越 n 欄或 n 列

```html
<table>
  <tr>
    <th colspan="3">Table</th>
  </tr>
  <tr>
    <th>title A</th>
    <th>title B</th>
    <th>title C</th>
  </tr>
  <tr>
    <td>content A</td>
    <td>content B</td>
    <td>content C</td>
  </tr>
</table>
```

<p>
<img src="https://i.imgur.com/LmascWo.png" width="200">
</p>

> 可使用 `<thead>`、`<tbody>`、`<tfoot>` 將表格內容分區。
> 不影響外觀，但提升 code 可讀性

```html
<table>
  <thead>
    <tr>
      <th colspan="3">Table</th>
    </tr>
    <tr>
      <th>title A</th>
      <th>title B</th>
      <th>title C</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>content A</td>
      <td>content B</td>
      <td>content C</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">Update Information</td>
    </tr>
  </tfoot>
</table>
```

<p>
<img src="https://i.imgur.com/m9cPkEz.png" width="200">
</p>

## form

- label
  - action：送到的頁面
  - for：label 限定的參數
  - method：表單送出的方法 GET 或 POST
    > method="" 預設為 get
    > get -> 會將資訊夾帶在網址，適合提交公開非隱私資料 (如搜尋關鍵字)
    > post -> 會隱藏傳送的參數，適合提交隱私資訊 (如登入帳號密碼)
  - type：定義 input 型別，根據型別可輸入各種值
  - size：輸入框的長度
  - maxlength：輸入框字數限制
- input

    <p>
    <img src="https://i.imgur.com/604NvcP.png" width="400">
    </p>

  [🔗More Input List](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)

  sample：

  ```html
  <body>
    <form action="" method="post">
      <label for="username">帳號</label>
      <input id="username" type="text" name="username" />
      <label for="password">密碼</label>
      <input id="password" name="password" type="password" />

      <input type="checkbox" id="show" /> 顯示密碼
      <button type="submit">登入</button>
    </form>

    <script>
      let checkbox = document.querySelector('#show');
      let password = document.querySelector('#password');
      checkbox.addEventListener('click', () => {
        if (password.type == 'password') {
          password.type = 'text';
        } else {
          password.type = 'password';
        }
      });
    </script>
  </body>
  ```

  > 加入 required 參數為必填

  > checkbox 加入 checked 參數為預設打勾

  > button 放在 form 裡面時預設 type=submit，會將 form 當中 name 參數的 value 傳給後端，若放在 form 外面時預設 type=button，無任何效果

  > 只有 name 參數會被傳送到後端，HTML 也以相同 name 名稱視為同一主體，
  > 例如有 3 個 input 的 name 相同，則這個 name 回傳的值由這 3 個 input 的內容共同決定，像是 3 選 1 或複選

## select

```html
<select name="gender" id="gender" required>
  <option disabled selected value>請選擇性別</option>
  <option value="male">男性</option>
  <option value="female">女性</option>
  <option value="other">其他</option>
</select>
```

> select-option 設定下拉式選單

## datalist

```html
<label for="area">地區</label>
<input list="area_list" type="text" name="area" id="area" />
<datalist id="area_list">
  <option value="台北市">台北市</option>
  <option value="台中市">台中市</option>
  <option value="高雄市">高雄市</option>
</datalist>
```

> input 設定 list = datalist，將 user 的 input 值控制在 datalist 設定好的選項之中

## textarea

```html
<label for="introduction">自我介紹</label>
<textarea
  name="introduction"
  id="introduction"
  placeholder="請介紹自己"
  cols="30"
  rows="10"
></textarea>
```

> 多行內容輸入框

## entity code

> [符號代碼清單](https://www.htmlsymbols.xyz/)

## icon

```html
<head>
  <link rel="icon" href="./favicon.ico" />
</head>
```

> 於網頁頁籤顯示 icon

## Semantic Tags (語意標籤)

> HTML5 用更精確的 element 取代 div，方便維護及閱讀並增強 SEO

- section: 有意義的主題區塊，例如表格的篩選列
- article: 可以獨立的完整區塊，例如一篇文章
- nav: 導航連結區塊
- header: 標頭區塊
- footer: 頁尾區塊
- main: 頁面主要內容區塊，每個頁面只能有 1 個
- aside: 跟主要內容無關的區塊

![](https://i.imgur.com/WyX5qEn.png)
