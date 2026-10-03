# 🔍 暗网追凶 · Detective Web Game

一款纯前端的沉浸式网页解谜游戏。玩家扮演一名普通推理爱好者，在一个仿真的城市互联网生态里（推理论坛 / 本地新闻 / 生活信息平台 / 模拟搜索引擎）自行搜证、拼合碎片，最终破解一宗连环碎尸抛尸案。

**没有后端、没有第三方运行时依赖**：构建产物是单个 HTML 文件，双击即可离线游玩。

---

## 🚀 快速开始

```bash
# 1. 在仓库根目录安装依赖（npm workspaces，只需一次）
npm install

# 2. 开发
npm run dev:web      # 桌面端 → http://localhost:5173
npm run dev:h5       # 移动端 → http://localhost:5174

# 3. 构建（产物为单文件 HTML）
npm run build        # 两端都构建
npm run build:web    # → web/app/dist/index.html
npm run build:h5     # → h5/app/dist/index.html

# 4. 全量自检：lint + 类型检查 + 线索可达性 + 通关仿真 + 构建
npm run verify
```

> 环境要求：Node.js ≥ 20.11（自检脚本用到原生 TypeScript 支持，推荐 Node 24）、npm ≥ 10。

## 📦 产物与分发

| 产物 | 说明 |
|---|---|
| `web/app/dist/index.html` | 桌面端单文件版，约 437 KB（gzip ≈ 131 KB），零外部依赖 |
| `h5/app/dist/index.html` | 移动端单文件版，约 439 KB（gzip ≈ 132 KB），零外部依赖 |
| `../暗网追凶.html` | 桌面端单文件版的分发副本（内容与 `web/app/dist/index.html` 完全一致） |
| `gh-pages` 分支 | 线上站点，只放移动端单文件版 + `.nojekyll` |

两个产物都是 `file://` 直开的：`HashRouter` + 全内联 JS/CSS，不依赖任何静态资源或网络。

## 🏗️ 工程结构

```
detective-web-game/
├── package.json              # 根工程（npm workspaces + 统一脚本）
├── .oxlintrc.json            # 全仓库共用一份 lint 配置
├── shared/                   # ★ 游戏逻辑单一真源（两端共用，不存在第二份副本）
│   └── src/
│       ├── App.tsx           # 路由表 + 路由级门槛
│       ├── index.css         # 公共样式
│       ├── components/
│       │   ├── MarkButton.tsx    # 统一的「标记为线索」按钮
│       │   └── RouteGuards.tsx   # Phase 3 / 结局的路由守卫
│       ├── data/             # 线索、论坛、新闻、人物、地点、搜索索引、档案、审讯
│       ├── pages/            # 17 个页面
│       └── store/
│           ├── gameStore.ts       # Zustand 状态 + 存档
│           ├── collectionStats.ts # 收集进度的唯一实现
│           └── fragments.ts       # 内容块 → 线索碎片的唯一实现
├── web/app/                  # 桌面端外壳：入口 + 桌面浏览器框架
│   └── src/{main.tsx, platform/browser-frame.tsx}
├── h5/app/                   # 移动端外壳：入口 + 顶部导航/底部 TabBar
│   └── src/{main.tsx, platform.css, platform/browser-frame.tsx}
└── scripts/
    ├── audit-clues.mjs       # 线索可达性自检
    └── playthrough.mjs       # 通关仿真
```

**两端唯一不同的是外壳**：桌面端是地址栏 + 书签栏，移动端是顶部导航 + 底部 TabBar + 全屏搜索面板。
游戏逻辑、页面、数据、状态全部只有一份，在 `shared/` 里。

### 别名约定

| 别名 | 含义 |
|---|---|
| `@shared/*` | `shared/src/*`，跨端共用的游戏代码 |
| `@platform/*` | 当前端的 `web/app/src/platform` 或 `h5/app/src/platform`，只有外壳实现 |

> 两端各自有 `node_modules` 作用域，`vite.config.ts` 里通过 `resolve.dedupe` 强制
> react / react-router-dom / zustand 只打包一份 —— 少了这一步会打出两份 React Context，
> 页面在运行时会直接报错。

## 🧠 关键设计约定

### 线索只有一个真源

`shared/src/data/clues.ts` 的 `ALL_CLUES` 是 23 条线索的唯一定义：

- 线索总数 `TOTAL_CLUE_COUNT`、合法 ID 集合 `VALID_CLUE_IDS` 都由它派生
- **新增一条线索**只需在这里加一条，并保证它在数据层至少有一个可标记载体
- 「哪个内容块承载哪条线索」一律由数据层显式声明（见 `profiles.ts` 的 `clueIds`），
  页面不做任何关键词猜测

### 收集进度只有一个实现

`shared/src/store/collectionStats.ts` 的 `computeCollectionStats()` 同时服务于线索板、收集箱、
最终推理和结局页，阈值常量（95% / 50% / 3 次）也只在这里定义。

### 搜索只有一个入口

搜索结果完全由 `shared/src/data/searchIndex.ts` 的 `SEARCH_INDEX` 决定，`searchAll()` 大小写无关。
新增可搜到的内容 = 在这里加一条关键词映射；数据记录上不再挂 `searchKeywords` 字段
（重构时删掉了约 40 个从未被任何代码读取的数组）。

### 自检脚本必须通过

```bash
npm run audit:clues    # 23 条线索是否都能被玩家标记出来
npm test               # 用真实 store 跑一遍：完美通关 / 门槛边界 / 结局判定
```

`audit:clues` 专门防一类「构建绿、类型绿、但游戏不可能通关」的缺陷：
只要有一条线索在数据层没有任何可标记的载体，收集率上限就会低于 95%，收集箱永远无法通过。
`playthrough.mjs` 进一步用真实的 store 验证胜负条件本身。

### 存档兼容

LocalStorage key 仍是 `darkweb-game-v2`，碎片 id 规则也未变，旧存档可以继续使用。

唯一需要注意的语义变化：`profile-b` 的同事评价第一段（blockId `profile-b-colleague-0`）
现在同时产出 `F04` 与 `P02` 两条线索，而旧版本因实现缺陷只产出 `F04`。
旧存档里这一块已经是「已标记」状态，因此**需要先取消标记、再重新标记一次**，
才能把 `P02` 补进线索板（只点一次是取消标记）。这是 P02 的唯一来源。

## 🛠️ 技术栈

| 层面 | 技术 |
|---|---|
| 框架 | React 19.2 |
| 语言 | TypeScript 6.0 |
| 构建 | Vite 8 + vite-plugin-singlefile |
| 样式 | Tailwind CSS 3.4 |
| 路由 | React Router 7（HashRouter） |
| 状态 | Zustand 5 + persist |
| Lint | oxlint |
| 工程 | npm workspaces |

## 📄 License

Private - All rights reserved.
