export const foundationConceptIconIds = [
  'cartesian-coordinate-system',
  'cartesian-product',
  'cartesian-tree',
  'cartesian-robot-frame',
  'euclidean-distance',
  'gaussian-distribution',
  'gaussian-process',
  'gaussian-mixture-model',
  'gaussian-kernel',
  'gauss-newton-method',
  'bayes-theorem',
  'bayesian-inference',
  'bayesian-network',
  'markov-property',
  'markov-chain',
  'markov-decision-process',
  'hidden-markov-model',
  'fourier-transform',
  'fourier-series',
  'laplace-transform',
  'laplacian-operator',
  'graph-laplacian',
  'laplace-approximation',
  'taylor-series',
  'newton-method',
  'lagrange-multipliers',
  'lagrangian',
  'jacobian-matrix',
  'hessian-matrix',
  'riemannian-manifold',
  'hilbert-space',
  'reproducing-kernel-hilbert-space',
  'shannon-entropy',
  'jensen-shannon-divergence',
  'fisher-information',
  'fisher-linear-discriminant',
  'kullback-leibler-divergence',
  'kolmogorov-complexity',
  'kolmogorov-arnold-representation',
  'kolmogorov-arnold-network',
] as const

export function FoundationConceptGlyph({ conceptId }: { conceptId: string }) {
  switch (conceptId) {
    case 'cartesian-coordinate-system':
      return (
        <g>
          <path className="ci-secondary" d="M9 39V8m0 31h32M9 39l23-23" />
          <path className="ci-guide" d="M31 17v22M31 17L9 28" strokeDasharray="2.5 2.5" />
          <circle className="ci-primary-fill" cx="31" cy="17" r="3" />
          <path className="ci-primary" d="m7 11 2-3 2 3m27 26 3 2-3 2m-9-24 3-1-1 3" />
        </g>
      )
    case 'cartesian-product':
      return (
        <g>
          <g className="ci-primary-fill">
            <circle cx="7" cy="21" r="2" />
            <circle cx="7" cy="33" r="2" />
            <circle cx="26" cy="7" r="2" />
            <circle cx="38" cy="7" r="2" />
          </g>
          <rect className="ci-secondary" x="20" y="15" width="24" height="24" rx="2" />
          <path className="ci-guide" d="M32 15v24M20 27h24" />
          <g className="ci-accent-fill">
            <circle cx="26" cy="21" r="2" />
            <circle cx="38" cy="21" r="2" />
            <circle cx="26" cy="33" r="2" />
            <circle cx="38" cy="33" r="2" />
          </g>
        </g>
      )
    case 'cartesian-tree':
      return (
        <g>
          <path className="ci-secondary" d="M23 11 11 24m12-13 13 13" />
          <path className="ci-guide" d="M7 40h34M11 27v13m12-26v26m13-13v13" strokeDasharray="2.5 2.5" />
          <g className="ci-primary">
            <circle cx="23" cy="10" r="4" />
            <circle cx="11" cy="25" r="4" />
            <circle cx="36" cy="25" r="4" />
          </g>
          <g className="ci-primary-fill">
            <circle cx="11" cy="40" r="2" />
            <circle cx="23" cy="40" r="2" />
            <circle cx="36" cy="40" r="2" />
          </g>
        </g>
      )
    case 'cartesian-robot-frame':
      return (
        <g>
          <path className="ci-secondary" d="M6 40h11l5-8 5 3" />
          <circle className="ci-primary" cx="27" cy="35" r="3" />
          <path className="ci-primary" d="M27 35V14m0 21h16m-16 0 10-12" />
          <path className="ci-primary" d="m25 17 2-3 2 3m11 16 3 2-3 2m-5-13 2-1-1 3" />
          <circle className="ci-accent-fill" cx="40" cy="12" r="3" />
        </g>
      )
    case 'euclidean-distance':
      return (
        <g>
          <path className="ci-guide" d="M8 36 9 12h31v23" strokeDasharray="3 3" />
          <path className="ci-primary" d="M8 36 40 12" />
          <g className="ci-primary-fill">
            <circle cx="8" cy="36" r="3" />
            <circle cx="40" cy="12" r="3" />
          </g>
          <path className="ci-accent" d="m34 13 6-1-2 6" />
        </g>
      )
    case 'gaussian-distribution':
      return (
        <g>
          <path className="ci-primary" d="M5 39c8 0 9-2 12-12 2-8 4-14 7-14s5 6 7 14c3 10 4 12 12 12" />
          <path className="ci-guide" d="M24 9v30" strokeDasharray="2.5 2.5" />
          <g className="ci-primary-fill">
            <circle cx="15" cy="36" r="1.7" />
            <circle cx="20" cy="30" r="1.7" />
            <circle cx="24" cy="22" r="1.7" />
            <circle cx="28" cy="30" r="1.7" />
            <circle cx="34" cy="36" r="1.7" />
          </g>
        </g>
      )
    case 'gaussian-process':
      return (
        <g>
          <path className="ci-guide" d="M5 12c9 13 15 18 22 13 7-5 9-11 16-9M5 34c8-17 15-13 22-3 6 8 10 5 16-4" strokeDasharray="3 2" />
          <path className="ci-primary" d="M5 25c8-8 14-11 21-2 6 8 11 2 17-7" />
          <g className="ci-accent-fill">
            <circle cx="11" cy="20" r="2.4" />
            <circle cx="25" cy="22" r="2.4" />
            <circle cx="38" cy="20" r="2.4" />
          </g>
        </g>
      )
    case 'gaussian-mixture-model':
      return (
        <g>
          <path className="ci-guide" d="M4 39c5 0 6-2 8-11 2-7 3-10 6-10s5 5 7 13c2 6 4 8 7 8M16 39c5 0 7-2 9-9 2-9 4-14 7-14s5 6 7 15c1 6 2 8 5 8" strokeDasharray="3 2" />
          <path className="ci-primary" d="M4 39c5 0 7-1 10-8 2-6 4-10 7-10 4 0 5 7 8 7 2 0 3-9 6-9 4 0 5 12 9 20" />
          <g className="ci-primary-fill">
            <circle cx="13" cy="36" r="1.7" />
            <circle cx="18" cy="32" r="1.7" />
            <circle cx="31" cy="31" r="1.7" />
            <circle cx="36" cy="35" r="1.7" />
          </g>
        </g>
      )
    case 'gaussian-kernel':
      return (
        <g>
          <circle className="ci-primary" cx="16" cy="27" r="5" />
          <circle className="ci-guide" cx="16" cy="27" r="12" strokeDasharray="3 2.5" />
          <circle className="ci-primary-fill" cx="16" cy="27" r="2.5" />
          <circle className="ci-accent-fill" cx="27" cy="22" r="2.5" />
          <circle className="ci-secondary" cx="41" cy="10" r="2.5" />
        </g>
      )
    case 'gauss-newton-method':
      return (
        <g>
          <path className="ci-primary" d="M5 35c9-12 18-15 38-7" />
          <g className="ci-guide">
            <path d="M10 17v12m10-5v4m10-10v8m9 5v-1" />
          </g>
          <g className="ci-primary-fill">
            <circle cx="10" cy="17" r="2" />
            <circle cx="20" cy="24" r="2" />
            <circle cx="30" cy="18" r="2" />
            <circle cx="39" cy="31" r="2" />
          </g>
          <path className="ci-accent" d="M8 41c3-1 6-2 10-5m-4-1 4 1-2 4" />
        </g>
      )
    case 'bayes-theorem':
      return (
        <g>
          <g className="ci-secondary">
            <circle cx="7" cy="17" r="2" />
            <circle cx="7" cy="24" r="2" />
            <circle cx="7" cy="31" r="2" />
          </g>
          <path className="ci-guide" d="M10 24h8m12 0h8" />
          <ellipse className="ci-primary" cx="24" cy="24" rx="6" ry="12" />
          <g className="ci-accent-fill">
            <circle cx="40" cy="15" r="3.5" />
            <circle cx="40" cy="25" r="2.4" />
            <circle cx="40" cy="33" r="1.6" />
          </g>
        </g>
      )
    case 'bayesian-inference':
      return (
        <g>
          <path className="ci-secondary" d="M4 36c2 0 3-2 4-7 1-4 2-7 4-7s3 3 4 7c1 5 2 7 4 7" />
          <path className="ci-primary" d="M17 36c2 0 3-2 4-8 1-6 2-11 4-11s3 5 4 11c1 6 2 8 4 8" />
          <path className="ci-accent" d="M30 36c3 0 4-2 5-10 1-9 2-15 4-15s3 6 4 15c0 8 0 10 1 10" />
          <path className="ci-guide" d="m17 13 4 2-4 2m13-7 4 2-4 2" />
          <g className="ci-primary-fill">
            <circle cx="19" cy="15" r="1.7" />
            <circle cx="32" cy="12" r="1.7" />
          </g>
        </g>
      )
    case 'bayesian-network':
      return (
        <g>
          <path className="ci-secondary" d="m12 13 9 8m15-8-9 8m-3 7v7" />
          <path className="ci-secondary" d="m18 19 3 2-1-4m10 2-3 2 1-4m-6 15 2 3 2-3" />
          <g className="ci-primary">
            <circle cx="9" cy="10" r="4" />
            <circle cx="39" cy="10" r="4" />
            <circle cx="24" cy="24" r="4" />
            <circle cx="24" cy="39" r="4" />
          </g>
          <circle className="ci-accent-fill" cx="24" cy="24" r="2" />
        </g>
      )
    case 'markov-property':
      return (
        <g>
          <path className="ci-guide" d="M8 24h20" strokeDasharray="3 3" />
          <path className="ci-primary" d="M30 24h7m-4-3 4 3-4 3" />
          <g className="ci-secondary">
            <circle cx="7" cy="24" r="3" />
            <circle cx="17" cy="24" r="3" />
            <circle cx="27" cy="24" r="3" />
            <circle cx="40" cy="24" r="3" />
          </g>
          <circle className="ci-primary-fill" cx="27" cy="24" r="3" />
        </g>
      )
    case 'markov-chain':
      return (
        <g>
          <path className="ci-secondary" d="M12 29 21 14m6 0 9 15M34 34H14" />
          <path className="ci-secondary" d="m18 17 3-3v4m12 7 3 4-4-1m-14 4-4 2 4 2" />
          <g className="ci-primary">
            <circle cx="10" cy="33" r="4" />
            <circle cx="24" cy="10" r="4" />
            <circle cx="38" cy="33" r="4" />
          </g>
          <path className="ci-accent" d="M40 29c4-5 2-10-3-10m1-3-1 3h3" />
        </g>
      )
    case 'markov-decision-process':
      return (
        <g>
          <circle className="ci-primary" cx="8" cy="24" r="4" />
          <path className="ci-secondary" d="m18 24 5-5 5 5-5 5Z" />
          <path className="ci-secondary" d="M12 24h6m10-2 8-8m-8 12 8 8m-3-20h3v3m-3 17h3v-3" />
          <g className="ci-primary">
            <circle cx="39" cy="12" r="4" />
            <circle cx="39" cy="36" r="4" />
          </g>
          <path className="ci-accent" d="m39 5 1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5L34 8.5l3.5-.5Z" />
        </g>
      )
    case 'hidden-markov-model':
      return (
        <g>
          <path className="ci-secondary" d="M12 13h8m8 0h8m-3-2 3 2-3 2m-16-4 3 2-3 2" />
          <g className="ci-primary">
            <circle cx="8" cy="13" r="4" />
            <circle cx="24" cy="13" r="4" />
            <circle cx="40" cy="13" r="4" />
          </g>
          <path className="ci-guide" d="M8 17v14m16-14v14m16-14v14" strokeDasharray="2.5 2.5" />
          <g className="ci-accent-fill">
            <circle cx="8" cy="36" r="3" />
            <circle cx="24" cy="36" r="3" />
            <circle cx="40" cy="36" r="3" />
          </g>
        </g>
      )
    case 'fourier-transform':
      return (
        <g>
          <path className="ci-primary" d="M4 24c2-9 4-9 6 0s4 9 6 0" />
          <path className="ci-secondary" d="m20 13 9 11-9 11Z" />
          <path className="ci-guide" d="M16 24h4m9 0h3" />
          <path className="ci-accent" d="M32 12c2-5 4-5 6 0s4 5 6 0M32 24c1-4 2-4 3 0s2 4 3 0 2-4 3 0 2 4 3 0M32 36c1-3 2-3 3 0s2 3 3 0 2-3 3 0 2 3 3 0" />
        </g>
      )
    case 'fourier-series':
      return (
        <g>
          <path className="ci-secondary" d="M4 8c2-4 4-4 6 0s4 4 6 0M4 17c1-3 2-3 3 0s2 3 3 0 2-3 3 0 2 3 3 0M4 26c1-2 2-2 3 0s2 2 3 0 2-2 3 0 2 2 3 0" />
          <path className="ci-guide" d="M17 8h5m-5 9h5m-5 9h5m0-18v18l5 10" />
          <circle className="ci-primary-fill" cx="27" cy="36" r="2.5" />
          <path className="ci-primary" d="M30 36c2-8 4-8 6 0s4 8 6 0" />
        </g>
      )
    case 'laplace-transform':
      return (
        <g>
          <path className="ci-primary" d="M4 24c2-10 4-10 6 0 2 8 4 8 6 0 2-5 3-5 5 0" />
          <path className="ci-guide" d="M22 24h6m-3-3 3 3-3 3" />
          <path className="ci-secondary" d="M31 40V8m-3 16h16" />
          <g className="ci-accent-fill">
            <circle cx="37" cy="17" r="2.5" />
            <circle cx="37" cy="31" r="2.5" />
          </g>
        </g>
      )
    case 'laplacian-operator':
      return (
        <g>
          <path className="ci-primary" d="M4 35c8 0 12-4 15-15 2-7 4-10 6-10 3 0 5 5 7 13 2 8 6 12 12 12" />
          <g className="ci-secondary">
            <circle cx="8" cy="34" r="2" />
            <circle cx="16" cy="27" r="2" />
            <circle cx="25" cy="10" r="2" />
            <circle cx="34" cy="28" r="2" />
            <circle cx="42" cy="35" r="2" />
          </g>
          <path className="ci-guide" d="m15 15 7-3m13 3-7-3m-3 7v-6" />
          <circle className="ci-accent-fill" cx="25" cy="10" r="3" />
        </g>
      )
    case 'graph-laplacian':
      return (
        <g>
          <path className="ci-secondary" d="M8 33 18 18l11 7 11-14M29 25l11 13M18 18 40 11" />
          <path className="ci-primary" d="M8 29c9-8 15-8 21-4 5 3 7-5 11-10" />
          <g className="ci-primary-fill">
            <circle cx="8" cy="33" r="2.5" />
            <circle cx="18" cy="18" r="2.5" />
            <circle cx="29" cy="25" r="2.5" />
            <circle cx="40" cy="11" r="2.5" />
          </g>
          <path className="ci-accent" d="M29 25 40 38" strokeDasharray="3 2" />
          <circle className="ci-accent" cx="40" cy="38" r="3" />
        </g>
      )
    case 'laplace-approximation':
      return (
        <g>
          <path className="ci-secondary" d="M4 39c7 0 11-2 15-14 3-9 5-13 8-11 3 1 3 8 6 13 3 7 6 10 11 12" />
          <path className="ci-primary" d="M8 39c7 0 9-3 12-13 2-8 4-13 7-13s5 5 7 13c3 10 5 13 10 13" />
          <path className="ci-guide" d="M27 10v29" strokeDasharray="2.5 2.5" />
          <circle className="ci-accent-fill" cx="27" cy="13" r="2.5" />
        </g>
      )
    case 'taylor-series':
      return (
        <g>
          <path className="ci-secondary" d="M4 38c9 1 14-3 18-15 4-13 9-14 12-3 3 10 5 13 10 10" />
          <path className="ci-primary" d="M15 34c4-3 7-8 9-13 3-6 7-6 11 1" />
          <circle className="ci-guide" cx="27" cy="24" r="13" strokeDasharray="3 2.5" />
          <circle className="ci-accent-fill" cx="27" cy="18" r="2.5" />
        </g>
      )
    case 'newton-method':
      return (
        <g>
          <path className="ci-secondary" d="M4 40h40" />
          <path className="ci-primary" d="M6 8c7 0 13 6 18 16 4 8 9 12 18 12" />
          <path className="ci-accent" d="M12 8 35 40" />
          <path className="ci-guide" d="M12 8v32m0-4h23m-4-3 4 3-4 3" strokeDasharray="3 2" />
          <circle className="ci-primary-fill" cx="12" cy="8" r="2.5" />
        </g>
      )
    case 'lagrange-multipliers':
      return (
        <g>
          <g className="ci-secondary">
            <ellipse cx="22" cy="24" rx="17" ry="11" />
            <ellipse cx="22" cy="24" rx="10" ry="6" />
          </g>
          <path className="ci-primary" d="M7 43c8-15 17-25 36-34" />
          <circle className="ci-accent-fill" cx="30" cy="18" r="2.7" />
          <path className="ci-accent" d="m30 18 8-5m-5 0 5 0-2 4m-6 1 6-4" />
        </g>
      )
    case 'lagrangian':
      return (
        <g>
          <path className="ci-secondary" d="M5 37c8-18 15-25 22-25s11 8 16 25" />
          <path className="ci-primary" d="M5 30c9-2 19-3 38 0" />
          <path className="ci-accent" d="M24 8v16m-3-4 3 4 3-4M36 39 28 32m3 0-3 0v3" />
          <circle className="ci-primary-fill" cx="24" cy="30" r="3" />
        </g>
      )
    case 'jacobian-matrix':
      return (
        <g>
          <rect className="ci-secondary" x="5" y="12" width="14" height="24" rx="1" />
          <path className="ci-guide" d="M12 12v24M5 20h14M5 28h14" />
          <path className="ci-primary" d="m29 10 14 5-4 25-12-8Zm5 2-3 22m10-11-13-3m12 11-12-3" />
          <path className="ci-accent" d="M20 24h7m-3-3 3 3-3 3" />
        </g>
      )
    case 'hessian-matrix':
      return (
        <g>
          <g className="ci-primary">
            <ellipse cx="24" cy="24" rx="18" ry="12" />
            <ellipse cx="24" cy="24" rx="11" ry="7" />
            <ellipse cx="24" cy="24" rx="5" ry="3" />
          </g>
          <path className="ci-accent" d="M24 7v34M7 24h34m-20-13 3-4 3 4m-3 30-3-4m3 4 3-4M11 21l-4 3 4 3m30-3-4-3m4 3-4 3" />
          <circle className="ci-primary-fill" cx="24" cy="24" r="2.5" />
        </g>
      )
    case 'riemannian-manifold':
      return (
        <g>
          <path className="ci-secondary" d="M4 29c8-8 15-8 22-2 6 5 11 5 18-2M4 38c8-8 15-8 22-2 6 5 11 5 18-2" />
          <path className="ci-primary" d="M8 30c10-14 22-14 32-3" />
          <path className="ci-guide" d="m17 18 16-5 8 7-17 5Z" strokeDasharray="3 2" />
          <circle className="ci-accent-fill" cx="25" cy="22" r="2.5" />
        </g>
      )
    case 'hilbert-space':
      return (
        <g>
          <path className="ci-guide" d="M5 41C8 14 20 5 43 5M5 41c16-10 27-11 38-6" strokeDasharray="3 2.5" />
          <path className="ci-secondary" d="M9 38V13m0 25h26" />
          <path className="ci-primary" d="M9 38 29 14m-3 2 3-2-1 4" />
          <path className="ci-guide" d="M29 14v24" strokeDasharray="2.5 2.5" />
          <circle className="ci-accent-fill" cx="29" cy="14" r="2.5" />
        </g>
      )
    case 'reproducing-kernel-hilbert-space':
      return (
        <g>
          <path className="ci-secondary" d="M5 40V8m0 32h39" />
          <path className="ci-primary" d="M6 31c9-7 14-6 20-11 6-5 10-7 17-4" />
          <path className="ci-guide" d="M16 40c4 0 5-3 7-12 1-6 2-10 4-10s3 4 4 10c2 9 3 12 7 12M27 18v22" strokeDasharray="3 2" />
          <circle className="ci-accent-fill" cx="27" cy="19" r="2.7" />
        </g>
      )
    case 'shannon-entropy':
      return (
        <g>
          <g className="ci-primary-fill">
            <circle cx="9" cy="19" r="2" />
            <circle cx="14" cy="19" r="2" />
            <circle cx="9" cy="24" r="2" />
            <circle cx="14" cy="24" r="2" />
            <circle cx="9" cy="29" r="2" />
            <circle cx="14" cy="29" r="2" />
          </g>
          <path className="ci-guide" d="M18 24h8m-3-3 3 3-3 3" />
          <g className="ci-accent-fill">
            <circle cx="31" cy="12" r="2" />
            <circle cx="41" cy="18" r="2" />
            <circle cx="32" cy="27" r="2" />
            <circle cx="40" cy="36" r="2" />
            <circle cx="27" cy="39" r="2" />
          </g>
          <path className="ci-secondary" d="M27 10a17 17 0 0 1 16 32" />
          <path className="ci-primary" d="M35 37 40 26" />
        </g>
      )
    case 'jensen-shannon-divergence':
      return (
        <g>
          <path className="ci-secondary" d="M4 38c5 0 6-2 8-10 2-9 4-13 6-13s4 4 6 13c2 8 3 10 6 10M18 38c3 0 4-2 6-10 2-9 4-13 6-13s4 4 6 13c2 8 3 10 8 10" />
          <path className="ci-guide" d="M10 38c5 0 7-3 9-10 2-6 3-10 5-10s3 4 5 10c2 7 4 10 9 10" strokeDasharray="3 2" />
          <path className="ci-primary" d="M18 10h12m-9-3-3 3 3 3m6-6 3 3-3 3" />
          <circle className="ci-accent-fill" cx="24" cy="18" r="2.4" />
        </g>
      )
    case 'fisher-information':
      return (
        <g>
          <path className="ci-guide" d="M5 38c5 0 7-2 10-9 3-8 5-11 8-11s5 3 8 11c3 7 5 9 12 9" strokeDasharray="3 2" />
          <path className="ci-primary" d="M14 38c4 0 5-2 7-10 1-10 2-16 5-16s4 6 5 16c2 8 3 10 7 10" />
          <ellipse className="ci-secondary" cx="26" cy="21" rx="10" ry="15" />
          <path className="ci-accent" d="M35 10a9 9 0 0 1 8 9m-8-2 8 2m-4-6 4 6" />
        </g>
      )
    case 'fisher-linear-discriminant':
      return (
        <g>
          <g className="ci-primary-fill">
            <circle cx="11" cy="15" r="2" />
            <circle cx="15" cy="20" r="2" />
            <circle cx="9" cy="23" r="2" />
          </g>
          <g className="ci-accent-fill">
            <circle cx="34" cy="25" r="2" />
            <circle cx="39" cy="28" r="2" />
            <circle cx="36" cy="33" r="2" />
          </g>
          <path className="ci-secondary" d="M5 39 43 9" />
          <path className="ci-guide" d="M12 19 19 28m24-1-10-12" strokeDasharray="2.5 2.5" />
          <path className="ci-primary" d="M16 30h8m7-15h8" />
        </g>
      )
    case 'kullback-leibler-divergence':
      return (
        <g>
          <path className="ci-primary" d="M4 38c5 0 7-2 10-10 3-9 5-13 8-13s5 4 8 13c3 8 5 10 14 10" />
          <path className="ci-secondary" d="M4 38c10 0 13-2 16-8 4-8 7-11 10-11s5 4 7 10c2 6 3 9 7 9" />
          <g className="ci-guide">
            <path d="M17 24v8m4-14v13m4-12v12m4-11v12" />
          </g>
          <path className="ci-accent" d="M14 9h21m-4-3 4 3-4 3" />
        </g>
      )
    case 'kolmogorov-complexity':
      return (
        <g>
          <rect className="ci-secondary" x="4" y="12" width="15" height="24" rx="2" />
          <g className="ci-primary-fill">
            <rect x="7" y="16" width="4" height="4" rx="1" />
            <rect x="12" y="22" width="4" height="4" rx="1" />
            <rect x="7" y="28" width="4" height="4" rx="1" />
          </g>
          <path className="ci-primary" d="m20 15 12 6v6l-12 6Z" />
          <rect className="ci-accent" x="34" y="20" width="10" height="8" rx="2" />
          <path className="ci-accent" d="M37 24h4" />
        </g>
      )
    case 'kolmogorov-arnold-representation':
      return (
        <g>
          <path className="ci-secondary" d="M4 9c2-3 4-3 6 0s4 3 6 0M4 20c2-3 4-3 6 0s4 3 6 0M4 31c2-3 4-3 6 0s4 3 6 0" />
          <path className="ci-guide" d="m17 9 8 10m-8 1h8m-8 11 8-10" />
          <circle className="ci-primary-fill" cx="27" cy="20" r="3" />
          <path className="ci-primary" d="m31 19 11-6v21l-11 6Zm0 0 11 6m-11 6 11-6" />
        </g>
      )
    case 'kolmogorov-arnold-network':
      return (
        <g>
          <g className="ci-primary">
            <circle cx="7" cy="10" r="3" />
            <circle cx="7" cy="24" r="3" />
            <circle cx="7" cy="38" r="3" />
            <circle cx="41" cy="16" r="3" />
            <circle cx="41" cy="32" r="3" />
          </g>
          <path className="ci-secondary" d="M10 10c8-5 18 11 28 6M10 10c10 4 18 17 28 22M10 24c8-8 18-8 28-8M10 24c8 8 18 8 28 8M10 38c10-15 18-26 28-22M10 38c8 5 18-11 28-6" />
          <g className="ci-accent-fill">
            <circle cx="23" cy="16" r="1.7" />
            <circle cx="25" cy="32" r="1.7" />
          </g>
        </g>
      )
    default:
      return null
  }
}
