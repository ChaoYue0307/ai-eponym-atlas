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
    id: "bradley-terry-1952",
    sortYear: 1952,
    year: "1952",
    kind: "publication",
    title: {
      en: "Bradley and Terry turn pairwise choices into probabilities",
      zh: "Bradley 与 Terry 把成对选择变成概率模型",
    },
    description: {
      en: "A paired-comparison model created for ranking later becomes a standard mathematical assumption behind reward models and preference optimization for language models.",
      zh: "这个最初用于排序的成对比较模型，后来成为语言模型奖励建模与偏好优化中的常见数学假设。",
    },
    personIds: ["ralph-bradley", "milton-terry"],
    conceptIds: ["bradley-terry-model"],
  },
  {
    id: "weisfeiler-leman-1968",
    sortYear: 1968,
    year: "1968",
    kind: "publication",
    title: {
      en: "Weisfeiler and Leman refine graphs by neighborhoods",
      zh: "Weisfeiler 与 Leman 用邻域细化图结构",
    },
    description: {
      en: "Iterative color refinement becomes, decades later, a reference test for the expressive power of message-passing graph neural networks.",
      zh: "迭代颜色细化在数十年后成为衡量消息传递图神经网络表达能力的参照测试。",
    },
    personIds: ["boris-weisfeiler", "andrey-leman"],
    conceptIds: ["weisfeiler-leman-test"],
  },
  {
    id: "hopfield-memory-1982",
    sortYear: 1982,
    year: "1982",
    kind: "publication",
    title: {
      en: "Hopfield gives neural memory an energy landscape",
      zh: "Hopfield 用能量景观刻画神经记忆",
    },
    description: {
      en: "Stored patterns become attractors of a recurrent system, establishing a durable bridge between associative memory, optimization, and statistical physics.",
      zh: "存储模式成为循环系统的吸引子，由此建立联想记忆、优化与统计物理之间的持久桥梁。",
    },
    personIds: ["john-hopfield"],
    conceptIds: ["hopfield-network", "lyapunov-function"],
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
    id: "explainable-generative-metrics-2017",
    sortYear: 2017,
    year: "2017",
    kind: "ai-adoption",
    title: {
      en: "Classical names shape AI explanation and generative evaluation",
      zh: "经典人名概念进入 AI 解释与生成评估",
    },
    description: {
      en: "Shapley-based feature attribution and Fréchet Inception Distance turn cooperative-game credit and distribution geometry into widely used AI tools.",
      zh: "基于 Shapley 的特征归因与 Fréchet Inception Distance，把合作博弈中的贡献分配和分布几何转化为常用 AI 工具。",
    },
    personIds: ["lloyd-shapley", "maurice-frechet"],
    conceptIds: ["shapley-value", "frechet-inception-distance"],
  },
  {
    id: "stochastic-generative-modeling-2021",
    sortYear: 2021,
    year: "2021",
    kind: "ai-adoption",
    title: {
      en: "Stochastic analysis becomes a generative-modeling toolkit",
      zh: "随机分析成为生成建模工具箱",
    },
    description: {
      en: "Score-based SDEs and diffusion Schrödinger bridges make Itô calculus, Langevin dynamics, and Fokker–Planck evolution directly operational in modern generative AI.",
      zh: "基于 score 的 SDE 与扩散 Schrödinger bridge，让 Itô 微积分、Langevin 动力学和 Fokker–Planck 演化直接参与现代生成式 AI。",
    },
    personIds: [
      "kiyosi-ito",
      "paul-langevin",
      "adriaan-fokker",
      "max-planck",
      "erwin-schrodinger",
    ],
    conceptIds: [
      "ito-lemma",
      "langevin-dynamics",
      "fokker-planck-equation",
      "schrodinger-bridge",
    ],
  },
  {
    id: "preference-and-control-2023",
    sortYear: 2023,
    year: "2023",
    kind: "ai-adoption",
    title: {
      en: "Old ranking and vision tools acquire new foundation-model roles",
      zh: "经典排序与视觉工具获得基础模型新用途",
    },
    description: {
      en: "Direct preference optimization exposes the Bradley–Terry assumption in language-model alignment, while ControlNet makes Canny edges a standard structural condition for image generation.",
      zh: "直接偏好优化凸显了语言模型对齐中的 Bradley–Terry 假设；ControlNet 则让 Canny 边缘成为图像生成的常见结构条件。",
    },
    personIds: ["ralph-bradley", "milton-terry", "john-canny"],
    conceptIds: ["bradley-terry-model", "canny-edge-detector"],
  },
  {
    id: "arena-and-conditioned-diffusion-2024",
    sortYear: 2024,
    year: "2024",
    kind: "ai-adoption",
    title: {
      en: "Elo-style evaluation and Doob-guided diffusion enter the frontier",
      zh: "Elo 式评估与 Doob 引导扩散进入研究前沿",
    },
    description: {
      en: "Large-model arenas operationalize pairwise ratings, while conditional diffusion research uses Doob's h-transform to steer stochastic paths toward evidence or terminal constraints.",
      zh: "大模型竞技场把成对评分投入实际评估；条件扩散研究则用 Doob h 变换把随机路径引向证据或终端约束。",
    },
    personIds: ["arpad-elo", "joseph-doob"],
    conceptIds: ["elo-rating-system", "doob-h-transform"],
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
  {
    id: "active-eponyms-2025",
    sortYear: 2025,
    year: "2025",
    kind: "ai-adoption",
    title: {
      en: "Eponymous mathematics remains active across frontier AI",
      zh: "人名数学继续活跃在前沿 AI",
    },
    description: {
      en: "New work on modern Hopfield memory, Koopman dynamics, Wasserstein policy optimization, Sinkhorn transport, Schrödinger bridges, and Bradley–Terry reward models shows that these are living tools, not historical trivia.",
      zh: "现代 Hopfield 记忆、Koopman 动力学、Wasserstein 策略优化、Sinkhorn 运输、Schrödinger bridge 与 Bradley–Terry 奖励模型的新研究表明：这些不是历史冷知识，而是仍在使用的工具。",
    },
    personIds: [
      "john-hopfield",
      "bernard-koopman",
      "leonid-vaserstein",
      "richard-sinkhorn",
      "erwin-schrodinger",
      "ralph-bradley",
      "milton-terry",
    ],
    conceptIds: [
      "hopfield-network",
      "koopman-operator",
      "wasserstein-distance",
      "sinkhorn-algorithm",
      "schrodinger-bridge",
      "bradley-terry-model",
    ],
  },
];

export const timelineEvents: readonly TimelineEvent[] = Object.freeze(
  curatedTimeline.sort((left, right) => left.sortYear - right.sortYear),
);
