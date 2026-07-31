import type { LocalizedText } from '../types'

export interface LearningPath {
  readonly id: string
  readonly title: LocalizedText
  readonly description: LocalizedText
  readonly conceptIds: readonly string[]
}

/**
 * Curated reading sequences. Their order is pedagogical: it helps a reader
 * build one useful mental model and does not imply historical causality.
 */
export const learningPaths: readonly LearningPath[] = Object.freeze([
  {
    id: 'geometry-to-gradients',
    title: {
      en: 'Geometry to gradients',
      zh: '从几何到梯度',
    },
    description: {
      en: 'Move from coordinates and distances to derivatives that power optimization.',
      zh: '从坐标与距离出发，逐步理解驱动优化的一阶与二阶导数。',
    },
    conceptIds: [
      'cartesian-coordinate-system',
      'euclidean-distance',
      'taylor-series',
      'jacobian-matrix',
      'hessian-matrix',
      'newton-method',
    ],
  },
  {
    id: 'evidence-to-uncertainty',
    title: {
      en: 'Evidence to uncertainty',
      zh: '从证据到不确定性',
    },
    description: {
      en: 'Connect belief updates, probability models, sequences, and noisy state estimation.',
      zh: '连接信念更新、概率模型、序列依赖与含噪状态估计。',
    },
    conceptIds: [
      'bayes-theorem',
      'bayesian-inference',
      'gaussian-distribution',
      'markov-chain',
      'hidden-markov-model',
      'kalman-filter',
    ],
  },
  {
    id: 'signals-to-representations',
    title: {
      en: 'Signals to representations',
      zh: '从信号到表示',
    },
    description: {
      en: 'See how frequency, scale, locality, and graph structure become usable features.',
      zh: '理解频率、尺度、局部结构与图结构如何转化为可用表示。',
    },
    conceptIds: [
      'fourier-series',
      'fourier-transform',
      'haar-wavelet',
      'gabor-filter',
      'laplacian-operator',
      'graph-laplacian',
    ],
  },
  {
    id: 'noise-to-generative-models',
    title: {
      en: 'Noise to generative models',
      zh: '从噪声到生成模型',
    },
    description: {
      en: 'Follow stochastic dynamics into denoising identities and optimal transport.',
      zh: '从随机动力学走向去噪恒等式与最优传输。',
    },
    conceptIds: [
      'langevin-dynamics',
      'ito-lemma',
      'fokker-planck-equation',
      'tweedie-formula',
      'wasserstein-distance',
      'sinkhorn-algorithm',
    ],
  },
])
