export type ConstellationNode = {
  id: string
  label: string
  zh: string
  x: number
  y: number
  r: number
  formula: string
}

export type ConstellationPosition = Pick<ConstellationNode, 'x' | 'y' | 'r'>

export const constellationNodes: readonly ConstellationNode[] = [
  {
    id: 'cartesian-coordinate-system',
    label: 'Cartesian\ncoordinates',
    zh: '笛卡尔坐标',
    x: 112,
    y: 124,
    r: 49,
    formula: '(x, y, z)',
  },
  {
    id: 'cartesian-robot-frame',
    label: 'Robot\nframe',
    zh: '机器人坐标系',
    x: 125,
    y: 281,
    r: 47,
    formula: 'T(x)',
  },
  {
    id: 'gauss-newton-method',
    label: 'Gauss–Newton\nmethod',
    zh: '高斯–牛顿法',
    x: 292,
    y: 56,
    r: 48,
    formula: '(JᵀJ)⁻¹',
  },
  {
    id: 'newton-method',
    label: 'Newton’s\nmethod',
    zh: '牛顿法',
    x: 502,
    y: 55,
    r: 49,
    formula: 'xₖ₊₁',
  },
  {
    id: 'jacobian-matrix',
    label: 'Jacobian',
    zh: '雅可比矩阵',
    x: 407,
    y: 226,
    r: 59,
    formula: 'J',
  },
  {
    id: 'hessian-matrix',
    label: 'Hessian',
    zh: '海森矩阵',
    x: 614,
    y: 231,
    r: 49,
    formula: 'H',
  },
  {
    id: 'laplace-approximation',
    label: 'Laplace\napproximation',
    zh: '拉普拉斯近似',
    x: 343,
    y: 377,
    r: 49,
    formula: '𝒩(θ̂,H⁻¹)',
  },
  {
    id: 'gaussian-distribution',
    label: 'Gaussian\ndistribution',
    zh: '高斯分布',
    x: 646,
    y: 380,
    r: 49,
    formula: '𝒩(μ,Σ)',
  },
]

export const mobileConstellationPositions: Readonly<
  Record<string, ConstellationPosition>
> = {
  'cartesian-coordinate-system': { x: 60, y: 60, r: 44 },
  'cartesian-robot-frame': { x: 60, y: 185, r: 44 },
  'gauss-newton-method': { x: 180, y: 60, r: 44 },
  'newton-method': { x: 300, y: 60, r: 44 },
  'jacobian-matrix': { x: 180, y: 185, r: 50 },
  'hessian-matrix': { x: 300, y: 185, r: 44 },
  'laplace-approximation': { x: 110, y: 320, r: 44 },
  'gaussian-distribution': { x: 250, y: 320, r: 44 },
}

export const constellationEdges = [
  { from: 'cartesian-coordinate-system', to: 'cartesian-robot-frame' },
  { from: 'cartesian-robot-frame', to: 'jacobian-matrix' },
  { from: 'gauss-newton-method', to: 'jacobian-matrix' },
  { from: 'gauss-newton-method', to: 'newton-method' },
  { from: 'newton-method', to: 'hessian-matrix' },
  { from: 'jacobian-matrix', to: 'hessian-matrix' },
  { from: 'hessian-matrix', to: 'laplace-approximation' },
  { from: 'laplace-approximation', to: 'gaussian-distribution' },
] as const

export const constellationConceptIds = constellationNodes.map((node) => node.id)
