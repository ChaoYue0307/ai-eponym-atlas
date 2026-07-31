import { concepts, conceptsById, peopleById } from "../data/catalog";
import type {
  ApplicationGraphNode,
  Concept,
  ConceptCategory,
  ConceptGraphNode,
  EgoGraph,
  EgoGraphEdge,
  EgoGraphNode,
  PersonGraphNode,
} from "../types";

const categoryLabels: Record<
  ConceptCategory,
  { readonly en: string; readonly zh: string }
> = {
  algebra: { en: "algebra", zh: "代数" },
  calculus: { en: "calculus", zh: "微积分" },
  computation: { en: "computation", zh: "计算" },
  dynamics: { en: "dynamics", zh: "动力系统" },
  geometry: { en: "geometry", zh: "几何" },
  information: { en: "information", zh: "信息论" },
  optimization: { en: "optimization", zh: "优化" },
  probability: { en: "probability", zh: "概率" },
  statistics: { en: "statistics", zh: "统计" },
};

export interface EgoGraphOptions {
  readonly includePeople?: boolean;
  readonly includeRelatedConcepts?: boolean;
  readonly includeApplications?: boolean;
  /** Limit related concepts for compact visual layouts. Defaults to all. */
  readonly maxRelatedConcepts?: number;
  /** Useful for compact mobile layouts. Defaults to all applications. */
  readonly maxApplications?: number;
}

function conceptNode(concept: Concept, isFocus: boolean): ConceptGraphNode {
  return {
    id: `concept:${concept.id}`,
    kind: "concept",
    conceptId: concept.id,
    label: concept.term,
    zhLabel: concept.zhTerm,
    isFocus,
    meta: {
      category: concept.category,
      era: concept.era,
      functionNickname: concept.functionNickname,
    },
  };
}

function personNode(personId: string): PersonGraphNode | undefined {
  const person = peopleById.get(personId);
  if (person === undefined) {
    return undefined;
  }

  return {
    id: `person:${person.id}`,
    kind: "person",
    personId: person.id,
    label: person.name,
    zhLabel: person.zhName,
    isFocus: false,
    meta: {
      born: person.born,
      died: person.died,
      region: person.region,
    },
  };
}

function applicationSlug(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/\p{Mark}/gu, "")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "");

  return slug || "application";
}

function edge(
  source: string,
  target: string,
  relation: EgoGraphEdge["relation"],
): EgoGraphEdge {
  const labels: Record<
    EgoGraphEdge["relation"],
    Pick<EgoGraphEdge, "label" | "zhLabel" | "directed">
  > = {
    "named-after": {
      label: "named after",
      zhLabel: "以其命名",
      directed: true,
    },
    "related-to": {
      label: "related to",
      zhLabel: "相关概念",
      directed: false,
    },
    "applied-in": {
      label: "applied in",
      zhLabel: "应用于",
      directed: true,
    },
  };

  return {
    id: `${source}|${relation}|${target}`,
    source,
    target,
    relation,
    ...labels[relation],
  };
}

function relatedConceptEdge(
  sourceNode: ConceptGraphNode,
  sourceConcept: Concept,
  targetNode: ConceptGraphNode,
  targetConcept: Concept,
): EgoGraphEdge {
  const sameCategory = sourceConcept.category === targetConcept.category;
  const sourceCategory = categoryLabels[sourceConcept.category];
  const targetCategory = categoryLabels[targetConcept.category];
  const categoryLabel = sameCategory
    ? `${sourceCategory.en} connection`
    : `${sourceCategory.en} ↔ ${targetCategory.en}`;
  const zhCategoryLabel = sameCategory
    ? `${sourceCategory.zh}类概念`
    : `${sourceCategory.zh} ↔ ${targetCategory.zh}`;

  return {
    ...edge(sourceNode.id, targetNode.id, "related-to"),
    label: categoryLabel,
    zhLabel: zhCategoryLabel,
    note: `${sourceConcept.functionNickname.en} ↔ ${targetConcept.functionNickname.en}`,
    zhNote: `${sourceConcept.functionNickname.zh} ↔ ${targetConcept.functionNickname.zh}`,
  };
}

/**
 * Build a deterministic, one-hop graph around one concept.
 *
 * Every non-focus node has exactly one edge to the focus concept. Related
 * concepts do not recursively pull in their own people or applications, which
 * keeps the result a true one-hop ego graph.
 */
export function buildEgoGraph(
  conceptId: string,
  options: EgoGraphOptions = {},
): EgoGraph {
  const focusConcept = conceptsById.get(conceptId);
  if (focusConcept === undefined) {
    throw new RangeError(`Unknown concept id: ${conceptId}`);
  }

  const {
    includePeople = true,
    includeRelatedConcepts = true,
    includeApplications = true,
    maxRelatedConcepts = Number.POSITIVE_INFINITY,
    maxApplications = Number.POSITIVE_INFINITY,
  } = options;

  if (maxRelatedConcepts < 0 || Number.isNaN(maxRelatedConcepts)) {
    throw new RangeError("maxRelatedConcepts must be a non-negative number");
  }

  if (maxApplications < 0 || Number.isNaN(maxApplications)) {
    throw new RangeError("maxApplications must be a non-negative number");
  }

  const focusNode = conceptNode(focusConcept, true);
  const nodes: EgoGraphNode[] = [focusNode];
  const edges: EgoGraphEdge[] = [];
  const seenNodeIds = new Set<string>([focusNode.id]);

  const addNode = (node: EgoGraphNode, graphEdge: EgoGraphEdge): void => {
    if (!seenNodeIds.has(node.id)) {
      seenNodeIds.add(node.id);
      nodes.push(node);
    }
    if (!edges.some((candidate) => candidate.id === graphEdge.id)) {
      edges.push(graphEdge);
    }
  };

  if (includePeople) {
    for (const personId of focusConcept.personIds) {
      const node = personNode(personId);
      if (node !== undefined) {
        addNode(
          node,
          edge(focusNode.id, node.id, "named-after"),
        );
      }
    }
  }

  if (includeRelatedConcepts) {
    const relatedIds = new Set(focusConcept.relatedConceptIds);
    for (const candidate of concepts) {
      if (candidate.relatedConceptIds.includes(focusConcept.id)) {
        relatedIds.add(candidate.id);
      }
    }

    for (const relatedId of [...relatedIds].slice(
      0,
      Math.floor(maxRelatedConcepts),
    )) {
      const relatedConcept = conceptsById.get(relatedId);
      if (relatedConcept !== undefined) {
        const node = conceptNode(relatedConcept, false);
        addNode(
          node,
          relatedConceptEdge(
            focusNode,
            focusConcept,
            node,
            relatedConcept,
          ),
        );
      }
    }
  }

  if (includeApplications && maxApplications > 0) {
    const applications = focusConcept.aiApplications.slice(
      0,
      Math.floor(maxApplications),
    );

    applications.forEach((application, index) => {
      const applicationId = `${focusConcept.id}:${applicationSlug(application.en)}:${index}`;
      const node: ApplicationGraphNode = {
        id: `application:${applicationId}`,
        kind: "application",
        applicationId,
        conceptId: focusConcept.id,
        label: application.en,
        zhLabel: application.zh,
        isFocus: false,
      };
      addNode(node, edge(focusNode.id, node.id, "applied-in"));
    });
  }

  return {
    focusConceptId: focusConcept.id,
    nodes,
    edges,
  };
}
