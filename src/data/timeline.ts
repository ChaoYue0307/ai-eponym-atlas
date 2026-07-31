import type {
  LocalizedText,
  TimelineEraId,
  TimelineEvent,
} from "../types";

export interface TimelineEra {
  readonly id: TimelineEraId;
  readonly startYear: number;
  readonly endYear: number;
  readonly label: LocalizedText;
  readonly range: LocalizedText;
}

export const timelineEras: readonly TimelineEra[] = Object.freeze([
  {
    id: "origins",
    startYear: 1500,
    endYear: 1899,
    label: { en: "Foundations", zh: "源起与早期探索" },
    range: { en: "1500–1899", zh: "1500–1899" },
  },
  {
    id: "formalization",
    startYear: 1900,
    endYear: 1949,
    label: { en: "Formalization", zh: "形式化与计算基础" },
    range: { en: "1900–1949", zh: "1900–1949" },
  },
  {
    id: "systems",
    startYear: 1950,
    endYear: 1999,
    label: { en: "Learning & systems", zh: "学习与系统化阶段" },
    range: { en: "1950–1999", zh: "1950–1999" },
  },
  {
    id: "modern",
    startYear: 2000,
    endYear: 2025,
    label: { en: "Modern AI", zh: "现代 AI 时代" },
    range: { en: "2000–2025", zh: "2000–2025" },
  },
]);

/**
 * A deliberately selective timeline: it connects original publication or
 * naming moments to later adoption in computing and AI. It is not intended as
 * a priority claim; the attribution notes in the catalog carry that nuance.
 */
const curatedTimeline: TimelineEvent[] = [
  {
    id: "descartes-life-1596",
    sortYear: 1596,
    year: { en: "1596–1650", zh: "1596–1650" },
    eraId: "origins",
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
    sourceLinks: [
      {
        label: "MacTutor — René Descartes",
        url: "https://mathshistory.st-andrews.ac.uk/Biographies/Descartes/",
      },
    ],
  },
  {
    id: "descartes-la-geometrie-1637",
    sortYear: 1637,
    year: { en: "1637", zh: "1637" },
    eraId: "origins",
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
    conceptIds: ["cartesian-coordinate-system"],
    sourceLinks: [
      {
        label: "MacTutor — earliest uses of Cartesian terminology",
        url: "https://mathshistory.st-andrews.ac.uk/Miller/mathword/c/",
      },
    ],
  },
  {
    id: "bayes-essay-1763",
    sortYear: 1763,
    year: { en: "1763", zh: "1763" },
    eraId: "origins",
    kind: "publication",
    title: {
      en: "Bayes's essay appears posthumously",
      zh: "贝叶斯的论文在身后发表",
    },
    description: {
      en: "The essay presents a special inverse-probability result; Laplace later generalized the rule now used to update beliefs from evidence.",
      zh: "论文给出一种特殊情形下的逆概率结果；拉普拉斯后来将其推广为今天用于依据证据更新判断的规则。",
    },
    personIds: ["thomas-bayes"],
    conceptIds: ["bayes-theorem", "bayesian-inference"],
    sourceLinks: [
      {
        label: "Bayes (1763) — Royal Society",
        url: "https://doi.org/10.1098/rstl.1763.0053",
      },
    ],
  },
  {
    id: "gaussian-name-spreads-1809",
    sortYear: 1809,
    year: { en: "1809 onward", zh: "1809 年起" },
    eraId: "origins",
    kind: "naming",
    title: {
      en: "The normal curve becomes associated with Gauss",
      zh: "正态曲线逐渐与高斯之名绑定",
    },
    description: {
      en: "The bell-shaped law predates Gauss, but his error theory made “Gaussian” the enduring eponym. The name does not imply sole discovery.",
      zh: "钟形分布早于高斯出现，但他的误差理论使“高斯”成为长期沿用的名称。命名并不等于独立发现。",
    },
    personIds: ["carl-friedrich-gauss"],
    conceptIds: ["gaussian-distribution"],
    sourceLinks: [
      {
        label: "MacTutor — earliest uses of Gaussian terminology",
        url: "https://mathshistory.st-andrews.ac.uk/Miller/mathword/g/",
      },
    ],
  },
  {
    id: "fourier-heat-1822",
    sortYear: 1822,
    year: { en: "1822", zh: "1822" },
    eraId: "origins",
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
    sourceLinks: [
      {
        label: "Fourier (1822) — Original treatise",
        url: "https://gallica.bnf.fr/ark:/12148/bpt6k1045508v",
      },
    ],
  },
  {
    id: "riemann-geometry-1854",
    sortYear: 1854,
    year: {
      en: "1854 lecture · published 1867",
      zh: "1854 年演讲 · 1867 年身后发表",
    },
    eraId: "origins",
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
    sourceLinks: [
      {
        label: "Riemann — On the hypotheses which lie at the foundations of geometry",
        url: "https://www.maths.tcd.ie/pub/HistMath/People/Riemann/Geom/WKCGeom.html",
      },
    ],
  },
  {
    id: "markov-dependent-trials-1906",
    sortYear: 1906,
    year: { en: "1906", zh: "1906" },
    eraId: "formalization",
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
    sourceLinks: [
      {
        label: "Markov (1906) — Extension of the law of large numbers",
        url: "https://eudml.org/doc/128778",
      },
    ],
  },
  {
    id: "noether-invariance-1918",
    sortYear: 1918,
    year: { en: "1918", zh: "1918" },
    eraId: "formalization",
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
    sourceLinks: [
      {
        label: "Noether (1918) — Invariant Variation Problems",
        url: "https://doi.org/10.1080/00411457108231446",
      },
      {
        label: "NeurIPS 2021 — Noether Networks",
        url: "https://proceedings.neurips.cc/paper/2021/hash/886ad506e0c115cf590d18ebb6c26561-Abstract.html",
      },
    ],
  },
  {
    id: "turing-computable-numbers-1936",
    sortYear: 1936,
    year: { en: "1936", zh: "1936" },
    eraId: "formalization",
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
    sourceLinks: [
      {
        label: "Turing (1936) — On Computable Numbers",
        url: "https://doi.org/10.1112/plms/s2-42.1.230",
      },
    ],
  },
  {
    id: "shannon-information-1948",
    sortYear: 1948,
    year: { en: "1948", zh: "1948" },
    eraId: "formalization",
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
    sourceLinks: [
      {
        label: "Shannon (1948) — A Mathematical Theory of Communication",
        url: "https://doi.org/10.1002/j.1538-7305.1948.tb01338.x",
      },
    ],
  },
  {
    id: "bellman-dynamic-programming-1957",
    sortYear: 1957,
    year: { en: "1957", zh: "1957" },
    eraId: "systems",
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
    sourceLinks: [
      {
        label: "Princeton University Press — Dynamic Programming",
        url: "https://press.princeton.edu/books/paperback/9780691146683/dynamic-programming",
      },
    ],
  },
  {
    id: "kalman-filter-1960",
    sortYear: 1960,
    year: { en: "1960", zh: "1960" },
    eraId: "systems",
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
    sourceLinks: [
      {
        label: "Kalman (1960) — A New Approach to Linear Filtering",
        url: "https://doi.org/10.1115/1.3662552",
      },
    ],
  },
  {
    id: "bradley-terry-1952",
    sortYear: 1952,
    year: { en: "1952", zh: "1952" },
    eraId: "systems",
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
    sourceLinks: [
      {
        label: "Bradley & Terry (1952) — Rank analysis of paired comparisons",
        url: "https://doi.org/10.2307/2334029",
      },
    ],
  },
  {
    id: "weisfeiler-leman-1968",
    sortYear: 1968,
    year: { en: "1968", zh: "1968" },
    eraId: "systems",
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
    sourceLinks: [
      {
        label: "Weisfeiler & Leman (1968) — English translation",
        url: "https://www.iti.zcu.cz/wl2018/pdf/wl_paper_translation.pdf",
      },
      {
        label: "ICLR 2019 — How Powerful are Graph Neural Networks?",
        url: "https://openreview.net/forum?id=ryGs6iA5Km",
      },
    ],
  },
  {
    id: "hopfield-memory-1982",
    sortYear: 1982,
    year: { en: "1982", zh: "1982" },
    eraId: "systems",
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
    sourceLinks: [
      {
        label: "Hopfield (1982) — Neural networks and physical systems",
        url: "https://www.pnas.org/doi/10.1073/pnas.79.8.2554",
      },
    ],
  },
  {
    id: "boltzmann-machine-1985",
    sortYear: 1985,
    year: { en: "1985", zh: "1985" },
    eraId: "systems",
    kind: "ai-adoption",
    title: {
      en: "Boltzmann learning makes neural energy models stochastic",
      zh: "玻尔兹曼学习把神经能量模型推广到随机系统",
    },
    description: {
      en: "The Boltzmann machine turns an eponym from thermodynamics into the energy language of stochastic neural networks.",
      zh: "玻尔兹曼机把热力学中的人名概念转化为随机神经网络的能量语言。",
    },
    personIds: ["ludwig-boltzmann"],
    conceptIds: ["boltzmann-machine"],
    sourceLinks: [
      {
        label: "Ackley, Hinton & Sejnowski (1985) — Boltzmann machines",
        url: "https://doi.org/10.1207/s15516709cog0901_7",
      },
    ],
  },
  {
    id: "explainable-generative-metrics-2017",
    sortYear: 2017,
    year: { en: "2017", zh: "2017" },
    eraId: "modern",
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
    sourceLinks: [
      {
        label: "NeurIPS 2017 — SHAP",
        url: "https://proceedings.neurips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html",
      },
      {
        label: "NeurIPS 2017 — Fréchet Inception Distance",
        url: "https://proceedings.neurips.cc/paper/2017/hash/8a1d694707eb0fefe65871369074926d-Abstract.html",
      },
    ],
  },
  {
    id: "stochastic-generative-modeling-2021",
    sortYear: 2021,
    year: { en: "2021", zh: "2021" },
    eraId: "modern",
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
    sourceLinks: [
      {
        label: "ICLR 2021 — Score-Based Generative Modeling through SDEs",
        url: "https://openreview.net/forum?id=PxTIG12RRHS",
      },
      {
        label: "NeurIPS 2021 — Diffusion Schrödinger Bridge",
        url: "https://proceedings.neurips.cc/paper_files/paper/2021/hash/940392f5f32a7ade1cc201767cf83e31-Abstract.html",
      },
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
    year: { en: "2023", zh: "2023" },
    eraId: "modern",
    kind: "ai-adoption",
    title: {
      en: "Old ranking and vision tools acquire new foundation-model roles",
      zh: "经典排序与视觉工具获得基础模型新用途",
    },
    description: {
      en: "Direct preference optimization exposes the Bradley–Terry assumption in language-model alignment, while ControlNet makes Canny edges a reusable structural condition for image generation.",
      zh: "直接偏好优化凸显了语言模型对齐中的 Bradley–Terry 假设；ControlNet 则让 Canny 边缘成为图像生成中常用的可复用结构条件。",
    },
    personIds: ["ralph-bradley", "milton-terry", "john-canny"],
    conceptIds: ["bradley-terry-model", "canny-edge-detector"],
    sourceLinks: [
      {
        label: "NeurIPS 2023 — Direct Preference Optimization",
        url: "https://proceedings.neurips.cc/paper_files/paper/2023/hash/a85b405ed65c6477a4fe8302b5e06ce7-Abstract-Conference.html",
      },
      {
        label: "ICCV 2023 — ControlNet",
        url: "https://openaccess.thecvf.com/content/ICCV2023/html/Zhang_Adding_Conditional_Control_to_Text-to-Image_Diffusion_Models_ICCV_2023_paper.html",
      },
    ],
  },
  {
    id: "arena-and-conditioned-diffusion-2024",
    sortYear: 2024,
    year: { en: "2024", zh: "2024" },
    eraId: "modern",
    kind: "ai-adoption",
    title: {
      en: "Arena ratings and Doob-guided diffusion enter the frontier",
      zh: "竞技场评分与 Doob 引导扩散进入研究前沿",
    },
    description: {
      en: "Large-model arenas operationalize Bradley–Terry ratings, following earlier online Elo scoring, while conditional diffusion uses Doob's h-transform to steer stochastic paths toward evidence or terminal constraints.",
      zh: "大模型竞技场采用 Bradley–Terry 评分，并延续早期在线 Elo 计分的实践；条件扩散则用 Doob h 变换把随机路径引向证据或终端约束。",
    },
    personIds: ["arpad-elo", "ralph-bradley", "milton-terry", "joseph-doob"],
    conceptIds: [
      "elo-rating-system",
      "bradley-terry-model",
      "doob-h-transform",
    ],
    sourceLinks: [
      {
        label: "LMSYS — Chatbot Arena",
        url: "https://www.lmsys.org/blog/2023-12-07-leaderboard/",
      },
      {
        label: "NeurIPS 2024 — Doob h-transform for diffusion models",
        url: "https://proceedings.neurips.cc/paper_files/paper/2024/hash/22d258dfbdf840ccbf266bbc545dd95f-Abstract-Conference.html",
      },
    ],
  },
  {
    id: "kan-2024",
    sortYear: 2024,
    year: { en: "2024", zh: "2024" },
    eraId: "modern",
    kind: "ai-adoption",
    title: {
      en: "Kolmogorov–Arnold networks spark new experiments",
      zh: "柯尔莫哥洛夫–阿诺尔德网络引发新探索",
    },
    description: {
      en: "Inspired by the representation theorem, the architecture places learnable univariate functions on edges.",
      zh: "这一受表示定理启发的架构，把可学习的一元函数放在网络边上。",
    },
    personIds: ["andrey-kolmogorov", "vladimir-arnold"],
    conceptIds: [
      "kolmogorov-arnold-representation",
      "kolmogorov-arnold-network",
    ],
    sourceLinks: [
      {
        label: "Liu et al. (2024) — KAN",
        url: "https://arxiv.org/abs/2404.19756",
      },
    ],
  },
  {
    id: "active-eponyms-2025",
    sortYear: 2025,
    year: { en: "2025", zh: "2025" },
    eraId: "modern",
    kind: "ai-adoption",
    title: {
      en: "Classical mathematical ideas power new AI methods",
      zh: "经典数学思想进入新一代 AI 方法",
    },
    description: {
      en: "Modern Hopfield memory, Koopman dynamics, Wasserstein policy optimization, Sinkhorn transport, Schrödinger bridges, and Bradley–Terry reward models all appear in current AI research.",
      zh: "现代 Hopfield 记忆、Koopman 动力学、Wasserstein 策略优化、Sinkhorn 运输、Schrödinger bridge 与 Bradley–Terry 奖励模型均已进入当代 AI 研究。",
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
    sourceLinks: [
      {
        label: "ICLR 2021 — Hopfield Networks is All You Need",
        url: "https://openreview.net/forum?id=tL89RnzIiCd",
      },
      {
        label: "ICML 2025 — Wasserstein Policy Optimization",
        url: "https://proceedings.mlr.press/v267/pfau25a.html",
      },
      {
        label: "NeurIPS 2025 — Schrödinger bridge research",
        url: "https://proceedings.neurips.cc/paper_files/paper/2025/hash/174692c52dc84fad2b2e99dd8637ce6a-Abstract-Conference.html",
      },
    ],
  },
];

export const timelineEvents: readonly TimelineEvent[] = Object.freeze(
  curatedTimeline.sort((left, right) => left.sortYear - right.sortYear),
);
