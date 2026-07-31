# AI Eponym Atlas

## AI 人名概念图谱

[![CI](https://github.com/ChaoYue0307/ai-eponym-atlas/actions/workflows/ci.yml/badge.svg)](https://github.com/ChaoYue0307/ai-eponym-atlas/actions/workflows/ci.yml)
[![Deploy](https://github.com/ChaoYue0307/ai-eponym-atlas/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/ChaoYue0307/ai-eponym-atlas/actions/workflows/deploy-pages.yml)
[![License: MIT](https://img.shields.io/badge/code-MIT-003fc7.svg)](./LICENSE)
[![Content: CC BY 4.0](https://img.shields.io/badge/content-CC%20BY%204.0-ef4328.svg)](./CONTENT_LICENSE)

**From Names to Meaning, From Mathematics to AI.**

**从人名回到意义，从数学走向 AI。**

**Decoding the people, mathematics, and ideas behind artificial intelligence.**

**An atlas of eponymous mathematical and technical concepts widely used in artificial intelligence.**

AI Eponym Atlas 是一份面向学习者、研究者和工程师的结构化概念图谱。它整理以人物命名、并广泛出现在数学与人工智能中的术语，解释这些名字背后真正有用的信息：概念解决什么问题、如何直观理解、怎样形式化定义、从何而来、与哪些概念相连，以及它如何参与现代 AI。

*AI Eponym Atlas is a structured reference for learners, researchers, and engineers. It decodes mathematical and technical terms named after people by explaining the problem each concept solves, its intuition and formal definition, its origin and relationships, and its role in modern AI.*

> **GitHub About**
>
> A structured atlas of mathematical and AI concepts named after people, covering their intuitive meaning, formal definition, historical origin, relationships, and applications in modern AI.

[在线网站](https://chaoyue0307.github.io/ai-eponym-atlas/) · [浏览方法](#如何使用--how-to-use) · [数据模板](#条目数据模板--entry-template) · [参与贡献](./CONTRIBUTING.md) · [路线图](#路线图--roadmap)

---

## 为什么做这个项目？ / Why this project?

Cartesian、Gaussian、Bayesian、Markov、Fourier、Jacobian、Hessian、Hilbert、Shannon……

这些词频繁出现在教材、论文和代码中，但人名本身几乎不告诉读者概念是什么意思。命名保存了学术史，却也可能中断理解：当读者遇到一个陌生人名时，往往要先离开当前论证，查清它“到底在做什么”。

AI Eponym Atlas 希望补上这层缺失的信息。这里不会只说“Jacobian 以 Carl Jacobi 命名”，还会先告诉你：

- **它回答什么问题？** 输入发生微小变化时，输出如何变化？
- **功能性名字是什么？** 局部一阶变化率矩阵。
- **一句话直觉是什么？** 多变量函数在某一点附近的最佳线性近似。
- **AI 中在哪里用？** 自动微分、反向传播、机器人运动学、normalizing flows、敏感性分析。

项目的目标不是抹去历史名字，也不是建立另一套强制术语，而是让名字成为理解的入口，而不是阅读的障碍。

*Terms such as Cartesian, Gaussian, Bayesian, Markov, Fourier, Jacobian, Hessian, Hilbert, and Shannon preserve intellectual history, but their names alone reveal little about their function. This project adds the missing semantic layer: the question a concept answers, a functional nickname, an intuitive explanation, a formal account, and its use in AI. It does not replace historical names; it turns them into useful entry points.*

## 项目边界 / Scope

本图谱优先收录满足以下条件的概念：

1. 术语全部或部分源自人物姓名；
2. 在数学、统计、计算机科学、控制、信号处理或相关领域有清晰定义；
3. 在现代 AI 的学习、研究或工程实践中具有直接用途或重要背景价值；
4. 能由可靠来源核实定义、历史与命名关系。

图谱追求**广泛、可核查、持续增长**，但不声称收录“所有”人物或“全部”贡献。同名概念、独立发现、命名争议、后来归因和地域差异都会被明确标注。

*The atlas prioritizes person-named concepts with a clear technical definition and meaningful relevance to modern AI. It aims to be broad, verifiable, and continuously improved, but does not claim to be exhaustive. Ambiguous attribution, independent discovery, and naming disputes are documented rather than flattened.*

## 如何使用 / How to use

### 读论文时快速解码

搜索术语，先看“它回答什么问题”和“一句话直觉”，再按需要展开公式、历史和应用。

*Search a term, read the question it answers and the one-sentence intuition first, then expand into the mathematics, history, and applications.*

### 系统学习时建立连接

按领域、人物、时间线或关系图浏览，例如从 Euclidean distance 连接到 metric、nearest neighbors、clustering 与 embedding space。

*Browse by field, person, timeline, or relationship to connect a term with its namesake, neighboring concepts, and AI uses.*

### 写作和教学时核查术语

检查标准拼写、别名、符号、归因说明和来源，并沿引用链接回到原始或权威资料。

*Verify spelling, aliases, notation, attribution, and sources, then follow citations to primary or authoritative material.*

## 首版功能 / Core features

- **概念速查卡 / Concept cards**：功能性名字、核心问题、直觉、公式和典型 AI 用途。
- **人物档案 / Person profiles**：双语生平概览、相关术语和在图谱中的贡献脉络。
- **双向关系 / Bidirectional links**：人物与概念互相可追溯；`relatedConceptIds` 在关系图中按无向关系解析，并连接到具体 AI 应用。
- **分类浏览 / Faceted browsing**：在概念与人物模式之间切换，并按 9 个数学 / AI 领域筛选。
- **全文搜索 / Full-text search**：支持人名、术语、别名、功能性名字和应用关键词。
- **时间线 / Timeline**：区分人物生卒、成果提出、发表、命名普及等不同时间点。
- **可核查来源 / Verifiable sources**：每个概念至少提供一条来源，并持续补强定义、历史与应用的证据覆盖。
- **中英双语 / Bilingual content**：术语、功能标签、问题、直觉、应用和归因说明均有中英版本；公式、年代与部分来源标题保留规范原文。
- **渐进式阅读 / Progressive disclosure**：先给“现在需要知道的”，再展开严谨细节。

*The first version centers on searchable concept cards, person profiles, bidirectional relationships, filters, timelines, citations, bilingual content, and progressive explanations from intuition to formal detail.*

## 当前条目告诉你什么？ / What an entry tells you today

当前 schema 与网站固定呈现以下信息：

| 层次 | 中文 | English |
| --- | --- | --- |
| 识别 | 标准术语、中文译名、别名与名字来源 | Canonical term, Chinese term, aliases, and namesake |
| 功能 | 它回答什么问题、功能标签与 15 秒直觉 | Question answered, functional nickname, and 15-second intuition |
| 形式化 | 可渲染的定义与符号 | Renderable definition and notation |
| 历史 | 年代与谨慎的归因说明 | Era and a careful attribution note |
| 连接 | 相关人物、相关概念与可聚焦关系图 | People, related concepts, and a focused relationship graph |
| AI 应用 | 在模型、算法、评估或系统中的具体作用 | Concrete role in AI models, algorithms, evaluation, or systems |
| 证据 | 至少一条原始或权威来源链接 | At least one primary or authoritative source link |

发音、带类型的前置 / 变体 / 推广关系、边界条件与最小示例属于下一阶段内容模型，而不是首版已经具备的字段。

*Pronunciation, typed prerequisite/variant/generalization links, explicit boundary conditions, and minimal worked examples are planned schema extensions rather than claims about the current release.*

## 示例：从名字到意义 / Example: from name to meaning

| 原术语 | 功能性名字 | 它回答的问题 | 一句话直觉 | 常见 AI 用途 |
| --- | --- | --- | --- | --- |
| Cartesian coordinates | 几何数值化坐标系 | 一个点在哪里？ | 用有序数值把空间位置编码出来 | embedding space、计算机视觉、机器人坐标 |
| Euclidean distance | 直线距离度量 | 两个点相隔多远？ | 平直空间中“两点之间直线最短”的距离 | k-NN、k-means、向量检索 |
| Gaussian distribution | 钟形随机性模型 | 连续随机波动常呈现什么形状？ | 许多小而独立的扰动叠加后趋向钟形 | 概率建模、噪声模型、扩散模型 |
| Bayes' theorem | 证据更新规则 | 新证据到来后如何更新判断？ | 用似然重新加权已有信念 | 贝叶斯学习、不确定性估计、诊断 |
| Markov property | 状态充分性假设 | 预测下一步需要记住多少过去？ | 当前状态已包含与未来有关的历史信息 | MDP、HMM、强化学习、序列建模 |
| Fourier transform | 频率成分分解器 | 一个信号由哪些频率组成？ | 把复杂变化拆成一组简单振荡 | 音频、图像、时间序列、频域网络 |
| Jacobian matrix | 局部一阶变化率矩阵 | 输入微变时输出怎样变化？ | 多变量映射的局部线性近似 | 自动微分、机器人、normalizing flows |
| Hessian matrix | 局部曲率矩阵 | 函数沿各方向弯曲得多快？ | 梯度如何随位置变化 | 二阶优化、损失景观、影响分析 |
| Shannon entropy | 平均不确定性量 | 观察结果之前有多少不确定性？ | 越难预测的信息源，平均信息量越大 | 交叉熵、决策树、编码、语言模型 |
| Kullback-Leibler divergence | 分布失配代价 | 用分布 Q 近似 P 会损失多少信息？ | 在 P 的样本上，用 Q 编码多付出的平均代价 | VAE、蒸馏、变分推断、RLHF |

这些“功能性名字”是教学辅助描述，不替代领域内的正式术语。后续版本会继续补强直觉的适用边界和容易误导之处。

*Functional nicknames are learning aids, not replacements for standard terminology. Future content passes will make the limits of each intuition more explicit.*

## 信息架构 / Information architecture

```text
Home
├── Search / 全局搜索
├── Explore / 探索
│   ├── Concepts / 概念
│   ├── People / 人物
│   ├── Fields / 领域
│   ├── Relationship Graph / 关系图
│   └── Timeline / 时间线
├── Concept Detail / 概念详情
│   ├── Meaning First / 先理解意义
│   ├── Formal Definition / 形式化定义
│   ├── History & Attribution / 历史与归因
│   ├── AI Applications / AI 应用
│   ├── Relationships / 关系
│   └── Sources / 来源
├── Person Detail / 人物详情
│   ├── Biography / 生平
│   ├── Contributions / 贡献
│   ├── Named Concepts / 人名概念
│   └── Attribution Notes / 归因说明
└── Methodology / 方法与编辑规范
```

建议的仓库结构如下；实际目录以当前代码为准：

```text
ai-eponym-atlas/
├── public/                  # 静态资源
├── src/
│   ├── components/          # 可复用 UI
│   ├── data/                # 类型化目录与历史时间线
│   ├── hooks/               # URL 路由与界面状态
│   ├── lib/                 # 搜索、关系图与数据测试
│   ├── App.tsx              # 页面组合与路由
│   └── styles.css           # 全局设计系统
├── content/
│   └── eponyms.json         # 人物、概念与引用的权威数据源
├── design/concepts/         # 视觉规范概念稿
├── .github/workflows/       # CI 与 GitHub Pages
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## 条目数据模板 / Entry template

概念与人物分开存储，并通过稳定 ID 连接。下面是便于理解的精简示例；完整字段、必填规则和来源规范见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

```json
{
  "id": "jacobian-matrix",
  "personIds": ["carl-gustav-jacobi"],
  "term": "Jacobian matrix",
  "zhTerm": "雅可比矩阵",
  "aliases": ["Jacobian", "Jacobi matrix"],
  "functionNickname": {
    "en": "Local input-to-output sensitivity map",
    "zh": "局部输入到输出的敏感度地图"
  },
  "question": {
    "en": "If each input changes slightly, how does every output change?",
    "zh": "每个输入稍微变化时，各个输出会怎样变化？"
  },
  "intuition": {
    "en": "Arrange all first partial derivatives into the best local linear map.",
    "zh": "把所有一阶偏导排成矩阵，得到最佳局部线性映射。"
  },
  "formalDefinition": "For $f:\\mathbb R^n\\to\\mathbb R^m$, $J_f(x)_{ij}=\\frac{\\partial f_i}{\\partial x_j}$.",
  "aiApplications": [
    {
      "en": "Backpropagation and automatic differentiation",
      "zh": "反向传播与自动微分"
    }
  ],
  "category": "calculus",
  "era": "19th century",
  "relatedConceptIds": ["hessian-matrix", "gauss-newton-method"],
  "tags": ["derivatives", "autodiff", "flows", "robotics"],
  "attributionNote": {
    "en": "The determinant is directly tied to Jacobi's work; the full derivative-matrix terminology is later.",
    "zh": "变量变换中的行列式直接源于 Jacobi 的工作；完整导数矩阵术语形成于后世。"
  },
  "sourceLinks": [
    {
      "label": "Encyclopedia of Mathematics — Jacobi matrix",
      "url": "https://encyclopediaofmath.org/wiki/Jacobi_matrix"
    }
  ]
}
```

## 内容组织原则 / Editorial principles

### 1. Meaning first

先回答“它做什么”，再介绍“它以谁命名”。标题保留标准术语，正文增加可理解的功能性解释。

*Explain what the concept does before explaining whom it honors.*

### 2. Intuition with boundaries

直觉必须有帮助，也必须说明适用条件。比如 KL divergence 常被口语化称为“距离”，但它通常不对称，也不满足三角不等式。

*Every intuition should state its limits. For example, KL divergence is often described loosely as a distance, although it is asymmetric and is not generally a metric.*

### 3. History without hero mythology

区分“发现者”“首次发表者”“推广者”和“后来被冠名者”。面对独立发现和有争议的归因，保留复杂性。

*Separate discovery, publication, popularization, and later naming. Preserve ambiguity where the historical record is ambiguous.*

### 4. AI relevance must be concrete

不只写“用于机器学习”，而要说明它在什么模型、算法或推导中承担什么作用。

*Do not merely say that a concept is used in machine learning. State where it appears and what role it plays.*

### 5. Sources over confidence

定义、历史归因和 AI 应用是不同类型的主张，应分别由适合的来源支持。无法确认时标记待核查，不用确定语气掩盖缺口。

*Definitions, historical attribution, and AI applications are different claims and should be supported by appropriate sources.*

## 内容质量标准 / Content quality standards

按当前 schema，合并前的条目至少应满足：

- 标准英文术语、中文译名、别名和稳定 ID 一致；
- “问题 - 直觉 - 定义 - AI 应用”形成完整解释链；
- 数学符号可渲染，关键变量尽可能定义清楚；
- 每项 AI 应用说明具体机制，而非只列领域名；
- 每个概念至少有一条可靠来源，重要历史主张尽量交叉核对；
- 中文自然准确，英文术语符合领域惯例；
- 不把功能性昵称包装成正式术语；
- 不含无法授权的图片、长篇受版权保护的原文或隐私信息；
- 人物和相关概念引用有效，并通过类型、数据、测试和构建检查。

*Before merging, an entry should form a complete chain from question to intuition, definition, and AI use; cite reliable sources; describe attribution carefully; use natural bilingual language; and pass the repository checks.*

## 快速开始 / Quick start

需要 [Node.js](https://nodejs.org/) 的当前 LTS 版本和 npm。

```bash
git clone https://github.com/ChaoYue0307/ai-eponym-atlas.git
cd ai-eponym-atlas
npm install
npm run dev
```

Vite 会在终端显示本地开发地址，通常是 `http://localhost:5173`。

生产构建与本地预览：

```bash
npm run build
npm run preview
```

建议在提交前执行：

```bash
npm run check
```

*Install the current Node.js LTS release, clone the repository, run `npm install`, and start Vite with `npm run dev`. Before submitting a change, run type checks, tests, and the production build.*

## 参与贡献 / Contributing

欢迎贡献新的概念、人物资料、历史勘误、公式修正、来源补充、翻译、无障碍改进与网站功能。

推荐流程：

1. 阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)；
2. 搜索现有 issue 和条目，避免重复；
3. 较大改动先开 issue，说明范围与资料依据；
4. 从小而完整的改动开始，例如一个人物和一个关联概念；
5. 新建分支并按 schema 编辑数据；
6. 执行校验、测试和生产构建；
7. 提交 PR，并在说明中列出新增主张及对应来源。

```bash
git switch -c content/add-jacobian
git add content/eponyms.json
git commit -m "content: add Jacobian matrix entry"
git push -u origin content/add-jacobian
```

*Contributions are welcome across content, corrections, citations, translation, accessibility, and product features. Search existing work first, discuss broad changes in an issue, keep each pull request focused, validate the data and build, and explain the evidence behind new claims.*

## 路线图 / Roadmap

路线图按能力阶段组织，不承诺固定发布日期：

### 已上线：Founding edition

- 57 位人物、75 个概念与 141 条来源链接；
- 双语 schema、搜索、领域筛选、概念详情与人物详情；
- 1 / 2 跳关系图、等价关系列表与可筛选时间线；
- 数据测试、持续集成、贡献模板与 GitHub Pages。

### Phase 2 - 更深的学习连接 / Deeper learning links

- 带类型的前置、变体、推广、对偶与易混淆关系；
- 学习路径与领域地图；
- “容易混淆”对比页；
- 最小示例、边界条件和交互式图解；
- 发音、证据角色与人物级来源。

### Phase 3 - 更可靠、更易复用 / Improve reliability and reuse

- 自动 schema、重复项、引用和失效链接检查；
- 内容审校状态与变更历史；
- 可下载 JSON 数据集和稳定版本；
- 面向教学与研究工具的查询接口。

### Phase 4 - 社区扩展 / Community growth

- 扩展到更多 AI 子领域和跨文化命名传统；
- 社区策展的阅读清单与专题路径；
- 与外部知识图谱建立可核查的标识符映射；
- 探索更多语言版本。

*The roadmap builds on the released bilingual atlas and relationship tools with typed learning links, reusable data, stronger evidence modeling, and broader community-led coverage.*

## 网站与 GitHub Pages / Website and GitHub Pages

本项目使用 React + Vite 构建静态网站，适合部署到 GitHub Pages。

### 维护者设置

1. 在 `vite.config.*` 中将 `base` 设置为仓库路径：

   ```ts
   export default defineConfig({
     base: process.env.GITHUB_ACTIONS ? "/ai-eponym-atlas/" : "/"
   });
   ```

2. 在 GitHub 仓库中打开 **Settings > Pages**。
3. 在 **Build and deployment** 下选择 **GitHub Actions**。
4. 使用工作流安装依赖、运行检查、执行 `npm run build`，并将 `dist/` 上传为 Pages artifact。
5. 推送到默认分支后，在 Actions 页面确认部署完成。

若部署在用户或组织根站点，或使用自定义域名，`base` 配置可能不同。路由、静态资源和分享链接应在最终 Pages URL 下验证。

典型地址：

```text
https://chaoyue0307.github.io/ai-eponym-atlas/
```

*The React + Vite site can be deployed as a static GitHub Pages project. Configure Vite's base path, select GitHub Actions as the Pages source, build the project, upload `dist/`, and verify routing and assets at the final repository URL.*

## 方法透明与局限 / Methodology and limitations

- 人名术语不等于某个人单独完成了概念的全部发展；
- 现代名称可能晚于原始工作多年，且不同地区或学科可能使用不同名称；
- “广泛用于 AI”是会随时间变化的判断，条目应给出具体应用证据；
- 中文译名可能存在多个版本，默认保留最常见译名并列出别名；
- 功能性名字是一种解释工具，会随着更好的表述而迭代；
- 本项目是学习与研究索引，不替代教材、原始论文或专业建议。

*Eponymous names do not imply sole authorship. Naming often postdates discovery, usage differs across communities, and AI relevance changes over time. This atlas is a navigational reference, not a substitute for primary literature or complete textbooks.*

## 许可 / License

代码使用 [MIT License](./LICENSE)；原创条目、结构化数据、`design/concepts/` 视觉稿与 `public/brand-mark.png` 使用 [CC BY 4.0](./CONTENT_LICENSE)。贡献者在提交内容时，同意其贡献可按仓库所采用的对应许可发布。第三方图片、引文和数据仍受各自许可或版权约束，必须在条目中清楚标注。

*Code is released under the MIT License; original entries and structured content are released under CC BY 4.0. Third-party images, quotations, and datasets remain subject to their own licenses and must be attributed clearly.*

## 致谢 / Acknowledgements

这个项目从一个很朴素的问题开始：

> 当一个术语只是某个人的名字时，读者怎样才能立刻知道它的意义？

感谢每一位帮助核查定义、补充历史、改进翻译、连接概念和解释 AI 用途的贡献者。

*This project began with a simple question: when a term is only a person's name, how can a reader immediately recover its meaning? Thank you to everyone who helps verify, clarify, connect, and teach.*
