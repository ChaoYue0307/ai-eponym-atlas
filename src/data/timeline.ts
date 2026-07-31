import type { TimelineEvent } from "../types";

/**
 * A deliberately selective timeline: it connects original publication or
 * naming moments to later adoption in computing and AI. It is not intended as
 * a priority claim; the attribution notes in the catalog carry that nuance.
 */
const curatedTimeline: TimelineEvent[] = [
  {
    id: "descartes-life-1596",
    sortYear: 1596,
    year: "1596–1650",
    kind: "person",
    title: {
      en: "René Descartes",
      zh: "勒内·笛卡尔",
    },
    description: {
      en: "A philosopher and mathematician whose analytic geometry made position computable—and whose Latinized name still appears throughout AI as “Cartesian.”",
      zh: "这位哲学家与数学家用解析几何让位置变得可计算；他的拉丁化姓氏至今仍以“Cartesian”遍布 AI 文献。",
    },
    personIds: ["rene-descartes"],
    conceptIds: ["cartesian-coordinate-system"],
  },
  {
    id: "descartes-la-geometrie-1637",
    sortYear: 1637,
    year: "1637",
    kind: "publication",
    title: {
      en: "Descartes publishes La Géométrie",
      zh: "笛卡尔发表《几何学》",
    },
    description: {
      en: "Algebraic equations and geometric position become one computational language, laying the groundwork for Cartesian coordinates.",
      zh: "代数方程与几何位置被纳入同一种计算语言，为笛卡尔坐标奠定基础。",
    },
    personIds: ["rene-descartes"],
    conceptIds: ["cartesian-coordinate-system", "cartesian-product"],
  },
  {
    id: "bayes-essay-1763",
    sortYear: 1763,
    year: "1763",
    kind: "publication",
    title: {
      en: "Bayes's essay appears posthumously",
      zh: "贝叶斯的论文在身后发表",
    },
    description: {
      en: "The inverse-probability result later associated with Bayes establishes a rule for updating belief from evidence.",
      zh: "后来与贝叶斯之名相连的逆概率结果，建立了依据证据更新判断的规则。",
    },
    personIds: ["thomas-bayes"],
    conceptIds: ["bayes-theorem", "bayesian-inference"],
  },
  {
    id: "gaussian-name-spreads-1809",
    sortYear: 1809,
    year: "1809 onward",
    kind: "naming",
    title: {
      en: "The normal curve becomes associated with Gauss",
      zh: "正态曲线逐渐与高斯之名绑定",
    },
    description: {
      en: "The bell-shaped law predates Gauss, but his error theory makes “Gaussian” the enduring eponym—a reminder that naming is not the same as sole discovery.",
      zh: "钟形分布早于高斯出现，但他的误差理论使“高斯”成为长期沿用的名称，也提醒我们：命名并不等同于独立发现。",
    },
    personIds: ["carl-friedrich-gauss"],
    conceptIds: ["gaussian-distribution"],
  },
  {
    id: "fourier-heat-1822",
    sortYear: 1822,
    year: "1822",
    kind: "publication",
    title: {
      en: "Fourier's Analytical Theory of Heat",
      zh: "傅里叶出版《热的解析理论》",
    },
    description: {
      en: "Decomposing functions into trigonometric components turns frequency into a general-purpose analytical viewpoint.",
      zh: "把函数分解为三角分量，使频率视角成为通用的分析工具。",
    },
    personIds: ["joseph-fourier"],
    conceptIds: ["fourier-series", "fourier-transform"],
  },
  {
    id: "riemann-geometry-1854",
    sortYear: 1854,
    year: "1854",
    kind: "publication",
    title: {
      en: "Riemann generalizes geometry",
      zh: "黎曼把几何推广到弯曲空间",
    },
    description: {
      en: "Riemann's habilitation lecture frames geometry intrinsically, opening the path to manifolds used in modern representation learning.",
      zh: "黎曼的就职演讲以内禀方式刻画几何，为现代表示学习使用的流形打开道路。",
    },
    personIds: ["bernhard-riemann"],
    conceptIds: ["riemannian-manifold"],
  },
  {
    id: "markov-dependent-trials-1906",
    sortYear: 1906,
    year: "1906",
    kind: "publication",
    title: {
      en: "Markov studies dependent trials",
      zh: "马尔可夫研究相依试验",
    },
    description: {
      en: "Sequences whose next state depends on the present state become the foundation of Markov chains and sequential decision models.",
      zh: "下一状态依赖当前状态的序列，成为马尔可夫链与序贯决策模型的基础。",
    },
    personIds: ["andrey-markov"],
    conceptIds: ["markov-property", "markov-chain"],
  },
  {
    id: "noether-invariance-1918",
    sortYear: 1918,
    year: "1918",
    kind: "publication",
    title: {
      en: "Noether connects symmetry and conservation",
      zh: "诺特连接对称性与守恒律",
    },
    description: {
      en: "A structural bridge between invariance and conserved quantities later inspires symmetry-aware and equivariant models.",
      zh: "不变性与守恒量之间的结构性桥梁，后来启发了对称感知与等变模型。",
    },
    personIds: ["emmy-noether"],
    conceptIds: ["noether-theorem"],
  },
  {
    id: "turing-computable-numbers-1936",
    sortYear: 1936,
    year: "1936",
    kind: "publication",
    title: {
      en: "Turing formalizes computation",
      zh: "图灵形式化“可计算”",
    },
    description: {
      en: "The abstract machine makes algorithmic computation mathematically precise and becomes a reference model for computer science.",
      zh: "抽象机器让算法计算获得精确定义，并成为计算机科学的基准模型。",
    },
    personIds: ["alan-turing"],
    conceptIds: ["turing-machine"],
  },
  {
    id: "shannon-information-1948",
    sortYear: 1948,
    year: "1948",
    kind: "publication",
    title: {
      en: "Shannon quantifies information",
      zh: "香农把信息变成可计算的量",
    },
    description: {
      en: "Entropy gives uncertainty a unit and a calculus, underpinning compression, cross-entropy objectives, and generative modeling.",
      zh: "熵赋予不确定性以单位和计算规则，支撑压缩、交叉熵目标与生成建模。",
    },
    personIds: ["claude-shannon"],
    conceptIds: ["shannon-entropy"],
  },
  {
    id: "bellman-dynamic-programming-1957",
    sortYear: 1957,
    year: "1957",
    kind: "publication",
    title: {
      en: "Bellman codifies dynamic programming",
      zh: "贝尔曼系统化动态规划",
    },
    description: {
      en: "The principle of optimality and Bellman equation become core machinery for control and reinforcement learning.",
      zh: "最优性原理与贝尔曼方程成为控制和强化学习的核心工具。",
    },
    personIds: ["richard-bellman"],
    conceptIds: ["bellman-equation"],
  },
  {
    id: "kalman-filter-1960",
    sortYear: 1960,
    year: "1960",
    kind: "publication",
    title: {
      en: "The Kalman filter is published",
      zh: "卡尔曼滤波发表",
    },
    description: {
      en: "Recursive state estimation makes noisy, partially observed dynamical systems tractable in real time.",
      zh: "递归状态估计使含噪、部分可观测的动态系统能够被实时处理。",
    },
    personIds: ["rudolf-kalman"],
    conceptIds: ["kalman-filter"],
  },
  {
    id: "boltzmann-machine-1985",
    sortYear: 1985,
    year: "1985",
    kind: "ai-adoption",
    title: {
      en: "Statistical mechanics enters neural learning",
      zh: "统计力学进入神经网络学习",
    },
    description: {
      en: "The Boltzmann machine turns an eponym from thermodynamics into the energy language of stochastic neural networks.",
      zh: "玻尔兹曼机把热力学中的人名概念转化为随机神经网络的能量语言。",
    },
    personIds: ["ludwig-boltzmann"],
    conceptIds: ["boltzmann-machine"],
  },
  {
    id: "kan-2024",
    sortYear: 2024,
    year: "2024",
    kind: "ai-adoption",
    title: {
      en: "Kolmogorov–Arnold networks spark new experiments",
      zh: "柯尔莫哥洛夫–阿诺尔德网络引发新探索",
    },
    description: {
      en: "KANs reinterpret the representation theorem as neural layers with learnable functions on edges.",
      zh: "KAN 把表示定理重新解释为在边上学习函数的神经网络层。",
    },
    personIds: ["andrey-kolmogorov", "vladimir-arnold"],
    conceptIds: [
      "kolmogorov-arnold-representation",
      "kolmogorov-arnold-network",
    ],
  },
];

export const timelineEvents: readonly TimelineEvent[] = Object.freeze(
  curatedTimeline.sort((left, right) => left.sortYear - right.sortYear),
);
