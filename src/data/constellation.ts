export type ConstellationNode = {
  id: string
  labels: Readonly<{
    en: readonly string[]
    zh: readonly string[]
  }>
  x: number
  y: number
  r: number
  formula: string
}

export type ConstellationPosition = Pick<ConstellationNode, 'x' | 'y' | 'r'>

export const constellationViewBoxes = {
  desktop: { width: 720, height: 440 },
  mobile: { width: 360, height: 405 },
} as const

export const constellationNodes: readonly ConstellationNode[] = [
  {
    id: 'cartesian-coordinate-system',
    labels: { en: ['Cartesian', 'coordinates'], zh: ['笛卡尔', '坐标'] },
    x: 110,
    y: 128,
    r: 54,
    formula: 'p = (x,y,z)',
  },
  {
    id: 'cartesian-robot-frame',
    labels: { en: ['Robot', 'frame'], zh: ['机器人', '坐标系'] },
    x: 122,
    y: 286,
    r: 52,
    formula: 'pᵂ = T pᴿ',
  },
  {
    id: 'gauss-newton-method',
    labels: { en: ['Gauss–Newton', 'method'], zh: ['高斯–牛顿法'] },
    x: 292,
    y: 70,
    r: 62,
    formula: 'H ≈ JᵀJ',
  },
  {
    id: 'newton-method',
    labels: { en: ['Newton’s', 'method'], zh: ['牛顿法'] },
    x: 506,
    y: 70,
    r: 56,
    formula: 'Δθ = −H⁻¹g',
  },
  {
    id: 'jacobian-matrix',
    labels: { en: ['Jacobian'], zh: ['雅可比矩阵'] },
    x: 410,
    y: 226,
    r: 64,
    formula: 'J = ∂f/∂x',
  },
  {
    id: 'hessian-matrix',
    labels: { en: ['Hessian'], zh: ['海森矩阵'] },
    x: 616,
    y: 226,
    r: 54,
    formula: 'H = ∇²L',
  },
  {
    id: 'laplace-approximation',
    labels: { en: ['Laplace', 'approximation'], zh: ['拉普拉斯', '近似'] },
    x: 350,
    y: 374,
    r: 60,
    formula: 'Σ ≈ H⁻¹',
  },
  {
    id: 'gaussian-distribution',
    labels: { en: ['Gaussian', 'distribution'], zh: ['高斯分布'] },
    x: 648,
    y: 374,
    r: 56,
    formula: 'x ∼ 𝒩(μ,Σ)',
  },
]

export const mobileConstellationPositions: Readonly<
  Record<string, ConstellationPosition>
> = {
  'cartesian-coordinate-system': { x: 58, y: 66, r: 52 },
  'cartesian-robot-frame': { x: 58, y: 202, r: 52 },
  'gauss-newton-method': { x: 180, y: 66, r: 60 },
  'newton-method': { x: 302, y: 66, r: 52 },
  'jacobian-matrix': { x: 180, y: 202, r: 60 },
  'hessian-matrix': { x: 302, y: 202, r: 52 },
  'laplace-approximation': { x: 110, y: 342, r: 60 },
  'gaussian-distribution': { x: 250, y: 342, r: 54 },
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
