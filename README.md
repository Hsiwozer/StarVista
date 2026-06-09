# 星空档案馆 Star Archive

一个面向天文爱好者的沉浸式天文科普与星空展示网站。项目使用 React、Vite、TypeScript 与 Tailwind CSS 构建，采用深色宇宙视觉、星云渐变、玻璃拟态卡片、流星与星光粒子动画。

## 运行项目

```bash
npm install
npm run dev
```

打开终端中显示的本地地址即可预览。

## 构建

```bash
npm run build
```

## 内容结构

- `Home`：全屏星空背景、品牌标题、进入「今日宇宙」和「星空图库」的按钮。
- `Daily Cosmos`：每日天文图片展示区，使用 mock 数据，并预留 NASA APOD API 接入位置。
- `Gallery`：星云、星系、月球、行星等图库卡片，支持分类筛选。
- `Articles`：太阳系、恒星、星云、星系、黑洞、宇宙起源等科普文章卡片。
- `Guide`：新手观星准备、光污染、星座识别、望远镜选择、手机星空摄影。
- `About`：网站创建初衷与天文探索愿景。

## 项目结构

```text
src/
  components/      页面区块与通用组件
  data/            mock 数据
  types/           TypeScript 类型
  App.tsx          页面组合
  index.css        全局样式与动画
  main.tsx         React 入口
public/images/    本地宇宙视觉资产
```
