---
title: CSS 筆記
description: CSS 基礎屬性與樣式
datePublished: 2024-09-13
lastUpdated: 2024-09-22 07:17:00 +8
category: CSS
tags:
  - Frontend
  - CSS

prev: false
next: false
---

## 基本框架

- Inline Style

  ```css
  <h1 style="text-align: center; color: red">Test</h1>
  ```

- Internal Style Sheet

  ```css
  <head>
      <style>
          #demo{ }
      </style>
  </head>
  ```

- External style sheet

  ```html
  <link rel="stylesheet" href="style.css" />
  ```

> **優先權 Inline Style ＞ Internal Style ＞ External Style**

> External 最好維護，最常見，適合多個 html 頁面存取同一個 css file
> Internal 適合 css 只跟單一 html 的相依性較高時使用

## Color

- keyword
  ```css
  .demo {
    color: red;
  }
  ```
- rgb
  ```css
  .demo {
    color: rgb(100, 100, 100);
  }
  ```
  > value 為 `0 ~ 255`
- rgba
  ```css
  .demo {
    color: rgb(100, 100, 100, 0.5);
  }
  ```
  > a 為 alpha，設定透明度 0 (透明) \~ 1 (不透明)
- hex
  ```css
  .demo {
    color: #1f6e6f;
  }
  ```
- HSL
  ```css
  .demo {
    color: hsl(131, 45%, 62%);
  }
  ```
  > Hue   / Saturation / Lightness (色相 / 飽和度 / 亮度)
  > 0\~359 /  0\~100%  /   0\~100%

## Selectors

- Universal  `*` (全域)

  ```css
  * {
    color: red;
  }
  ```

  > 指定任何類型的 Html Element

- Element

  ```css
  h1 {
    color: red;
  }
  ```

  > 指定特定名稱的 Html Element

- ID

  ```html
  <!-- html -->
  <p id="first_paragraph"></p>
  ```

  ```css
  #first_paragraph {
    color: red;
  }
  ```

  > 指定特定 ID 的 Html Element

- Class

  ```html
  <!-- html -->
  <p class="blue_text"></p>
  ```

  ```css
  .blue_text {
    color: blue;
  }
  ```

  > 指定所有特定 class 的 Html Element

  > ID     -> 獨一無二，一個 ID 只能被賦予一個 Element
  > Class -> 可套用多個 Element

- Element & Class 並用
  fds

  ```html
  <!-- html -->
  <p class="blue_text"></p>
  ```

  ```css
  /* css */
  p.blue_text {
    color: blue;
  }
  ```

  > 指定有 class 為 blue_text 的 p 標籤

- Grouping (分組)

  ```css
  h1,
  h2,
  h3,
  h4 {
    color: red;
  }
  ```

  > 選取多個 Html Element，用逗號分隔

- Descendant (子代、後裔)

  ```html
  <!-- html -->
  <div class="link1">
    <a href="https://www.google.com">google首頁</a>
  </div>
  ```

  ```css
  /* css */
  div.link1 a {
    color: blue;
  }
  ```

  > 由兩個或多個由空格分隔的選擇器組成

- Attribute (屬性)

  ```html
  <!-- html -->
  <input type="text" name="context" />
  ```

  ```css
  /* css */
  input[type='text'] {
    color: black;
  }
  ```

  > 指定所有具有相同屬性的 Html Element

- pseudo-class (偽 class)

  ```css
  input[type='text'] {
    color: black;
  }
  input[type='text']:hover {
    color: red;
  }
  ```

  - :hover : 懸浮在物件上
  - :active : 左鍵點擊期間
  - :focus : 焦點在物件上 (例如輸入游標在該物件上) <br>
    > 指定所選元素的特定狀態

- pseudo-element (偽元素)

  ```css
  p::first-line {
    font-size: 24px;
  }
  ```

  - ::before    : 所有指定內容的前面
  - ::first-line : 所有指定內容的第一行
  - ::selection: 所有指定內容中，被 user 選取起來時 <br>
    > 創造一個 DOM 當中不存在的 Html Element，用來指定並沒有定義 Element 的區域

- Inheritance (繼承)

  常見會繼承的 tag

  - color

  - font-family

  - font-size

  - font-weight

  - list-style-type

  - text-align
    > child node 會繼承 parent node 設定的樣式

  > user agent stylesheet (使用者代理程式樣式表) 優先級 > inheritance
  > 例如 anchor tag，因此需要另外設定，無法依賴繼承

- Conflicting Styling (樣式衝突)

  > 當 Element 被不同來源的 CSS 重複設定時

  > 處理原則：Priority (優先度) => Specificity (特定度) => Order Rule (順序規則)

  - Priority
    1. Inline
    2. User Stylesheet (內部順序由 Specificity 決定)
    3. User Agent Stylesheet
    4. Inheritance
  - Specificity
    1. id     (1,0,0)
    2. class (0,1,0)
    3. tag   (0,0,1) <br>
       > 優先級由 (1,1,1) \~ (0,0,0)
  - Order Rule
    - 發生衝突時由後面的設定覆寫，包含引用外部的 `<link> `stylesheet

## text styling

- font-size：絕對 or 相對單位

  ```css
  h1 {
    /*絕對單位*/
    font-size: 24px;
  }
  p {
    /*相對單位*/
    font-size: 24rem;
  }
  ```

- text-align：block element 或 table cell 中，內容的水平對齊位置

  - center：置中對齊
  - right：靠右對齊
  - justify：左右對齊
  - inherit：繼承 parent element 對齊方式
    > left、initial (預設值)，靠左不用設定

  ```css
  h1 {
    text-align: center;
  }

  td,
  th {
    text-align: center;
  }
  ```

- text-decoration：文字線段修飾特效

  - none：無線段特效
  - underline：底線
  - line-though：刪除線

  ```css
  a {
    text-decoration: underline;
  }
  ```

- line-height：文字行距

  ```css
  p {
    line-height: 20px;
  }
  ```

- letter-spacing：文字水平間距

  ```css
  p {
    letter-spacing: 2px;
  }
  ```

- font-family：字體系列的優先列表

  ```css
  p {
    font-family: 'Times New Roman', Times, serif;
  }
  ```

  > "設定字型", 備援字型 1, 備援字型 2

  - 指定 Local font 做為顯示字體
    ```css
    @font-face {
      font-family: 'font_001';
      src: url(./font_001.ttf);
    }
    * {
      font-family: 'font_001';
    }
    ```

  ```html
  <!-- 置於html head中，link style.css之上 -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap"
    rel="stylesheet"
  />
  ```

  ```css
  /* css */
  font-family: 'Noto Sans TC', sans-serif;
  ```

- text-indent：段落第一行縮排字元

  ```css
  p {
    text-indent: 2rem;
  }
  ```

- font-weight：設定粗體字
  - normal：和數值 400 相同
  - bold：和數值 700 相同
  - 100-900：9 個等級的字體粗細程度
  - bolder：比 parent element 更粗
  - lighter：比 parent element 更細
  ```css
  p {
    font-weight: normal;
  }
  ```

## units (css 單位類別)

- absolute units (絕對單位)
  > 有預設值或生活中已定義的單位
  > e.g., px (pixel), mm, cm, in
- relative units (相對單位)
  - em：相對 parent element 的長度
    > ⚠️在多層 DOM Tree 中，越下層 element 的 em 值較難計算
    > 因此實務上**避免使用**
    ```css
    /* parent element */
    body {
      font-size: 50px;
    }
    /* current element */
    h1 {
      font-size: 2em;
      /* 2 * 50px = 100px */
    }
    ```
  - rem (root em)：以 html 元素計算，瀏覽器預設為 16px，使用者若有修改瀏覽器設定大小則依修改後為基準單位計算顯示
    ```css
    h1 {
      font-size: 1.5rem;
      /* 1.5 * 16px = 24px */
    }
    ```
  - vw (viewport width)：當前視窗寬度的 1%
    ```css
    body {
      width: 1920px;
    }
    h1 {
      width: 90vw;
    }
    ```
    > 設定 100vw 為略微超出網頁寬度，會產生 horizontal scrollbar
  - vh (viewport height)：當前視窗高度的 1%
    ```css
    body {
      height: 1080px;
    }
    h1 {
      height: 10vh;
    }
    ```
  - % (percentage)：相對 parent element 的值
    ```css
    body {
      height: 1080px;
    }
    h1 {
      height: 10%;
    }
    ```

## width & height

定義固定寬高

- width：500px
- height：500px

隨著畫面縮放依比例變更大小

- min-width：300px
- max-width：1000px <br>
- min-height：30px
- max-height：100px

## background

- background-color

  - transparent

  ```css
  h1 {
    background-color: transparent;
  }
  ```

  > 其餘同 [color](#Color) 用法

- background-image

  ```css
  h1 {
    background-image: url(./image/photo.jpg);
  }
  ```

- background-size

  - auto：保持原尺寸
  - contain：等比例縮放，不剪裁拉伸。

- background-repeat：在 contain 模式下，若圖片小於容器選擇是否要重複圖片

  ```css
  h1 {
    background-size: contain;
    /* 預設為repeat */
    background-repeat: no-repeat;
  }
  ```

  - cover：等比例縮放到完全覆蓋容器，尺寸跟容器不同時即自動裁切
  - background-position
  - top
  - bottom
  - left
  - right
    > 設定背景對齊位置

- background (shorthand)
  > 以 "background: 參數" 設定值，省略 color、image、size etc.
  ```css
  h1 {
    background: green;
    background: url(./image/photo.jpg);
  }
  ```

## Box Model

> 每個 block element 都是一個 box

<p class="indent_2"><img src="https://i.imgur.com/L9XTrLY.png" width="250" />
</p>

- context (內容)：顯示內容區域，用 width 和 height 調整大小

  ```css
  h1 {
    width: 500px;
    height: 300px;
    background: green;
  }
  ```

- padding (留白)：介在 context 跟 border 之間的距離夾層，使用 padding 屬性調整大小

  - padding-top
  - padding-right
  - padding-bottom
  - padding-left <br>
  - shorthand
    ```css
    h1 {
      /* 套用四邊 */
      padding: 1rem;
    }
    h1 {
      /* 垂直, 水平 */
      padding: 5%, 10%;
    }
    h1 {
      /* 上, 右, 下, 左 */
      padding: 10px, 22%, 3.5rem, 1.5em;
    }
    ```

- border (邊框)：使用 border 屬性調整大小

  ```css
  h1 {
    /* content */
    /* padding */
    border: 10px;
  }
  ```

  - border-radius (半徑)：邊界線條圓滑度

  ```css
  h1 {
    border-radius: 5px;
  }
  ```

  > 在同寬高的 box，設定 border-radius: 50% 可以畫出整個圓

- margin (邊界)：使用 margin 屬性調整大小

  > 同 padding 寫法

- width：預設為 context 的寬度

  > ⚠️當 box-sizing 為 border-box 時，會設定 border 的寬度

  > 任何 block element 預設 width 為 100%

- height：預設為 context 的高度

  > ⚠️當 box-sizing 為 border-box 時，會設定 border 的高度

  > 當對 box 設定 height 使用 % 時，由於 parent element 預設 height 是 auto，因此會導致計算結果 Undefined，除非有先對 parent (如 html, body) 設定 height 為 100%

  > 絕大多數情況不用設定 box 的高度，如果有設定要考慮 overflow (內容超過設定容量) 的處理方式：

  - visible：(預設) content 不會被修剪，會直接呈現在元素框外
  - hidden：直接裁切，溢出部分隱藏，不會有滾動軸
  - scroll：顯示滾動軸

  ```css
  p {
    overflow: scroll;
    /* 可單獨設定overflow-x或overflow-y */
  }
  ```

- box-sizing
  - content-box (預設)
    > width 跟 height 決定整個 content 的寬高，padding 跟 border 外加
  - border-box > width 跟 height 決定整個 box 的寬高，即包含 border、padding、content
    ```css
    - {
      box-sizing: border-box;
    }
    ```
    > content-box => 設定內部 content 大小，外加模式
    > border-box  => 設定整個 box 大小，內縮模式
    > 💡絕大多數網頁使用 **border-box**

## Display

- outer display type

  - block：寬高可指定，會換行
  - inline：寬高不可指定，不會換行
  - inline-block：寬高可指定，不會換行

- inner display type
  - flex
  - grid

<p><img src="https://i.imgur.com/4XcF9sm.png" width="100%" /></p>

## Position

> 由 top、right、bottom、left 決定 element 的最終位置

- static (靜態) (預設)

  > 根據 normal flow 定位，top、right、bottom、left、z-index 無效
  > normal flow：瀏覽器正常排版規則，包含 block 換行，inline 並排 etc.
  > z-index：決定圖層覆蓋的參數。z-index 較大的元素，重疊時會覆蓋較小元素
  > z-index 只會套用到 positioned element
  > ⚠️只有 static 不是 positioned element

- relative (相對)

  > 根據 normal flow 定位，依照 top、right、bottom、left 的值相對自身進行偏移
  > 即 "相對原點所要偏移的位置"

  > 若有 element 需要成為 positioned element，可以直接給予 position: relative; 不用給予偏移量即可

- absolute (絕對值)

  > 從 normal flow 移除，不保留空間，依照 top、right、bottom、left 的值相對自身進行定位
  > 參考對象為 closet positioned ancestor (最近的 positioned element 祖先，即從 parent 往上找的第一個 positioned element)，若找不到則定為 initial containing block (瀏覽器初始視窗)

- fixed (固定)

  > 從 normal flow 移除，不保留空間，依照 top、right、bottom、left 的值相對自身進行定位，不隨滾動軸拉動改變。

  > 參考對象是 viewport 形成的 initial containing block

- sticky (沾黏)
  > relative 跟 fixed 的混合體
  > 預設為相對定位，達到指定的 threshold (臨界點) 則改為固定定位
  ```css
  #box_1 {
    position: sticky;
    top: 10px;
    /* 直到距離top 10px之前都是相對移動位置 */
    /* 達到距離top 10px以後就固定在畫面上 */
  }
  ```

## Stacking Context

> element 位置重疊時，依虛擬 z 軸堆疊的情況

- Root element of the document (`<html>`)
- 任何 **position 為 relative 或 absolute**，且 **z-index 的值不是 auto**，則**內部形成新的 stacking context**
  > 內部形成新的 stacking 之後，z-index 值就不會跟 parent element (含) 以上的 element 比較
- 任何 position 為 fixed 或 sticky 的 element

## Table Style

- border collapse

  ```css
  table,
  th,
  tr,
  td {
    border: 1px solid black;
    border-collapse: collapse;
    /* 將圖1轉為圖2邊框 */
  }
  ```

- 圖 1

<p class="indent_4"><img src="https://i.imgur.com/LkHmDww.png" width="300 px">
</p>

- 圖 2

<p class="indent_4"><img src="https://i.imgur.com/Ukcas3z.png" width="300 px">
</p>

## Opacity (不透明度) & Cursor (游標樣式)

- Opacity：設置元素的不透明度，0 (完全透明) \~ 1 (預設) (不透明)
- Cursor：設定游標樣式
  - pointer > 常搭配:hover
    > [🔗style list](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)

## Transition (過渡)

> 設定 css 屬性轉換時的 easing (緩動) 跟 speed

- shorthand
  > property name | duration | easing function | delay
  - property name：指定要轉換的 CSS 屬性
  - duration：轉換需要的時間，**預設 0**，單位為 s 或 ms
  - easing-function：轉換時的速度曲線，**預設 ease**
    | 名稱 | 說明 | =cubic-bezier<br>(X,X,X,X) |
    | :------------------------ | :-------------------------------- | :------------------------- |
    | linear | 均速 | cubic-bezier(0,0,1,1) |
    | ease | 緩入中間快緩出，預設值 | cubic-bezier(.25,.1,.25,1) |
    | ease-in | 緩入 | cubic-bezier(.42,0,1,1) |
    | ease-out | 緩出 | cubic-bezier(0,0,.58,1) |
    | ease-in-out | 緩入緩出 (對比於 ease 較平緩) | cubic-bezier(.42,0,.58,1) |
    | cubic-bezier<br>(n,n,n,n) | 利用貝茲曲線自定義速度模式，<br>n = 0 \~ 1 中的數值 | cubic-bezier(n,n,n,n) |
    > [🔗More easing function](https://easings.net/zh-tw)
  - delay：延遲多久轉換，**預設 0**，單位為 s 或 ms

## Transform (轉換)

> 將 element 進行旋轉、縮放、傾斜、平移 etc.
> 瀏覽器透過內部矩陣乘法計算結果位置、大小、形狀
> 搭配 Transition 使用

> 以下參數皆可設定 x, y, z 方向

- translate (位移)

  > 依照自身中心點做計算

  ```css
  box {
    top: 50%;
    left: 50%;
    /* 以左上角的頂點會相對parent element置中 */
  }
  ```

  ```css
  box {
    transform: translate(-50%, -50%);
    /* 依照box中心點為基準設為parent element置中 */
  }
  ```

- rotate (旋轉)

  ```css
  box {
    transform: rotate(45deg);
  }
  ```

- scale (縮放)
  ```css
  box {
    /* transform: scale(all) */
    /* transform: scale(寬,高) */
    transform: scale(2);
  }
  ```

## Animation

> transition + transform 可以完成簡單動畫，animation 可以完成更複雜的動畫設定

- shorthand
  - name：自訂名稱
  - duration：同 [Transition](#Transition-過渡)
  - easing-function：同 [Transition](#Transition-過渡)
  - delay：同 [Transition](#Transition-過渡)
  - iteration-count
    - number
      ```css
      box {
        animation-iteration-count: 5;
      }
      ```
    - infinite
      ```css
      box {
        animation-iteration-count: infinite;
      }
      ```
  - direction
    | 名稱 | 說明 |
    | :---------------- | :---------------------------------------------------------- |
    | normal | 預設值，正常播放，順向 從 0%→100% |
    | reverse | 反向播放，逆向 從 100%→0% |
    | alternate | 正逆向輪流播放，奇數次為 0%→100%，偶數次為 100%→0% 若動畫播放次數只有一次就只會正常播放。 |
    | alternate-reverse | alternate 的相反，奇數次為 100%→0%，偶數次為 0%→100% 若動畫播放次數只有一次就只會反向播放。 |
  - fill-mode
    - none：(預設) 返回最初狀態
    - forwards：停留在結束的狀態
    - backwards：停留在剛開始的狀態
    - both：依據開始或結束決定呈現的狀態
  - play-state - running：(預設) 播放 - pause：暫停 <br>
    Sample
  ```css
  box {
    animation: ChangeColor 1s ease-in 0s infinite alternate forwards;
  }
  @keyframes ChangeColor {
    from {
      top: 0;
      left: 0;
    }
    to {
      top: 400px;
      left: 400px;
    }
  ```

## RWD (Responsive Web Design)

> RWD 沒有通用的標準，只要達成不同裝置以不同解析度檢視網頁都能適當呈現，減少縮放、平移、捲動即可

### 設計思路與原則

1. 專注螢幕大小而非裝置，一般來說最多設計小、中、大、超大的類型即可
   > 320~~480px 為行動裝置
   > 481~~768px 為平板裝置
   > 769~~1024px 為小螢幕及筆電
   > 1025~~1200px 為桌機
   > 1200px 以上為大型螢幕或電視
2. ⭐**優先用 flexbox，否則就用 media query 處理**
3. element 跟圖片都要隨著螢幕大小變化而改變
4. 不能做出 "X 軸" (水平滾動軸)

### 可採取策略

- element 跟圖片皆使用 relative unit
  > rem、%、vw、vh etc.
- Media query：定義在不同寬度時要採用的 css
  ```css
  @media not|only mediator and (mediafeature and|or|not mediafeature) {
    /*CSS-Code;*/
  }
  ```
  - max-width：最大寬度 (<=)
  - min-width：最小寬度 (>=)
    sample
  ```css
  @media (max-width: 767px) {
  }
  @media (max-width: 480px) {
  }
  @media (min-width: 768px) and (max-width: 979px) {
  }
  @media (min-width: 980px) {
  }
  @media (min-width: 1200px) {
  }
  ```
  ![](https://blog.hinablue.me/content/images/2014/Nov/responsive-reference.png)
  [🔗設定臨界點與 max、min 使用思路](https://blog.hinablue.me/css-media-query-tips/)
- 使用 Flexbox 自動排版 > 讓容器改變寬高跟順序，以最好填充可利用空間 - flex container > `display: flex` 是一種 inner display type

  ````
      > 任何定義 `display: flex` 的element都是flex container，其child element都是flex item

      > flex item可以再定義 `display: flex` ，同時為flex item跟flex container
      > 此時outer display type為flex item
      > inner display type為flex
      >
      > 所以只要inline element放進flex container就能成為flex item，避免[display type為inline時的限制](#Display)
      ```html
      <!-- html -->
      <div class="box">
        <a href="">link_1</a>
      </div>
      ```
      ```css
      /* css */
      div.box {
        display: flex;
      }
      ```
      - flex-direction：設定main axis (主要方向)
          - ➡️row (預設)
          - ⬇️column
          - ⬅️row-reverse
          - ⬆️column-reverse
      - flex-wrap：設定換行規則
          - nowrap：(預設) 強制在一行，若容量不夠會壓縮content
          - wrap：自動換行
      - justify-content：設定main axis對齊方式
      <img src="https://i.imgur.com/3tuzb7t.png" width="50%">
      <img src="https://i.imgur.com/fZUSMU1.png" width="50%">
          👆以flex-direction預設row示範

          - start：靠容器開頭
          - end：靠容器結尾
          - center：於基準線置中
          - space-between：分散對齊(不留頭尾)
          - space-around：分散對齊(留頭尾)
          - space-evenly：分散對齊，頭尾間隔只有element間隔的一半
      - align-items：設定cross axis(交錯軸) 對齊方式
      <img src="https://i.imgur.com/3V6iWcq.png" width="50%">
          - stretch：(預設) 當child element沒有設定高度時，會被拉長到符合parent element一樣的長度
          - flex-start：靠容器開頭(的順時針90度)
          - flex-end：靠容器結尾(的順時針90度)
          - center：於交錯軸置中
          - baseline：以文字為準對齊交錯軸

          > cross axis即跟main axis垂直的方向，當flex-direction為預設row，則
          > justify-content => 水平對齊方式
          > align-items => 垂直對齊方式
  - flex items
      - shorthand
          - flex-grow：將container的剩餘空間分配給items的伸展係數
              > 剩餘空間：flex container - 所有flex item的大小總和

              > 填入伸展係數 0 ~ 無限，決定該item可以吃下剩餘空間的分量，未設定則不會分配剩餘空間
          - flex-shrink：container裝不下items時，該item可接受的被壓縮係數
              > 填入壓縮係數 0 ~ 無限 (預設為1)，決定該item被壓縮的比例
          - flex-basis：item基本大小 (預設為0)
              > basis代表的是寬還是高同樣取決於main axis

          usage：
          ```css
          /* 1 value，無單位：grow */
          flex: 2;

          /* 1 value，有單位：basis */
          flex: 10em;
          flex: 30px;
          flex: min-content;

          /* 2 value：grow | basis */
          flex: 1 30px;

          /* 2 value：grow | shrink */
          flex: 2 2;

          /* 3 value：grow | shrink | basis */
          flex: 2 2 10%;
          ```

          sample 1：
          ```css
          .red{
            flex: 1 2 100px;
          }
          .blue{
            flex: 2 2 100px;
          }
          /* 當container > 200px：red佔1/3，blue佔2/3 */
          /* 當container < 200px：red佔2/3，blue佔1/3 */
          ```
          ![](https://i.imgur.com/MSWkGeH.png)
          <br>
          sample 2：
          ```css
          .red{
            flex-grow: 2;
            flex-basis: 100px;
          }
          .blue{
            flex-grow: 1;
            flex-shrink: 0;
            flex-basis: 100px;
          }
          ```
          ![](https://i.imgur.com/LW8OCtQ.png)
      - no-shorthand
          - align-self：為單個item覆寫預設對齊方式 (用法同align-items)
              > 例如container內有3個items
  ````

  設定 align-items 為 center
  中間 2 號 item 單獨設定 align-self: flex-end
  ![](https://i.imgur.com/8ZHcQSI.png)

> 關於 Figma <=> CSS
>  flex-grow：在 figma parent > autolayout 的 main axis
>   -> 0: fixed mode
>   -> 1: fill mode
>  align-self：在 figma parent > autolayout 的 cross axis
>   -> flex-start: fixed mode
>   -> stretch: fill mode

## SASS/SCSS (Syntactically Awesome Stylesheets)

> 一種將 CSS 視為程式語言的網頁開發技術
> SASS 支援設定變數、函數、import、nested etc.
> 有高相容性，跨瀏覽器的特性
> 如 Bootstrap 即透過 SASS 實現

> [🔗延伸閱讀：問過一百次的問題之 Sass 和 SCSS 的差別](https://medium.com/@onepiece0328/%E5%95%8F%E9%81%8E%E4%B8%80%E7%99%BE%E6%AC%A1%E7%9A%84%E5%95%8F%E9%A1%8C%E4%B9%8B-sass-%E5%92%8C-scss-%E7%9A%84%E5%B7%AE%E5%88%A5-5bd7fd78942a)

以下以 SCSS 作為範例

- Nested CSS：用巢狀寫法，交給 compiler 改寫成 css 語法

  ```scss
  header {
    nav {
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          list-style-type: none;
          a {
            color: red;
            text-decoration: none;
          }
        }
      }
    }
  }
  ```

- Parameter setting：只要修改自定義變數，就能直接影響多個 element

  ```sass
  $Color_theme: red;

  a {
    color: $Color_theme;
  }
  h1 {
    color: $Color_theme;
  }
  h2 {
    color: $Color_theme;
  }
  ```

- self ampersand：使用 `&` 表示自己，可以直接設定如 [pseudo Selectors](#Selectors)

  ```sass
  a {
    color: pink;
    &:hover {
      background-color: aquamarine;
    }
  }
  ```

- import：將其他 scss 檔案導入到同一個 scss 檔中，方便分類跟重複利用

  > ⚠️注意，除了主 scss 檔案外，其他的 scss 檔案務必要以`_`做為命名開頭
  > 在 import 時，sass 會自動將前面的底線去掉
  > sample

  ```scss
  //創建_font.scss檔案

  //於main.scss檔案進行import
  @import './font';
  ```

- mixin：相當於 function 或 method

  ```scss
  // 打包並提供formal parameter (形式參數)
  @mixin flexbox($direction) {
    display: flex;
    direction: $direction;
  }

  box_1 {
    //載入並給定actual parameter (實際參數)
    @include flexbox(row);
  }
  ```
