export const modernConceptIconIds = [
  'bfgs-algorithm',
  'levenberg-marquardt-algorithm',
  'moreau-envelope',
  'fenchel-conjugate',
  'cauchy-schwarz-inequality',
  'moore-penrose-pseudoinverse',
  'perron-frobenius-theorem',
  'householder-transformation',
  'lanczos-algorithm',
  'krylov-subspace',
  'arnoldi-iteration',
  'nystrom-method',
  'robbins-monro-stochastic-approximation',
  'haar-wavelet',
  'gabor-filter',
  'hough-transform',
  'wiener-filter',
  'erdos-renyi-model',
  'viterbi-algorithm',
  'baum-welch-algorithm',
  'langevin-dynamics',
  'ito-lemma',
  'fokker-planck-equation',
  'schrodinger-bridge',
  'doob-h-transform',
  'tweedie-formula',
  'wasserstein-distance',
  'sinkhorn-algorithm',
  'gromov-wasserstein-distance',
  'frechet-inception-distance',
  'bradley-terry-model',
  'plackett-luce-model',
  'elo-rating-system',
  'shapley-value',
  'hopfield-network',
  'koopman-operator',
  'lie-group',
  'weisfeiler-leman-test',
  'stiefel-manifold',
  'canny-edge-detector',
] as const

export function ModernConceptGlyph({ conceptId }: { conceptId: string }) {
  switch (conceptId) {
    case 'bfgs-algorithm':
      return (
        <g>
          <ellipse className="ci-guide" cx="25" cy="25" rx="15" ry="7" transform="rotate(-18 25 25)" />
          <ellipse className="ci-secondary" cx="25" cy="25" rx="10" ry="5" transform="rotate(16 25 25)" />
          <path className="ci-primary" d="M9 37 23 27 37 18m0 0-5 1m5-1-2 5" />
          <path className="ci-accent" d="M13 13 22 22m0 0-1-5m1 5-5-1" />
          <circle className="ci-accent-fill" cx="23" cy="27" r="2" />
        </g>
      )

    case 'levenberg-marquardt-algorithm':
      return (
        <g>
          <path className="ci-guide" d="M5 10c8 4 7 14 19 14s11-10 19-14M7 18c7 4 7 13 17 13s10-9 17-13" />
          <path className="ci-guide" strokeDasharray="3 3" d="M9 39 39 13m0 0-6 1m6-1-2 6" />
          <path className="ci-primary" d="M9 39 25 27m0 0-6 1m6-1-2 6" />
          <path className="ci-accent" d="m27 25 2-3 2 2 2-3 2 2" />
          <circle className="ci-accent-fill" cx="25" cy="27" r="2" />
        </g>
      )

    case 'moreau-envelope':
      return (
        <g>
          <path className="ci-guide" d="M6 37 24 10l18 27" />
          <path className="ci-primary" d="M6 39c8 0 10-2 13-10 2-5 3-9 5-9s3 4 5 9c3 8 5 10 13 10" />
          <path className="ci-secondary" strokeDasharray="2 2" d="M24 10v10" />
          <circle className="ci-accent-fill" cx="24" cy="20" r="2" />
        </g>
      )

    case 'fenchel-conjugate':
      return (
        <g>
          <path className="ci-primary" d="M5 39c8-1 11-4 15-13 4-10 8-15 19-17" />
          <path className="ci-secondary" d="M8 37 37 13" />
          <circle className="ci-accent-fill" cx="27" cy="21" r="2" />
          <path className="ci-guide" d="M31 31c4 0 8 2 10 6m0 0-1-5m1 5-5-1" />
          <circle className="ci-primary-fill" cx="41" cy="37" r="2" />
        </g>
      )

    case 'cauchy-schwarz-inequality':
      return (
        <g>
          <path className="ci-primary" d="M8 40 39 9m0 0-6 2m6-2-2 6" />
          <path className="ci-secondary" d="M8 40 38 29m0 0-6-1m6 1-4 4" />
          <path className="ci-guide" strokeDasharray="3 2" d="M38 29 29 20" />
          <path className="ci-accent" d="M15 37c0-4-2-7-4-9" />
          <circle className="ci-accent-fill" cx="29" cy="20" r="2" />
        </g>
      )

    case 'moore-penrose-pseudoinverse':
      return (
        <g>
          <ellipse className="ci-guide" cx="13" cy="24" rx="7" ry="16" />
          <path className="ci-secondary" d="M7 32 19 16M29 12v24" />
          <path className="ci-primary" d="M20 20h8m0 0-4-3m4 3-4 3" />
          <path className="ci-primary" d="M28 29h-8m0 0 4-3m-4 3 4 3" />
          <circle className="ci-accent-fill" cx="29" cy="24" r="2.5" />
        </g>
      )

    case 'perron-frobenius-theorem':
      return (
        <g>
          <path className="ci-guide" d="m8 31 9-18 10 19 8-16M8 31l19 1M17 13l18 3" />
          <g className="ci-paper-fill">
            <circle className="ci-secondary" cx="8" cy="31" r="3" />
            <circle className="ci-secondary" cx="17" cy="13" r="3" />
            <circle className="ci-secondary" cx="27" cy="32" r="3" />
            <circle className="ci-secondary" cx="35" cy="16" r="3" />
          </g>
          <path className="ci-primary" d="M21 27 42 7m0 0-6 2m6-2-2 6" />
          <circle className="ci-accent-fill" cx="21" cy="27" r="2" />
        </g>
      )

    case 'householder-transformation':
      return (
        <g>
          <path className="ci-guide" strokeDasharray="3 2" d="M24 5v38" />
          <path className="ci-primary" d="M24 39 10 12m0 0 1 6m-1-6 5 3" />
          <path className="ci-accent" d="M24 39 38 12m0 0-5 3m5-3-1 6" />
          <path className="ci-secondary" d="M12 10c8-6 16-6 24 0" />
          <path className="ci-guide" d="M7 39h34" />
        </g>
      )

    case 'lanczos-algorithm':
      return (
        <g>
          <g className="ci-secondary">
            <circle cx="7" cy="13" r="1.5" /><circle cx="13" cy="19" r="1.5" />
            <circle cx="7" cy="31" r="1.5" /><circle cx="13" cy="37" r="1.5" />
          </g>
          <path className="ci-primary" d="M16 24h6m0 0-4-3m4 3-4 3" />
          <path className="ci-secondary" d="M25 14v20m0-20 7 10-7 10" />
          <g className="ci-paper-fill">
            <circle className="ci-primary" cx="25" cy="14" r="2.5" />
            <circle className="ci-primary" cx="32" cy="24" r="2.5" />
            <circle className="ci-primary" cx="25" cy="34" r="2.5" />
          </g>
          <path className="ci-accent" d="M37 13h5v5m-5 2h5v5m-5 2h5v5" />
        </g>
      )

    case 'krylov-subspace':
      return (
        <g>
          <circle className="ci-accent-fill" cx="8" cy="39" r="2.5" />
          <path className="ci-primary" d="M8 39 17 17m0 0-4 4m4-4v6" />
          <path className="ci-secondary" d="M8 39 28 11m0 0-5 3m5-3-1 6" />
          <path className="ci-primary" d="M8 39 40 22m0 0-6-1m6 1-4 4" />
          <path className="ci-guide" d="M18 17c5-5 8-6 10-6m1 2c5 1 8 4 11 9" />
        </g>
      )

    case 'arnoldi-iteration':
      return (
        <g>
          <path className="ci-guide" d="M6 38c7-12 10-18 12-30m0 0-3 5m3-5 2 5" />
          <path className="ci-primary" d="M10 39h14V25h13V12" />
          <path className="ci-secondary" d="M10 39h8m6 0v-8m0-6h7m6 0v-7" />
          <path className="ci-accent" d="M29 12h10v10" />
          <circle className="ci-accent-fill" cx="37" cy="12" r="2" />
        </g>
      )

    case 'nystrom-method':
      return (
        <g>
          <rect className="ci-guide" x="6" y="6" width="36" height="36" />
          <path className="ci-guide" d="M6 15h36M6 24h36M6 33h36M15 6v36M24 6v36M33 6v36" />
          <path className="ci-primary" d="M6 15h36M15 6v36" />
          <rect className="ci-accent-fill" x="11" y="11" width="8" height="8" rx="1" />
          <path className="ci-secondary" strokeDasharray="2 2" d="M20 20 38 38m-18-18 18-10" />
        </g>
      )

    case 'robbins-monro-stochastic-approximation':
      return (
        <g>
          <path className="ci-guide" d="M5 25h38M7 7v36" />
          <g className="ci-guide">
            <circle cx="10" cy="15" r="1" /><circle cx="15" cy="34" r="1" />
            <circle cx="22" cy="19" r="1" /><circle cx="28" cy="29" r="1" />
            <circle cx="35" cy="23" r="1" /><circle cx="40" cy="27" r="1" />
          </g>
          <path className="ci-primary" d="M8 10 14 37 22 18 28 30 34 22 39 26 42 24" />
          <circle className="ci-accent-fill" cx="42" cy="24" r="2" />
        </g>
      )

    case 'haar-wavelet':
      return (
        <g>
          <path className="ci-primary" d="M5 15h8v10h8V13h8v15h8V17h6" />
          <path className="ci-secondary" d="M24 31v5m0 0-3-4m3 4 3-4" />
          <path className="ci-guide" d="M7 41h16v-3h18" />
          <path className="ci-accent" d="M7 34h8v7h8v-7h8v7h10" />
        </g>
      )

    case 'gabor-filter':
      return (
        <g>
          <path className="ci-guide" d="M5 24c5-1 6-10 19-10s14 9 19 10c-5 1-6 10-19 10S10 25 5 24Z" />
          <path className="ci-primary" d="M7 24c3-11 6 11 9 0s6 11 9 0 6 11 9 0 6 10 8 0" />
          <path className="ci-secondary" d="M12 14c7-5 17-5 24 0M12 34c7 5 17 5 24 0" />
          <circle className="ci-accent-fill" cx="24" cy="24" r="2" />
        </g>
      )

    case 'hough-transform':
      return (
        <g>
          <path className="ci-guide" d="M23 6v36M6 38 19 12" />
          <g className="ci-primary-fill">
            <circle cx="8" cy="34" r="2" /><circle cx="12" cy="26" r="2" /><circle cx="16" cy="18" r="2" />
          </g>
          <path className="ci-secondary" d="M27 37c3-19 7-24 13-26M27 30c5-11 8-16 13-19M27 21c5-5 8-8 13-10" />
          <circle className="ci-accent-fill" cx="40" cy="11" r="2.5" />
        </g>
      )

    case 'wiener-filter':
      return (
        <g>
          <path className="ci-guide" d="M5 39h16M5 39V9M27 39h16M27 39V9" />
          <path className="ci-secondary" d="M8 39V25h3v-9h3v16h3V12h3v27" />
          <path className="ci-primary" d="M21 24h6m0 0-4-3m4 3-4 3" />
          <path className="ci-primary" d="M30 39V28h3V18h3v14h3V25h3v14" />
          <path className="ci-accent" d="M29 14c4 5 9 5 13 0" />
        </g>
      )

    case 'erdos-renyi-model':
      return (
        <g>
          <path className="ci-guide" strokeDasharray="2 2" d="M9 14 23 7l15 9 1 17-15 8-15-9V14m0 0 30 19M23 7l1 34M38 16 9 32M9 14l15 27M23 7l16 26" />
          <path className="ci-primary" d="M9 14 23 7l15 9M9 32l15 9 15-8M9 14l30 19" />
          <g className="ci-paper-fill">
            <circle className="ci-primary" cx="9" cy="14" r="2.5" /><circle className="ci-primary" cx="23" cy="7" r="2.5" />
            <circle className="ci-primary" cx="38" cy="16" r="2.5" /><circle className="ci-primary" cx="39" cy="33" r="2.5" />
            <circle className="ci-primary" cx="24" cy="41" r="2.5" /><circle className="ci-primary" cx="9" cy="32" r="2.5" />
          </g>
          <circle className="ci-accent-fill" cx="24" cy="24" r="2" />
        </g>
      )

    case 'viterbi-algorithm':
      return (
        <g>
          <path className="ci-guide" d="M7 10h34M7 24h34M7 38h34M8 10l11 14 11-14 11 14M8 24l11 14 11-14 11 14" />
          <g className="ci-paper-fill">
            {[8, 19, 30, 41].flatMap((x) => [10, 24, 38].map((y) => <circle className="ci-guide" key={`${x}-${y}`} cx={x} cy={y} r="2" />))}
          </g>
          <path className="ci-accent" d="M8 24 19 10l11 14 11-14" />
          <g className="ci-accent-fill">
            <circle cx="8" cy="24" r="2.5" /><circle cx="19" cy="10" r="2.5" /><circle cx="30" cy="24" r="2.5" /><circle cx="41" cy="10" r="2.5" />
          </g>
        </g>
      )

    case 'baum-welch-algorithm':
      return (
        <g>
          <path className="ci-primary" d="M8 16h30m0 0-4-3m4 3-4 3" />
          <path className="ci-secondary" d="M38 10H8m0 0 4-3m-4 3 4 3" />
          <g className="ci-paper-fill">
            <circle className="ci-primary" cx="9" cy="16" r="4" /><circle className="ci-primary" cx="24" cy="16" r="4" /><circle className="ci-primary" cx="39" cy="16" r="4" />
          </g>
          <path className="ci-guide" d="M9 20v12m15-12v12m15-12v12" />
          <g className="ci-accent-fill"><circle cx="9" cy="35" r="2" /><circle cx="24" cy="35" r="2" /><circle cx="39" cy="35" r="2" /></g>
        </g>
      )

    case 'langevin-dynamics':
      return (
        <g>
          <ellipse className="ci-guide" cx="28" cy="27" rx="15" ry="11" />
          <ellipse className="ci-guide" cx="28" cy="27" rx="8" ry="5" />
          <path className="ci-primary" d="M7 8c7 4 1 8 8 10s2 8 9 9 3 7 8 8" />
          <path className="ci-accent" d="m12 13-4 3m10 4 3-4m5 14-4 3" />
          <circle className="ci-accent-fill" cx="32" cy="35" r="2.5" />
        </g>
      )

    case 'ito-lemma':
      return (
        <g>
          <path className="ci-guide" d="M5 38c10 0 12-4 17-15S31 8 43 8" />
          <path className="ci-primary" d="M7 36 11 29l4 3 4-10 5 5 4-12 5 4 5-9" />
          <path className="ci-accent" d="M24 27c4 2 7 1 9-3" />
          <path className="ci-secondary" strokeDasharray="2 2" d="M19 22h9M24 18v9" />
          <circle className="ci-accent-fill" cx="24" cy="27" r="2" />
        </g>
      )

    case 'fokker-planck-equation':
      return (
        <g>
          <path className="ci-guide" d="M5 39h38" />
          <path className="ci-secondary" d="M6 39c5 0 6-21 12-21s7 21 12 21" />
          <path className="ci-primary" d="M19 39c4 0 7-13 14-13s8 13 10 13" />
          <path className="ci-primary" d="M19 12h16m0 0-5-3m5 3-5 3" />
          <path className="ci-accent" d="M27 22c3-3 9-3 12 0" />
        </g>
      )

    case 'schrodinger-bridge':
      return (
        <g>
          <path className="ci-guide" d="M7 38c0-8 1-15 4-20 2-4 4-5 5-5M41 38c0-8-1-15-4-20-2-4-4-5-5-5" />
          <path className="ci-guide" d="M11 20c8-13 18 25 26 10M11 27c8 15 18-19 26-7M11 33c10-4 16-17 26-9" />
          <path className="ci-primary" d="M11 24c9-6 17 8 26 0" />
          <circle className="ci-accent-fill" cx="11" cy="24" r="2.5" />
          <circle className="ci-accent-fill" cx="37" cy="24" r="2.5" />
        </g>
      )

    case 'doob-h-transform':
      return (
        <g>
          <path className="ci-guide" d="M7 24h10m0 0 10-14m-10 14 10 0m-10 0 10 14m0-28 13-2m-13 2 13 10m-13 4 13 0m-13 14 13-10m-13 10 13 4" />
          <path className="ci-primary" d="M7 24h10l10-14 13-2" />
          <path className="ci-accent" d="M32 9 40 8m0 0-5-2m5 2-3 4" />
          <circle className="ci-accent" cx="40" cy="8" r="3" />
          <circle className="ci-primary-fill" cx="7" cy="24" r="2.5" />
        </g>
      )

    case 'tweedie-formula':
      return (
        <g>
          <path className="ci-guide" d="M5 34c8-13 16-13 23-2s10 8 15 2" />
          <g className="ci-secondary"><circle cx="9" cy="14" r="1.5" /><circle cx="20" cy="10" r="1.5" /><circle cx="31" cy="17" r="1.5" /><circle cx="39" cy="12" r="1.5" /></g>
          <path className="ci-primary" d="M9 14 12 27m0 0-3-4m3 4 2-5M20 10l1 16m0 0-3-4m3 4 3-4M31 17l3 14m0 0-3-4m3 4 2-5M39 12v19m0 0-3-5m3 5 3-5" />
          <g className="ci-accent-fill"><circle cx="12" cy="27" r="2" /><circle cx="21" cy="26" r="2" /><circle cx="34" cy="31" r="2" /><circle cx="39" cy="31" r="2" /></g>
        </g>
      )

    case 'wasserstein-distance':
      return (
        <g>
          <path className="ci-guide" d="M5 40h38" />
          <path className="ci-primary" d="M7 40V28h5v12m3 0V20h5v20M28 40V24h5v16m3 0V14h5v26" />
          <path className="ci-accent" d="M10 27c4-13 19-15 28-14M18 19c4-5 8-5 12 4" />
          <path className="ci-accent" d="m38 13-5-1m5 1-3 4m-5 6-4-1m4 1-3 3" />
        </g>
      )

    case 'sinkhorn-algorithm':
      return (
        <g>
          <rect className="ci-guide" x="9" y="9" width="30" height="30" />
          <path className="ci-guide" d="M9 19h30M9 29h30M19 9v30M29 9v30" />
          <path className="ci-primary" d="M5 14h38m0 0-4-3m4 3-4 3" />
          <path className="ci-secondary" d="M34 5v38m0 0-3-4m3 4 3-4" />
          <rect className="ci-accent-fill" x="29" y="9" width="10" height="10" />
        </g>
      )

    case 'gromov-wasserstein-distance':
      return (
        <g>
          <path className="ci-primary" d="m6 33 9-21 7 25-16-4Zm22-19 14 8-11 17-3-25Z" />
          <g className="ci-primary-fill"><circle cx="6" cy="33" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="22" cy="37" r="2" /><circle cx="28" cy="14" r="2" /><circle cx="42" cy="22" r="2" /><circle cx="31" cy="39" r="2" /></g>
          <path className="ci-guide" strokeDasharray="2 2" d="M6 33 28 14M15 12l27 10M22 37l9 2" />
          <path className="ci-accent" d="M15 12 6 33M28 14l14 8" />
        </g>
      )

    case 'frechet-inception-distance':
      return (
        <g>
          <ellipse className="ci-secondary" cx="17" cy="23" rx="11" ry="7" transform="rotate(-20 17 23)" />
          <ellipse className="ci-primary" cx="32" cy="27" rx="10" ry="12" transform="rotate(24 32 27)" />
          <g className="ci-guide"><circle cx="10" cy="24" r="1" /><circle cx="17" cy="17" r="1" /><circle cx="22" cy="27" r="1" /><circle cx="29" cy="20" r="1" /><circle cx="36" cy="27" r="1" /><circle cx="31" cy="35" r="1" /></g>
          <path className="ci-accent" d="M17 23h15m0 0-4-3m4 3-4 3" />
          <g className="ci-accent-fill"><circle cx="17" cy="23" r="2" /><circle cx="32" cy="23" r="2" /></g>
        </g>
      )

    case 'bradley-terry-model':
      return (
        <g>
          <circle className="ci-secondary" cx="8" cy="24" r="4" />
          <circle className="ci-primary" cx="19" cy="24" r="6" />
          <path className="ci-guide" d="M12 24h2" />
          <path className="ci-primary" d="M27 38c3 0 4-1 5-6l2-16c1-5 2-6 8-6" />
          <circle className="ci-accent-fill" cx="36" cy="14" r="2.5" />
        </g>
      )

    case 'plackett-luce-model':
      return (
        <g>
          <g className="ci-paper-fill"><circle className="ci-primary" cx="9" cy="13" r="3" /><circle className="ci-primary" cx="9" cy="24" r="3" /><circle className="ci-primary" cx="9" cy="35" r="3" /></g>
          <path className="ci-guide" d="M14 13c8 0 8-5 16-5M14 24c9 0 9 0 16 0M14 35c8 0 8 5 16 5" />
          <path className="ci-primary" d="M30 8h11M30 24h8M30 40h5" />
          <g className="ci-accent-fill"><circle cx="30" cy="8" r="2.5" /><circle cx="30" cy="24" r="2" /><circle cx="30" cy="40" r="1.5" /></g>
        </g>
      )

    case 'elo-rating-system':
      return (
        <g>
          <path className="ci-guide" d="M12 7v34M36 7v34M8 12h8M8 24h8M8 36h8M32 12h8M32 24h8M32 36h8" />
          <g className="ci-guide"><circle cx="12" cy="28" r="2.5" /><circle cx="36" cy="20" r="2.5" /></g>
          <path className="ci-primary" d="M12 28V17m0 0-3 4m3-4 3 4M36 20v11m0 0-3-4m3 4 3-4" />
          <path className="ci-accent" d="m21 20 6 8m0-8-6 8" />
          <g className="ci-accent-fill"><circle cx="12" cy="17" r="2" /><circle cx="36" cy="31" r="2" /></g>
        </g>
      )

    case 'shapley-value':
      return (
        <g>
          <g className="ci-paper-fill"><circle className="ci-secondary" cx="7" cy="12" r="3" /><circle className="ci-accent" cx="7" cy="24" r="3" /><circle className="ci-secondary" cx="7" cy="36" r="3" /></g>
          <path className="ci-guide" d="M10 12c10 0 10 12 20 12M10 24h20M10 36c10 0 10-12 20-12" />
          <circle className="ci-primary" cx="35" cy="24" r="9" />
          <path className="ci-accent-fill" d="M35 24V15a9 9 0 0 1 8 5Z" />
          <circle className="ci-primary-fill" cx="35" cy="24" r="2" />
        </g>
      )

    case 'hopfield-network':
      return (
        <g>
          <path className="ci-guide" d="M5 12c8 0 7 9 16 9s8-9 17-9M7 19c7 0 7 13 15 13s8-13 18-13" />
          <path className="ci-primary" d="M9 7c3 8 4 17 13 22m0 0-5-1m5 1-2-5" />
          <circle className="ci-secondary" cx="9" cy="7" r="2.5" />
          <path className="ci-accent-fill" d="m24 28 2 4 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1Z" />
        </g>
      )

    case 'koopman-operator':
      return (
        <g>
          <path className="ci-secondary" d="M5 36c8-25 12 15 19-18" />
          <path className="ci-primary" d="M25 9c-5 7-5 23 0 30 5-7 5-23 0-30Z" />
          <path className="ci-primary" d="M30 14h13m0 0-4-3m4 3-4 3M30 24h13m0 0-4-3m4 3-4 3M30 34h13m0 0-4-3m4 3-4 3" />
          <circle className="ci-accent-fill" cx="25" cy="24" r="2" />
        </g>
      )

    case 'lie-group':
      return (
        <g>
          <path className="ci-guide" d="M8 29a17 17 0 0 1 31-12m0 0-5-2m5 2-1-5" />
          <path className="ci-secondary" d="M9 30h10M9 30V20" />
          <path className="ci-primary" d="M27 12l8 6m-8-6 6-8" />
          <path className="ci-accent" d="M37 34h7m-7 0v-7" />
          <circle className="ci-accent-fill" cx="37" cy="34" r="2" />
        </g>
      )

    case 'weisfeiler-leman-test':
      return (
        <g>
          <path className="ci-guide" d="M5 24h13M8 16l10 8-10 8V16m22 0 10 8-10 8V16" />
          <g className="ci-paper-fill"><circle className="ci-secondary" cx="8" cy="16" r="3" /><circle className="ci-secondary" cx="18" cy="24" r="3" /><circle className="ci-secondary" cx="8" cy="32" r="3" /><circle className="ci-primary" cx="30" cy="16" r="3" /><circle className="ci-accent" cx="40" cy="24" r="3" /><circle className="ci-primary" cx="30" cy="32" r="3" /></g>
          <path className="ci-primary" d="M21 24h6m0 0-4-3m4 3-4 3" />
          <circle className="ci-accent-fill" cx="40" cy="24" r="1.5" />
        </g>
      )

    case 'stiefel-manifold':
      return (
        <g>
          <path className="ci-guide" d="M5 34c10-8 29-8 38 0M7 39c10-7 26-7 34 0" />
          <path className="ci-secondary" d="M12 34V18m0 16 11-8m-11 8h5v-5" />
          <path className="ci-primary" d="M34 33 27 19m7 14 9-10m-9 10 4-2-2-4" />
          <path className="ci-accent" d="M17 18c5-7 12-8 19-3m0 0-5-1m5 1-3 4" />
        </g>
      )

    case 'canny-edge-detector':
      return (
        <g>
          <path className="ci-guide" d="M8 6c9 8 3 19 12 25s15 1 20 11M14 5c8 9 2 18 10 23s14 0 20 10" />
          <path className="ci-accent" d="M11 6c9 9 3 18 11 24s15 1 20 10" />
          <path className="ci-primary" d="M5 18h10m0 0-4-3m4 3-4 3M27 20h10m0 0-4-3m4 3-4 3" />
          <circle className="ci-accent-fill" cx="22" cy="30" r="2" />
        </g>
      )

    default:
      return null
  }
}
