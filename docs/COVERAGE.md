# Coverage and currency / 覆盖范围与时效性

AI Eponym Atlas is broad by design, but it is not a list of every surname that
has ever appeared in a technical paper. This note explains what the atlas
counts, how it treats “latest” material, and where the remaining gaps are.

AI 人名概念图谱追求广泛覆盖，但不是把技术文献里出现过的所有姓氏都收进来。本说明记录图谱的收录边界、时效性标准和仍待补齐的方向。

## Inclusion test / 收录测试

A concept is normally included only when all four tests pass:

1. The standard technical name is wholly or partly derived from a real person.
2. The concept has a stable mathematical, statistical, computational, or
   engineering definition.
3. It has a concrete role in AI research, learning, evaluation, or systems—not
   merely a distant analogy.
4. Its definition, attribution, and AI use can be checked against direct
   sources.

一项概念通常需要同时满足：

1. 规范术语全部或部分来自真实人物姓名；
2. 在数学、统计、计算或工程中有稳定定义；
3. 在 AI 研究、学习、评估或系统中承担具体作用，而非只有遥远类比；
4. 定义、归因和 AI 用途可以由直接来源核查。

An eponym is a naming relationship, not a priority award. Where discovery,
formalization, and later naming differ, the entry says so explicitly.

人名术语记录的是命名关系，不是“唯一发现者”奖章。若发现、形式化、推广和后世命名并不重合，条目会明确区分。

## What “current” means / “最新”意味着什么

The atlas uses two clocks:

- **Foundational clock:** original papers and authoritative mathematical
  references establish the definition and historical lineage. These sources do
  not become obsolete merely because they are old.
- **AI clock:** fast-moving relevance claims should be supported by a primary AI
  source from 2020 onward when practical. A preprint is labeled as such and is
  not presented as settled consensus.

图谱同时使用两种时间尺度：

- **基础时间尺度：**原始论文和权威数学资料用于确认定义与历史谱系；经典来源不会因为年代久远而失效。
- **AI 时间尺度：**快速变化的应用主张尽量由 2020 年以来的一手 AI 论文支撑；预印本会明确标注，不会被写成已经形成共识。

The catalog metadata records the editorial cutoff date. “Current through that
date” means that the active-use evidence was checked up to the cutoff; it does
not claim that every paper published before that date was exhaustively searched.

目录元数据记录编辑核查截止日期。“截至该日期保持更新”表示活跃用途证据核查到这一时间点，并不声称穷尽该日期以前发表的全部论文。

## Coverage bands / 覆盖层级

The released catalog balances three bands:

- **Core:** concepts encountered repeatedly across general AI and ML, such as
  Jacobians, Gaussian models, Bayes, Markov processes, Fourier analysis, and
  constrained optimization.
- **Extended:** field-defining tools common in particular subdomains, such as
  numerical eigensolvers, statistical bounds, sequence decoders, graph tests,
  signal operators, and manifold methods.
- **Active frontier:** older eponyms with renewed importance in present AI, such
  as Langevin and Itô methods in diffusion, Schrödinger bridges and Sinkhorn
  scaling in generative transport, Bradley–Terry models in preference learning,
  and modern Hopfield networks in associative memory.

The 2026-07-31 editorial snapshot contains **117 people, 120 concepts, and 247
direct source links across nine subject categories**. These counts describe the
released dataset, not a claim that the universe of AI-relevant eponyms is closed.

Every person profile includes a bilingual introduction, localized lifespan and
region facts, linked core contributions, deduplicated AI applications, and
evidence grouped by concept. The current media coverage is **78 verified real
portraits** plus **39 labelled monogram fallbacks**. The atlas does not generate
historical likenesses when a reusable portrait cannot be verified.

已发布目录在三层之间保持平衡：

- **核心层：**通用 AI / ML 中反复出现的概念；
- **扩展层：**在数值计算、统计学习、序列、图、信号和流形等子领域中常见的工具；
- **活跃前沿层：**历史概念在当前 AI 中重新获得关键作用的条目，例如扩散中的 Langevin / Itô、生成运输中的 Schrödinger bridge / Sinkhorn、偏好学习中的 Bradley–Terry，以及现代 Hopfield 记忆网络。

截至 2026-07-31 的编辑快照包含 **117 位人物、120 个概念、247 条直接来源链接和 9 个领域分类**。这些数字描述当前已发布数据集，并不意味着 AI 相关人名概念已经穷尽。

每个人物页都包含双语简介、本地化生卒年份与地区信息、可继续阅读的核心贡献、去重后的 AI 应用，以及按概念分组的证据。当前媒体覆盖包括 **78 幅经核验的真实肖像**和 **39 个明确标注的姓名首字母占位符**；无法核验可复用肖像时，图谱不会生成历史人物形象。

## Explicit exclusions / 明确排除

The following are useful AI terms but are not person eponyms:

- **Adam** — Adaptive Moment Estimation
- **LoRA** — Low-Rank Adaptation
- **Mamba** — a model name, not a namesake
- **Transformer, FlashAttention, Flow Matching** — descriptive technical names

Other edge cases are deferred rather than silently forced into the schema:

- **Hungarian algorithm** is named for a nationality and has a more complicated
  Kuhn–Munkres history.
- **Procrustes analysis** uses a mythological figure, not a scientist or
  technical contributor.
- Product names and paper titles that merely contain an older eponym link back
  to the underlying concept instead of becoming duplicate entries.

以下常用 AI 术语并非人物人名概念：Adam、LoRA、Mamba、Transformer、FlashAttention、Flow Matching。

“匈牙利算法”来自国名，Procrustes 来自神话人物；这类边界项暂不强行纳入当前人物 schema。

## Evidence floor / 证据底线

Each concept should have at least two direct links:

1. a primary paper or authoritative technical definition; and
2. a second source supporting attribution, implementation, or a concrete AI
   application.

Fast-moving entries should include a recent primary AI paper where available.
Definitions, history, and application are different claims; one convenient
webpage is not assumed to prove all three.

On a person profile, these citations retain the same scope: they support the
connected concept's definition, history, attribution, or use claims. They are
not presented as complete sources for the person's life. A Wikidata link is an
identity record for disambiguation, not a substitute for a biographical source.

每个概念至少应有两条直接来源：一条原始论文或权威定义，以及一条支持归因、实现或具体 AI 用途的独立来源。快速变化的条目在条件允许时还应包含近年的一手 AI 论文。定义、历史和应用是不同主张，不能默认一张网页同时证明全部内容。

## Topics not yet covered in depth / 尚待深入的主题

Coverage is currently thinner in:

- deeper coverage of optimization duality, variance reduction, and advanced
  non-smooth methods;
- geometric deep learning representation theory;
- causal inference, experimental design, and calibration;
- scientific-ML operators and numerical PDE methods;
- pronunciation, fuller person-level biographical source sets, worked examples,
  and typed relationship edges;
- broader review of naming traditions outside the dominant European and North
  American historical canon.

目前较薄弱的方向包括优化对偶、方差缩减与高级非光滑方法、几何深度学习表示论、因果推断与校准、科学机器学习数值方法，以及人物级来源、最小示例和带类型关系；欧美主导史观之外的命名传统也仍需更系统的梳理。
