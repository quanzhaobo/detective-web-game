# 🔍 Detective Web Game - 深度网页解谜游戏

一款基于 Web 的沉浸式连环案件解谜游戏。玩家扮演侦探，通过调查线索、审讯嫌疑人、分析证据，最终破解一宗连环碎尸抛尸案。

## 🎮 游戏简介

一起连环女性碎尸抛尸案震惊全城。3名受害者均为外地务工女性，失踪前均现身城郊的一家连锁酒店。尸块被抛至环城高速不同匝道的绿化带中。你需要通过缜密的侦查，从众多嫌疑人中锁定真凶。

## 🛠️ 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 8
- **样式**: Tailwind CSS 3
- **路由**: React Router 7
- **状态管理**: Zustand 5

## 📁 项目结构

项目分为 **Web 桌面端** 与 **H5 移动端** 两个独立工程，各自独立安装依赖、独立启动、独立构建与部署。

```
├── web/app/          # Web 桌面端应用（端口 5173）
│   ├── src/
│   │   ├── components/   # 通用组件
│   │   ├── data/         # 游戏数据（案件、线索、嫌疑人等）
│   │   ├── pages/        # 页面组件
│   │   ├── store/        # 状态管理
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
├── h5/app/           # H5 移动端应用（端口 5174，锁定移动端体验）
│   ├── src/              # 与 web 同源，移除桌面浏览器栏，保留移动导航/底部 TabBar
│   ├── package.json
│   └── vite.config.ts
├── PRD-深度网页解谜游戏.md  # 产品需求文档
└── 项目背景.txt            # 游戏背景设定
```

## 🚀 快速开始

两个端为独立工程，需分别安装依赖并启动：

```bash
# ===== Web 桌面端 =====
cd web/app
npm install
npm run dev        # http://localhost:5173
npm run build      # 构建生产版本
npm run preview    # 预览构建结果

# ===== H5 移动端 =====
cd h5/app
npm install
npm run dev        # http://localhost:5174
npm run build      # 构建生产版本
npm run preview    # 预览构建结果
```

> 提示：H5 端在桌面浏览器中打开时会以移动端宽度（480px）居中显示，方便预览；真机上则为全屏移动端体验。

## 📋 游戏特性

- 🔎 **案件调查** - 探索多个场景，搜集关键线索
- 🧩 **线索推理** - 组合分析线索，推导犯罪逻辑
- 👥 **嫌疑人审讯** - 与多位嫌疑人对话，辨别真伪
- 📰 **新闻/论坛** - 游戏内浏览器模拟，获取情报
- 🏆 **推理结案** - 综合所有证据，做出最终判断

## 📄 License

Private - All rights reserved.
