export const middleConceptIconIds = [
  'noether-theorem',
  'boolean-algebra',
  'turing-machine',
  'turing-test',
  'von-neumann-architecture',
  'von-neumann-entropy',
  'poisson-distribution',
  'bernoulli-distribution',
  'pearson-correlation',
  'students-t-distribution',
  'wilcoxon-signed-rank-test',
  'mann-whitney-u-test',
  'wiener-process',
  'kalman-filter',
  'bellman-equation',
  'dijkstra-algorithm',
  'runge-kutta-method',
  'banach-fixed-point-theorem',
  'minkowski-distance',
  'gram-matrix',
  'gram-schmidt-orthogonalization',
  'mahalanobis-distance',
  'gumbel-softmax',
  'jensen-inequality',
  'hadamard-product',
  'mercer-theorem',
  'cholesky-decomposition',
  'bregman-divergence',
  'renyi-entropy',
  'gibbs-sampling',
  'boltzmann-machine',
  'metropolis-hastings-algorithm',
  'nesterov-acceleration',
  'lyapunov-function',
  'vapnik-chervonenkis-dimension',
  'dirichlet-distribution',
  'cramer-rao-bound',
  'rao-blackwell-theorem',
  'hoeffding-inequality',
  'karush-kuhn-tucker-conditions',
] as const;

export function MiddleConceptGlyph({ conceptId }: { conceptId: string }) {
  switch (conceptId) {
    case 'noether-theorem':
      return (
        <g>
          <circle className="ci-guide" cx="16" cy="18" r="8" />
          <path className="ci-primary" d="M10 13a8 8 0 0 1 12 1" />
          <polyline className="ci-primary" points="19,10 22,14 18,15" />
          <path className="ci-secondary" d="M24 18h6l3 10h10" />
          <line className="ci-primary" x1="31" y1="28" x2="43" y2="28" />
          <circle className="ci-primary-fill" cx="37" cy="28" r="2.2" />
        </g>
      );

    case 'boolean-algebra':
      return (
        <g>
          <circle className="ci-secondary" cx="18" cy="24" r="11" />
          <circle className="ci-primary" cx="30" cy="24" r="11" />
          <path
            className="ci-primary-fill"
            d="M24 15a11 11 0 0 1 0 18 11 11 0 0 1 0-18Z"
          />
          <path className="ci-accent" d="M12 13C6 18 5 27 9 34" strokeDasharray="3 3" />
        </g>
      );

    case 'turing-machine':
      return (
        <g>
          <g className="ci-guide">
            <rect x="5" y="23" width="7.6" height="10" />
            <rect x="12.6" y="23" width="7.6" height="10" />
            <rect x="20.2" y="23" width="7.6" height="10" />
            <rect x="27.8" y="23" width="7.6" height="10" />
            <rect x="35.4" y="23" width="7.6" height="10" />
          </g>
          <rect className="ci-primary" x="19" y="14" width="10" height="9" rx="2" />
          <line className="ci-primary" x1="24" y1="14" x2="24" y2="9" />
          <path className="ci-secondary" d="M12 9h24" />
          <polyline className="ci-secondary" points="15,6 12,9 15,12" />
          <polyline className="ci-secondary" points="33,6 36,9 33,12" />
        </g>
      );

    case 'turing-test':
      return (
        <g>
          <g className="ci-secondary">
            <circle cx="8" cy="14" r="3" />
            <polygon points="8,31 12,35 8,39 4,35" />
          </g>
          <g className="ci-primary">
            <path d="M12 10h8a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-4l-3 3v-3h-1" />
            <path d="M12 28h8a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-4l-3 3v-3h-1" />
          </g>
          <rect className="ci-paper-fill" x="23" y="6" width="5" height="36" rx="2" />
          <g className="ci-guide">
            <line x1="28" y1="15" x2="36" y2="20" />
            <line x1="28" y1="33" x2="36" y2="28" />
          </g>
          <circle className="ci-primary-fill" cx="39" cy="24" r="4" />
        </g>
      );

    case 'von-neumann-architecture':
      return (
        <g>
          <rect className="ci-primary" x="5" y="15" width="13" height="18" rx="2" />
          <g className="ci-secondary">
            <rect x="32" y="12" width="11" height="7" rx="1" />
            <rect x="32" y="21" width="11" height="7" rx="1" />
            <rect x="32" y="30" width="11" height="7" rx="1" />
          </g>
          <line className="ci-guide" x1="18" y1="24" x2="32" y2="24" />
          <polyline className="ci-primary" points="21,21 18,24 21,27" />
          <polyline className="ci-secondary" points="29,21 32,24 29,27" />
          <g>
            <circle className="ci-primary-fill" cx="23" cy="24" r="2" />
            <polygon className="ci-accent-fill" points="27,21 30,24 27,27 24,24" />
          </g>
        </g>
      );

    case 'von-neumann-entropy':
      return (
        <g>
          <g className="ci-guide">
            <rect x="5" y="10" width="16" height="16" />
            <line x1="13" y1="10" x2="13" y2="26" />
            <line x1="5" y1="18" x2="21" y2="18" />
          </g>
          <g className="ci-primary-fill">
            <rect x="7" y="12" width="4" height="4" rx="1" />
            <rect x="15" y="20" width="4" height="4" rx="1" />
          </g>
          <polyline className="ci-secondary" points="23,15 27,18 23,21" />
          <g className="ci-primary">
            <rect x="29" y="23" width="3" height="11" />
            <rect x="35" y="17" width="3" height="17" />
            <rect x="41" y="28" width="2" height="6" />
          </g>
          <path className="ci-accent" d="M28 39q7-9 15 0" />
        </g>
      );

    case 'poisson-distribution':
      return (
        <g>
          <line className="ci-guide" x1="5" y1="13" x2="25" y2="13" />
          <g className="ci-primary-fill">
            <circle cx="8" cy="13" r="1.7" />
            <circle cx="15" cy="13" r="1.7" />
            <circle cx="18" cy="13" r="1.7" />
            <circle cx="24" cy="13" r="1.7" />
          </g>
          <polyline className="ci-secondary" points="22,19 26,23 22,27" />
          <g className="ci-primary">
            <rect x="29" y="31" width="3" height="8" />
            <rect x="34" y="24" width="3" height="15" />
            <rect x="39" y="28" width="3" height="11" />
          </g>
          <line className="ci-guide" x1="28" y1="39" x2="43" y2="39" />
        </g>
      );

    case 'bernoulli-distribution':
      return (
        <g>
          <circle className="ci-paper-fill" cx="10" cy="24" r="4" />
          <path className="ci-guide" d="M14 24h7l10-10" />
          <path className="ci-primary" d="M14 24h7l10 10" />
          <circle className="ci-paper-fill" cx="36" cy="13" r="5" />
          <circle className="ci-primary-fill" cx="36" cy="35" r="6" />
        </g>
      );

    case 'pearson-correlation':
      return (
        <g>
          <path className="ci-guide" d="M6 6v36h36" />
          <ellipse
            className="ci-secondary"
            cx="24"
            cy="24"
            rx="16"
            ry="6"
            transform="rotate(-36 24 24)"
          />
          <line className="ci-primary" x1="9" y1="38" x2="39" y2="9" />
          <g className="ci-primary-fill">
            <circle cx="11" cy="35" r="1.8" />
            <circle cx="16" cy="31" r="1.8" />
            <circle cx="21" cy="27" r="1.8" />
            <circle cx="26" cy="21" r="1.8" />
            <circle cx="31" cy="19" r="1.8" />
            <circle cx="37" cy="12" r="1.8" />
          </g>
        </g>
      );

    case 'students-t-distribution':
      return (
        <g>
          <line className="ci-guide" x1="5" y1="36" x2="43" y2="36" />
          <path
            className="ci-secondary"
            d="M8 35c8-1 10-17 16-24 6 7 8 23 16 24"
          />
          <path
            className="ci-primary"
            d="M5 34c7 0 10-4 14-11 3-5 7-5 10 0 4 7 7 11 14 11"
          />
          <g className="ci-accent">
            <line x1="5" y1="34" x2="11" y2="33" />
            <line x1="37" y1="33" x2="43" y2="34" />
          </g>
        </g>
      );

    case 'wilcoxon-signed-rank-test':
      return (
        <g>
          <line className="ci-guide" x1="24" y1="5" x2="24" y2="43" />
          <g className="ci-primary">
            <path d="M24 12h7" />
            <polyline points="28,9 31,12 28,15" />
            <path d="M24 29h14" />
            <polyline points="35,26 38,29 35,32" />
          </g>
          <g className="ci-accent">
            <path d="M24 20h-5" />
            <polyline points="22,17 19,20 22,23" />
            <path d="M24 38H9" />
            <polyline points="12,35 9,38 12,41" />
          </g>
          <g className="ci-paper-fill">
            <circle cx="24" cy="12" r="1.8" />
            <circle cx="24" cy="20" r="1.8" />
            <circle cx="24" cy="29" r="1.8" />
            <circle cx="24" cy="38" r="1.8" />
          </g>
        </g>
      );

    case 'mann-whitney-u-test':
      return (
        <g>
          <line className="ci-guide" x1="6" y1="24" x2="42" y2="24" />
          <g className="ci-primary-fill">
            <circle cx="9" cy="24" r="2.3" />
            <circle cx="19" cy="24" r="2.3" />
            <circle cx="32" cy="24" r="2.3" />
            <circle cx="40" cy="24" r="2.3" />
          </g>
          <g className="ci-paper-fill">
            <polygon points="14,20 18,24 14,28 10,24" />
            <polygon points="25,20 29,24 25,28 21,24" />
            <polygon points="36,20 40,24 36,28 32,24" />
          </g>
        </g>
      );

    case 'wiener-process':
      return (
        <g>
          <path className="ci-guide" d="M6 6v36h37" />
          <g className="ci-secondary">
            <path d="M7 24c9-2 18-7 35-15" strokeDasharray="3 3" />
            <path d="M7 24c9 2 18 7 35 15" strokeDasharray="3 3" />
          </g>
          <polyline
            className="ci-primary"
            points="7,24 11,21 14,26 18,18 21,23 25,15 28,29 31,20 34,34 37,25 42,31"
          />
          <g>
            <circle className="ci-paper-fill" cx="7" cy="24" r="2" />
            <circle className="ci-primary-fill" cx="42" cy="31" r="2.3" />
          </g>
        </g>
      );

    case 'kalman-filter':
      return (
        <g>
          <path className="ci-secondary" d="M6 34C16 29 27 18 42 10" strokeDasharray="4 3" />
          <g className="ci-accent-fill">
            <circle cx="8" cy="38" r="1.8" />
            <circle cx="14" cy="27" r="1.8" />
            <circle cx="21" cy="31" r="1.8" />
            <circle cx="29" cy="17" r="1.8" />
            <circle cx="36" cy="18" r="1.8" />
            <circle cx="42" cy="8" r="1.8" />
          </g>
          <path className="ci-primary" d="M6 36C17 30 27 22 42 11" />
          <g className="ci-guide">
            <ellipse cx="14" cy="30" rx="5" ry="8" />
            <ellipse cx="28" cy="21" rx="4" ry="6" />
            <ellipse cx="40" cy="12" rx="3" ry="4" />
          </g>
          <circle className="ci-primary-fill" cx="28" cy="21" r="2" />
        </g>
      );

    case 'bellman-equation':
      return (
        <g>
          <circle className="ci-primary-fill" cx="8" cy="24" r="4" />
          <path className="ci-guide" d="M12 24h6l6-10M18 24l6 9h13" />
          <polygon className="ci-accent-fill" points="24,9 29,14 24,19 19,14" />
          <g className="ci-paper-fill">
            <circle cx="25" cy="33" r="4" />
            <circle cx="37" cy="33" r="3" />
          </g>
          <path className="ci-primary" d="M40 31c4-14-13-23-27-13" />
          <polyline className="ci-primary" points="16,14 13,18 18,19" />
        </g>
      );

    case 'dijkstra-algorithm':
      return (
        <g>
          <path className="ci-guide" d="M8 36L16 17l12 8 11-15M8 36l19 2 12-28M16 17l11 21" />
          <g className="ci-paper-fill">
            <circle cx="8" cy="36" r="3" />
            <circle cx="16" cy="17" r="3" />
            <circle cx="28" cy="25" r="3" />
            <circle cx="27" cy="38" r="3" />
            <circle cx="39" cy="10" r="3" />
          </g>
          <g className="ci-secondary">
            <path d="M5 29a9 9 0 0 1 12 9" strokeDasharray="3 3" />
            <path d="M6 23a15 15 0 0 1 19 16" strokeDasharray="3 3" />
          </g>
          <polyline className="ci-primary" points="8,36 16,17 28,25 39,10" />
          <g className="ci-primary-fill">
            <circle cx="8" cy="36" r="3.2" />
            <circle cx="39" cy="10" r="3.2" />
          </g>
        </g>
      );

    case 'runge-kutta-method':
      return (
        <g>
          <path className="ci-guide" d="M6 38C15 36 18 22 25 20s10-8 17-12" />
          <g className="ci-secondary">
            <line x1="8" y1="38" x2="15" y2="34" />
            <line x1="16" y1="30" x2="23" y2="24" />
            <line x1="24" y1="21" x2="31" y2="19" />
            <line x1="33" y1="15" x2="40" y2="9" />
          </g>
          <path className="ci-primary" d="M6 38C17 34 18 23 26 20s10-8 16-12" />
          <g>
            <circle className="ci-paper-fill" cx="6" cy="38" r="2.5" />
            <circle className="ci-primary-fill" cx="42" cy="8" r="2.5" />
          </g>
        </g>
      );

    case 'banach-fixed-point-theorem':
      return (
        <g>
          <path
            className="ci-primary"
            d="M8 9C42 6 43 40 14 39 5 38 8 18 26 18c14 0 11 19-2 17-8-1-7-11 1-11 5 0 6 5 2 7"
          />
          <g className="ci-paper-fill">
            <circle cx="8" cy="9" r="3" />
            <circle cx="14" cy="39" r="2.6" />
            <circle cx="26" cy="18" r="2.3" />
            <circle cx="24" cy="35" r="2" />
          </g>
          <circle className="ci-accent-fill" cx="27" cy="31" r="3" />
        </g>
      );

    case 'minkowski-distance':
      return (
        <g>
          <polygon className="ci-primary" points="24,6 42,24 24,42 6,24" />
          <circle className="ci-secondary" cx="24" cy="24" r="14" />
          <rect className="ci-guide" x="10" y="10" width="28" height="28" rx="5" />
          <circle className="ci-primary-fill" cx="24" cy="24" r="2.5" />
        </g>
      );

    case 'gram-matrix':
      return (
        <g>
          <g className="ci-primary">
            <line x1="7" y1="37" x2="13" y2="12" />
            <line x1="7" y1="37" x2="20" y2="16" />
            <line x1="7" y1="37" x2="22" y2="28" />
          </g>
          <polyline className="ci-secondary" points="22,21 26,24 22,27" />
          <g className="ci-guide">
            <rect x="28" y="10" width="15" height="15" />
            <line x1="33" y1="10" x2="33" y2="25" />
            <line x1="38" y1="10" x2="38" y2="25" />
            <line x1="28" y1="15" x2="43" y2="15" />
            <line x1="28" y1="20" x2="43" y2="20" />
          </g>
          <g className="ci-primary-fill">
            <rect x="29" y="11" width="3" height="3" />
            <rect x="34" y="16" width="3" height="3" />
            <rect x="39" y="21" width="3" height="3" />
          </g>
          <g className="ci-secondary">
            <rect x="34" y="11" width="3" height="3" />
            <rect x="29" y="16" width="3" height="3" />
            <rect x="39" y="16" width="3" height="3" />
            <rect x="34" y="21" width="3" height="3" />
          </g>
        </g>
      );

    case 'gram-schmidt-orthogonalization':
      return (
        <g>
          <path className="ci-primary" d="M8 38h34" />
          <polyline className="ci-primary" points="38,35 42,38 38,41" />
          <path className="ci-secondary" d="M8 38L31 10" />
          <line className="ci-guide" x1="31" y1="10" x2="31" y2="38" strokeDasharray="3 3" />
          <path className="ci-primary" d="M8 38V10" />
          <polyline className="ci-primary" points="5,14 8,10 11,14" />
        </g>
      );

    case 'mahalanobis-distance':
      return (
        <g>
          <g className="ci-secondary">
            <ellipse cx="14" cy="24" rx="8" ry="15" />
            <ellipse cx="14" cy="24" rx="5" ry="10" />
          </g>
          <line className="ci-accent" x1="14" y1="24" x2="18" y2="14" />
          <polyline className="ci-guide" points="23,21 27,24 23,27" />
          <circle className="ci-primary" cx="36" cy="24" r="9" />
          <line className="ci-primary" x1="36" y1="24" x2="41" y2="18" />
          <g className="ci-primary-fill">
            <circle cx="14" cy="24" r="2" />
            <circle cx="18" cy="14" r="2" />
            <circle cx="36" cy="24" r="2" />
            <circle cx="41" cy="18" r="2" />
          </g>
        </g>
      );

    case 'gumbel-softmax':
      return (
        <g>
          <g className="ci-secondary">
            <rect x="5" y="26" width="3" height="12" />
            <rect x="11" y="19" width="3" height="19" />
            <rect x="17" y="29" width="3" height="9" />
          </g>
          <g className="ci-accent">
            <path d="M6 22l2-4 2 4" />
            <path d="M12 15l2-4 2 4" />
            <path d="M18 25l2-4 2 4" />
          </g>
          <path className="ci-primary" d="M23 10h8l-2 12v8l-4 4v-12Z" />
          <g className="ci-paper-fill">
            <circle cx="35" cy="31" r="2.5" />
            <circle cx="42" cy="31" r="2" />
          </g>
          <circle className="ci-primary-fill" cx="38" cy="19" r="5" />
        </g>
      );

    case 'jensen-inequality':
      return (
        <g>
          <path className="ci-primary" d="M6 12Q24 44 42 12" />
          <line className="ci-secondary" x1="10" y1="20" x2="38" y2="20" />
          <g className="ci-paper-fill">
            <circle cx="10" cy="20" r="2.5" />
            <circle cx="38" cy="20" r="2.5" />
            <circle cx="24" cy="36" r="2.5" />
          </g>
          <line className="ci-accent" x1="24" y1="20" x2="24" y2="36" />
          <circle className="ci-accent-fill" cx="24" cy="20" r="2.2" />
        </g>
      );

    case 'hadamard-product':
      return (
        <g>
          <g className="ci-guide">
            <rect x="6" y="5" width="14" height="14" />
            <line x1="13" y1="5" x2="13" y2="19" />
            <line x1="6" y1="12" x2="20" y2="12" />
            <rect x="28" y="5" width="14" height="14" />
            <line x1="35" y1="5" x2="35" y2="19" />
            <line x1="28" y1="12" x2="42" y2="12" />
            <rect x="17" y="30" width="14" height="14" />
            <line x1="24" y1="30" x2="24" y2="44" />
            <line x1="17" y1="37" x2="31" y2="37" />
          </g>
          <g className="ci-primary-fill">
            <rect x="7" y="6" width="5" height="5" />
            <rect x="29" y="6" width="5" height="5" />
            <rect x="18" y="31" width="5" height="5" />
          </g>
          <g className="ci-accent-fill">
            <rect x="14" y="13" width="5" height="5" />
            <rect x="36" y="13" width="5" height="5" />
            <rect x="25" y="38" width="5" height="5" />
          </g>
          <g className="ci-secondary">
            <path d="M13 21l7 6" />
            <path d="M35 21l-7 6" />
          </g>
          <polyline className="ci-secondary" points="18,24 20,27 17,27" />
          <polyline className="ci-secondary" points="30,27 28,27 30,24" />
        </g>
      );

    case 'mercer-theorem':
      return (
        <g>
          <g className="ci-guide">
            <rect x="5" y="14" width="15" height="15" />
            <line x1="10" y1="14" x2="10" y2="29" />
            <line x1="15" y1="14" x2="15" y2="29" />
            <line x1="5" y1="19" x2="20" y2="19" />
            <line x1="5" y1="24" x2="20" y2="24" />
          </g>
          <polyline className="ci-secondary" points="22,18 26,22 22,26" />
          <path className="ci-primary" d="M28 13q4-7 8 0t7 0" />
          <path className="ci-secondary" d="M28 24q4-5 8 0t7 0" />
          <path className="ci-guide" d="M28 34q4-3 8 0t7 0" />
          <g className="ci-primary-fill">
            <circle cx="28" cy="13" r="2.5" />
            <circle cx="28" cy="24" r="2" />
            <circle cx="28" cy="34" r="1.5" />
          </g>
        </g>
      );

    case 'cholesky-decomposition':
      return (
        <g>
          <g className="ci-guide">
            <rect x="17" y="5" width="14" height="14" />
            <line x1="24" y1="5" x2="24" y2="19" />
            <line x1="17" y1="12" x2="31" y2="12" />
          </g>
          <path className="ci-secondary" d="M24 20v4M24 24l-10 5M24 24l10 5" />
          <polygon className="ci-primary" points="6,42 20,42 6,28" />
          <g className="ci-primary-fill">
            <rect x="7" y="37" width="4" height="4" />
            <rect x="7" y="31" width="4" height="4" />
            <rect x="13" y="37" width="4" height="4" />
          </g>
          <polygon className="ci-secondary" points="28,28 42,28 42,42" />
          <g className="ci-paper-fill">
            <rect x="37" y="29" width="4" height="4" />
            <rect x="31" y="29" width="4" height="4" />
            <rect x="37" y="35" width="4" height="4" />
          </g>
        </g>
      );

    case 'bregman-divergence':
      return (
        <g>
          <path className="ci-primary" d="M6 12Q24 44 42 12" />
          <line className="ci-secondary" x1="7" y1="22" x2="39" y2="43" />
          <circle className="ci-paper-fill" cx="14" cy="27" r="2.5" />
          <line className="ci-accent" x1="34" y1="27" x2="34" y2="40" />
          <g className="ci-accent-fill">
            <circle cx="34" cy="27" r="2.3" />
            <circle cx="34" cy="40" r="2.3" />
          </g>
        </g>
      );

    case 'renyi-entropy':
      return (
        <g>
          <g className="ci-secondary">
            <rect x="5" y="26" width="3" height="11" />
            <rect x="10" y="20" width="3" height="17" />
            <rect x="15" y="29" width="3" height="8" />
          </g>
          <path className="ci-guide" d="M19 24h4" />
          <circle className="ci-primary" cx="26" cy="24" r="5" />
          <path className="ci-accent" d="M26 19v5l4 2" />
          <g className="ci-primary">
            <rect x="34" y="28" width="3" height="9" />
            <rect x="40" y="10" width="3" height="27" />
          </g>
        </g>
      );

    case 'gibbs-sampling':
      return (
        <g>
          <g className="ci-guide">
            <ellipse cx="33" cy="17" rx="10" ry="8" />
            <ellipse cx="33" cy="17" rx="6" ry="5" />
          </g>
          <polyline
            className="ci-primary"
            points="7,39 17,39 17,31 25,31 25,23 33,23 33,17"
          />
          <g className="ci-paper-fill">
            <circle cx="7" cy="39" r="2.3" />
            <circle cx="17" cy="31" r="2" />
            <circle cx="25" cy="23" r="2" />
          </g>
          <circle className="ci-accent-fill" cx="33" cy="17" r="2.8" />
        </g>
      );

    case 'boltzmann-machine':
      return (
        <g>
          <g className="ci-guide">
            <ellipse cx="24" cy="29" rx="18" ry="12" />
            <ellipse cx="24" cy="29" rx="12" ry="8" />
            <ellipse cx="24" cy="29" rx="6" ry="4" />
          </g>
          <path className="ci-secondary" d="M10 13l14-5 14 7-9 11-13-1Z M10 13l19 13M24 8l-8 17M38 15l-22 10" />
          <g className="ci-paper-fill">
            <circle cx="10" cy="13" r="3" />
            <circle cx="24" cy="8" r="3" />
            <circle cx="38" cy="15" r="3" />
            <circle cx="16" cy="25" r="3" />
            <circle cx="29" cy="26" r="3" />
          </g>
          <circle className="ci-primary-fill" cx="24" cy="29" r="3.2" />
        </g>
      );

    case 'metropolis-hastings-algorithm':
      return (
        <g>
          <circle className="ci-primary-fill" cx="9" cy="30" r="3" />
          <path className="ci-secondary" d="M12 28L25 15" strokeDasharray="4 3" />
          <path className="ci-primary" d="M25 15l14-3" />
          <g className="ci-paper-fill">
            <circle cx="25" cy="15" r="2.5" />
            <circle cx="39" cy="12" r="3" />
          </g>
          <path className="ci-accent" d="M12 32l16 7c9 3 12-8 5-12-6-4-16-1-24 3" strokeDasharray="3 3" />
          <circle className="ci-paper-fill" cx="28" cy="39" r="2.5" />
        </g>
      );

    case 'nesterov-acceleration':
      return (
        <g>
          <path className="ci-guide" d="M5 39Q25 7 43 34" />
          <g className="ci-paper-fill">
            <circle cx="8" cy="36" r="2.6" />
            <circle cx="20" cy="24" r="3" />
          </g>
          <path className="ci-secondary" d="M20 24L36 10" strokeDasharray="4 3" />
          <polyline className="ci-secondary" points="31,10 36,10 36,15" />
          <path className="ci-accent" d="M36 10L30 29" />
          <circle className="ci-primary-fill" cx="30" cy="29" r="3.2" />
        </g>
      );

    case 'lyapunov-function':
      return (
        <g>
          <g className="ci-guide">
            <ellipse cx="25" cy="29" rx="18" ry="12" />
            <ellipse cx="25" cy="29" rx="12" ry="8" />
            <ellipse cx="25" cy="29" rx="6" ry="4" />
          </g>
          <path
            className="ci-primary"
            d="M7 8c25 0 37 18 25 30-9 8-24 1-19-8 4-7 18-6 18 0 0 4-5 5-7 2"
          />
          <polyline className="ci-primary" points="23,27 24,32 29,30" />
          <circle className="ci-accent-fill" cx="25" cy="29" r="2.8" />
        </g>
      );

    case 'vapnik-chervonenkis-dimension':
      return (
        <g>
          <g className="ci-guide">
            <line x1="7" y1="39" x2="37" y2="8" />
            <line x1="5" y1="20" x2="43" y2="29" />
            <path d="M8 8q15 18 32 31" />
            <path d="M7 35q19-22 34-18" />
          </g>
          <g className="ci-primary-fill">
            <circle cx="15" cy="15" r="3" />
            <circle cx="31" cy="19" r="3" />
          </g>
          <g className="ci-paper-fill">
            <circle cx="18" cy="33" r="3" />
            <circle cx="35" cy="35" r="3" />
          </g>
        </g>
      );

    case 'dirichlet-distribution':
      return (
        <g>
          <polygon className="ci-primary" points="24,6 43,40 5,40" />
          <g className="ci-primary-fill">
            <circle cx="23" cy="25" r="2.2" />
            <circle cx="26" cy="28" r="2" />
            <circle cx="20" cy="29" r="1.8" />
            <circle cx="25" cy="32" r="1.8" />
          </g>
          <g className="ci-accent-fill">
            <circle cx="12" cy="36" r="1.7" />
            <circle cx="36" cy="35" r="1.7" />
            <circle cx="24" cy="11" r="1.7" />
          </g>
        </g>
      );

    case 'cramer-rao-bound':
      return (
        <g>
          <path className="ci-secondary" d="M8 8l9 20h14l9-20" />
          <line className="ci-primary" x1="6" y1="35" x2="42" y2="35" />
          <g className="ci-guide">
            <path d="M17 17v14" />
            <polyline points="14,27 17,31 20,27" />
            <path d="M31 17v14" />
            <polyline points="28,27 31,31 34,27" />
          </g>
          <line className="ci-accent" x1="17" y1="31" x2="31" y2="31" />
          <circle className="ci-primary-fill" cx="24" cy="35" r="2.7" />
        </g>
      );

    case 'rao-blackwell-theorem':
      return (
        <g>
          <line className="ci-guide" x1="5" y1="24" x2="43" y2="24" strokeDasharray="3 3" />
          <g className="ci-secondary">
            <circle cx="7" cy="13" r="2" />
            <circle cx="10" cy="21" r="2" />
            <circle cx="8" cy="33" r="2" />
            <circle cx="16" cy="17" r="2" />
            <circle cx="16" cy="31" r="2" />
          </g>
          <path className="ci-primary" d="M21 9h7l-2 12v6l2 12h-7l2-12v-6Z" />
          <g className="ci-primary-fill">
            <circle cx="35" cy="21" r="2.2" />
            <circle cx="39" cy="24" r="2.2" />
            <circle cx="35" cy="27" r="2.2" />
          </g>
        </g>
      );

    case 'hoeffding-inequality':
      return (
        <g>
          <g className="ci-guide">
            <line x1="6" y1="9" x2="42" y2="9" />
            <line x1="6" y1="39" x2="42" y2="39" />
          </g>
          <g className="ci-secondary">
            <circle cx="10" cy="16" r="2" />
            <circle cx="16" cy="31" r="2" />
            <circle cx="23" cy="20" r="2" />
            <circle cx="31" cy="28" r="2" />
            <circle cx="38" cy="18" r="2" />
          </g>
          <g className="ci-primary">
            <line x1="8" y1="21" x2="40" y2="21" />
            <line x1="8" y1="27" x2="40" y2="27" />
          </g>
          <circle className="ci-primary-fill" cx="24" cy="24" r="2.8" />
          <g className="ci-accent">
            <circle cx="7" cy="14" r="1.4" />
            <circle cx="41" cy="34" r="1.4" />
          </g>
        </g>
      );

    case 'karush-kuhn-tucker-conditions':
      return (
        <g>
          <g className="ci-guide">
            <circle cx="16" cy="24" r="6" />
            <circle cx="16" cy="24" r="10" />
            <circle cx="16" cy="24" r="14" />
          </g>
          <line className="ci-primary" x1="30" y1="6" x2="30" y2="42" />
          <circle className="ci-accent-fill" cx="30" cy="24" r="3" />
          <g className="ci-secondary">
            <line x1="20" y1="24" x2="27" y2="24" />
            <polyline points="24,21 27,24 24,27" />
            <line x1="40" y1="24" x2="33" y2="24" />
            <polyline points="36,21 33,24 36,27" />
          </g>
          <line className="ci-guide" x1="41" y1="7" x2="41" y2="41" strokeDasharray="3 3" />
        </g>
      );

    default:
      return null;
  }
}
