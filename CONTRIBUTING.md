# 为 AI Eponym Atlas 贡献 / Contributing to AI Eponym Atlas

感谢你帮助我们把人名背后的数学与 AI 意义解释清楚。

AI Eponym Atlas 的重点不是尽可能多地收集名字，而是建立**可理解、可核查、可连接**的条目。一个范围小但证据完整的贡献，比一批只有标题的占位条目更有价值。

*Thank you for helping decode the mathematics and AI ideas behind eponymous names. A small, well-supported contribution is more valuable than a large set of unverified placeholders.*

## 开始之前 / Before you start

1. 搜索 [现有条目](./content/eponyms.json) 和 GitHub issues，避免重复。
2. 确认术语确实全部或部分源自人物姓名，并且与现代 AI 有具体联系。
3. 新概念涉及新人名时，同时新增人物记录。
4. 归因不确定时请明确写出边界，不要猜测。
5. 大批量新增、schema 变更或界面重构，请先开 issue。

*Search existing work first, confirm that the term is genuinely eponymous and concretely relevant to AI, add missing people alongside concepts, and discuss broad changes before implementation.*

## 权威数据源 / Canonical data source

所有人物、概念与来源都保存在：

```text
content/eponyms.json
```

经核验的人物身份链接、肖像来源与逐图许可保存在：

```text
content/people-media.json
```

网站通过 `src/data/catalog.ts` 对两份 JSON 做严格类型化并按人物 ID 合并。不要在组件里复制条目；`eponyms.json` 是文字与概念的权威数据源，`people-media.json` 仅存放可独立审计的第三方媒体元数据。

The website treats `content/eponyms.json` as the canonical editorial source and
`content/people-media.json` as the auditable media catalog. Do not duplicate
entries inside React components.

人物页由 `src/lib/personProfile.ts` 从关联概念中派生承载该人物姓名的术语、去重后的 AI 应用和按概念分组的证据。新增或修订内容时应更新权威概念记录，不要在人物页组件中另写一套容易漂移的表述。

`src/lib/personProfile.ts` derives each profile's terms carrying the person's name,
deduplicated AI applications, and concept-grouped evidence from the linked
concept records. Update the canonical concept data instead of maintaining a
second set of profile claims in the UI.

顶层结构：

```json
{
  "meta": {},
  "people": [],
  "concepts": []
}
```

## ID 规则 / ID conventions

- 使用小写 ASCII `kebab-case`。
- 人物 ID 使用完整常用姓名，例如 `carl-gustav-jacobi`。
- 概念 ID 使用规范英文术语，例如 `jacobian-matrix`。
- ID 发布后保持稳定；翻译、展示名或别名变化不应改变 ID。
- 同一个概念的拼写变体放入 `aliases`，不要创建重复记录。
- `personIds` 与 `relatedConceptIds` 必须引用已存在或同一 PR 新增的 ID。

## 人物记录 / Person record

实际 schema：

```json
{
  "id": "carl-gustav-jacobi",
  "name": "Carl Gustav Jacob Jacobi",
  "zhName": "卡尔·古斯塔夫·雅各布·雅可比",
  "born": "1804",
  "died": "1851",
  "region": "Prussia",
  "portraitInitials": "CJ",
  "summary": {
    "en": "Mathematician whose work shaped determinants, transformations, and elliptic functions.",
    "zh": "其工作深刻影响行列式、变量变换与椭圆函数的数学家。"
  },
  "concepts": ["jacobian-matrix"]
}
```

字段要求：

- `name`：学术文献中最常见的英文或拉丁字母姓名。
- `zhName`：自然、常见的中文译名。
- `born` / `died`：使用年份字符串；在世人物的 `died` 写 `null`。若可靠资料无法确认生卒年，可将两者均写为 `null`，界面会明确显示“生卒年待考”，不要猜测年份。
- `region`：简洁历史/地理描述，不强行套用今天的国界。
- `portraitInitials`：用于无照片人物标记，通常为 2 个字母。
- `summary`：只写与图谱条目相关的贡献，不写泛化传记。
- `concepts`：反向指向该人物关联的概念 ID。

### 人物肖像 / Person portrait

不要把未经核验的网络图片放进仓库。肖像贡献必须遵循
[`docs/PORTRAITS.md`](./docs/PORTRAITS.md)：

- 先用姓名与生卒年确认 Wikidata 身份；
- 从该实体的 P18 进入 Wikimedia Commons 文件页；
- 仅接受 public domain、CC0、CC BY 或 CC BY-SA 图片；
- 下载有界缩略图到 `public/portraits/`；
- 在 `content/people-media.json` 中完整填写人物 ID、本地文件、原始缩略图 URL、Commons 文件页、创作者、许可、许可链接、双语 alt text 和核验日期；
- 不确定时保留 `portraitInitials`，不要猜测。
- 不生成历史人物形象；身份或全球可复用许可无法核实时，应继续使用有明确说明的姓名首字母占位符。

Every accepted portrait needs a clear identity match and a complete,
file-specific attribution record. A monogram is the correct fallback when no
reliable open portrait is available. Generated historical likenesses are not
accepted.

可使用以下命令检查 Wikidata 与 Wikimedia Commons 中的新候选图像：

```bash
npm run portraits:audit -- --search --accepted-only
```

The audit report is discovery support, not approval. Manually confirm the
person's identity and the exact Commons file's globally reusable license before
editing `content/people-media.json`.

## 概念记录 / Concept record

```json
{
  "id": "jacobian-matrix",
  "personIds": ["carl-gustav-jacobi"],
  "term": "Jacobian matrix",
  "zhTerm": "雅可比矩阵",
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
  "aliases": ["Jacobian", "Jacobi matrix"],
  "tags": ["derivatives", "autodiff", "flows", "robotics"],
  "attributionNote": {
    "en": "The determinant is directly tied to Jacobi's work; the full derivative-matrix terminology is later.",
    "zh": "变量变换中的行列式直接源于 Jacobi 的工作；完整导数矩阵术语形成于后世。"
  },
  "sourceLinks": [
    {
      "label": "Encyclopedia of Mathematics — Jacobi matrix",
      "url": "https://encyclopediaofmath.org/wiki/Jacobi_matrix"
    },
    {
      "label": "MIT OpenCourseWare — Jacobians",
      "url": "https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/"
    }
  ]
}
```

### `functionNickname`

这是 Atlas 的教学辅助标签，不是要替代正式术语。

- 应直接描述功能，例如 “Second-order curvature map”。
- 不要只把英文术语翻译一遍。
- 避免把有限条件下的直觉写成普遍真理。
- 界面会明确显示“Atlas plain-language label”。

*This is an editorial teaching aid, not replacement terminology. Describe the concept’s function and keep its limits explicit.*

### `question`

用一个读者真正会问的问题说明概念解决什么。例如：

```text
How does a scalar function bend near this point?
函数在这一点附近沿不同方向怎样弯曲？
```

### `intuition`

- 一到两句即可。
- 不能只重复公式。
- 必须与形式化定义一致。
- 如果类比容易误导，在 `attributionNote` 或条目措辞中说明边界。

### `formalDefinition`

- 使用 `$...$` 包围 LaTeX 片段；普通解释可与公式混排。
- 定义所有重要变量和对象形状。
- 写出关键条件，例如可微性、支持集或正定性。
- 避免只放公式而没有说明输入和输出。

### `aiApplications`

每项应说明概念在模型或算法中**承担什么作用**。

好：

```text
Normalizing flows use the Jacobian determinant in change-of-variables density evaluation.
```

不够具体：

```text
Used in machine learning.
```

### `category`

当前只接受以下值：

```text
algebra
calculus
computation
dynamics
geometry
information
optimization
probability
statistics
```

### `attributionNote`

人名记录的是命名史，不自动等于独立发明。请区分：

- 本人的直接工作；
- 同时代独立发现；
- 后世形式化或推广；
- 以基础概念派生命名的新算法；
- 有争议或追溯性的冠名。

例如：

- Cartesian coordinates 不能写成“笛卡尔单独发明了现代坐标系”；
- Gaussian distribution 需要承认 de Moivre、Laplace 等先前贡献；
- KAN 来自 Kolmogorov–Arnold representation theorem 的启发，不等于直接实现原定理；
- KL divergence 不是数学 metric；
- Student 是 William Sealy Gosset 的笔名。

### `sourceLinks`

每个概念至少需要 2 条高质量来源（通常 2–4 条）：

1. 原始论文、书籍或 DOI；
2. NIST、大学课程、官方技术文档等权威定义；
3. 可靠数学史来源，用于命名和归因。

来源必须直接支持条目中的主张。不要只链接搜索结果、营销博客、AI 生成摘要或无法定位具体内容的首页。

人物页会按概念展示这些链接，因此其证据范围不变：它们支持相应概念的定义、历史归因或 AI 用途，并不自动成为完整人物传记的来源。`profileUrl` 中的 Wikidata 链接用于身份消歧，也不能替代专门的人物传记来源。

对快速变化的 AI 用途，应尽量补充 2020 年以来的一手论文；预印本需要在来源标签中明确说明。经典定义和历史事实不因来源年代久远而降级，但“当前仍活跃”的判断需要近期证据。完整边界见 [`docs/COVERAGE.md`](./docs/COVERAGE.md)。

*Use at least two reference links: primary literature where practical, authoritative mathematical references for definitions, and reliable historical sources for attribution. Fast-moving AI relevance should normally have a recent primary source.*

*On person profiles, these remain concept citations. A Wikidata profile is an
identity record, not a full biography source.*

## 双语写作 / Bilingual writing

- 英文保留规范术语；中文使用自然表达，不做逐词硬译。
- `term` 与 `zhTerm` 是正式名称；`functionNickname` 是解释性标签。
- 中英文信息量应基本对等。
- 缩写首次出现时展开。
- 中文正文可保留领域通用英文，例如 embedding、normalizing flow，但首次出现应给出上下文。

## 本地开发 / Local development

需要 Node.js 20.19+（推荐当前 LTS）和 npm。

```bash
npm install
npm run dev
```

提交前运行完整检查：

```bash
npm run check
```

等价于：

```bash
npm run lint
npm run lint:docs
npm test -- --run
npm run build
```

还应手工确认：

- 新人物与概念能被中英文搜索找到；
- 人物、相关概念引用均可达；
- 公式在桌面与手机宽度都可读；
- 图谱有等价的关系列表，不依赖 hover；
- 键盘焦点清晰；
- 外部来源确实打开到预期材料。
- 人物页中的核心贡献、AI 应用和证据与关联概念一致，没有重复或跨概念误归类。

## Git 与 PR 流程 / Git and pull requests

```bash
git switch -c content/add-jacobian
git add content/eponyms.json
git commit -m "content: add Jacobian matrix entry"
git push -u origin content/add-jacobian
```

建议前缀：

```text
content/   新增或修订知识条目
fix/       修复网站或数据问题
feature/   新增功能
docs/      文档
chore/     工具与维护
```

保持 PR 聚焦：一个新人物及其紧密相关概念、一组同主题勘误，或一个可独立评审的产品功能。

## PR checklist

- [ ] ID 使用稳定 `kebab-case`，没有重复人物或概念。
- [ ] `personIds` 与人物 `concepts` 双向引用完整；`relatedConceptIds` 引用有效，语义上对称的关系优先在数据中双向补齐。
- [ ] 中英文正式术语、问题、直觉和功能标签自然准确。
- [ ] 功能标签没有伪装成标准数学术语。
- [ ] 形式化定义包含必要变量和条件。
- [ ] AI 应用说明了具体机制，而不只是领域名。
- [ ] 归因说明区分直接贡献、后世命名与争议。
- [ ] 每条关键主张有直接支持它的来源。
- [ ] 没有复制无法授权的图片或长篇版权文本。
- [ ] 人物身份记录、概念证据与人物传记来源没有被混为一谈。
- [ ] 肖像已核验身份与逐图许可；没有合格肖像时保留有说明的姓名首字母，不生成历史人物形象。
- [ ] `npm run check` 通过。
- [ ] 在桌面、移动端和键盘操作下检查了相关页面。

## 许可 / Licensing

代码贡献按 [MIT License](./LICENSE) 发布；原创条目和结构化内容按 [CC BY 4.0](./CONTENT_LICENSE) 发布。提交 PR 即表示你有权贡献这些内容，并同意使用对应许可。

*Code contributions are released under MIT. Original entries and structured content are released under CC BY 4.0.*
