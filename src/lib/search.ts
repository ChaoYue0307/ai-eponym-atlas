import {
  concepts,
  conceptsById,
  people,
  peopleById,
} from "../data/catalog";
import type { Concept, Person } from "../types";

export type SearchMode = "concepts" | "people";

export interface SearchFilters {
  readonly category?: string;
  readonly application?: string;
}

export interface SearchResult {
  readonly kind: "concept" | "person";
  readonly id: string;
  readonly score: number;
  readonly matchReasons: string[];
}

type SearchFieldKey =
  | "term"
  | "alias"
  | "person"
  | "function"
  | "question"
  | "intuition"
  | "application"
  | "tag"
  | "summary";

interface SearchField {
  readonly key: SearchFieldKey;
  readonly label: string;
  readonly weight: number;
  readonly values: readonly string[];
}

interface FieldMatch {
  readonly score: number;
  readonly reason: string;
}

const conceptOrder = new Map(
  concepts.map((concept, index) => [concept.id, index]),
);
const personOrder = new Map(people.map((person, index) => [person.id, index]));

const conceptsForPerson = new Map<string, readonly Concept[]>(
  people.map((person) => [
    person.id,
    person.concepts
      .map((conceptId) => conceptsById.get(conceptId))
      .filter((concept): concept is Concept => concept !== undefined),
  ]),
);

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Mark}/gu, "")
    .replace(/\b([\p{Letter}\p{Number}]+)[’']s\b/gu, "$1")
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function matchesCategory(concept: Concept, category?: string): boolean {
  if (category === undefined || category.trim() === "") {
    return true;
  }
  return normalize(concept.category) === normalize(category);
}

function matchesApplication(concept: Concept, application?: string): boolean {
  if (application === undefined || application.trim() === "") {
    return true;
  }

  const needle = normalize(application);
  return [...concept.aiApplications.flatMap((item) => [item.en, item.zh]), ...concept.tags]
    .map(normalize)
    .some((value) => value.includes(needle));
}

function conceptPassesFilters(
  concept: Concept,
  filters: SearchFilters,
): boolean {
  return (
    matchesCategory(concept, filters.category) &&
    matchesApplication(concept, filters.application)
  );
}

function conceptFields(concept: Concept): readonly SearchField[] {
  const associatedPeople = concept.personIds
    .map((personId) => peopleById.get(personId))
    .filter((person): person is Person => person !== undefined);

  return [
    {
      key: "term",
      label: "Term",
      weight: 130,
      values: [concept.term, concept.zhTerm],
    },
    {
      key: "alias",
      label: "Alias",
      weight: 112,
      values: concept.aliases,
    },
    {
      key: "person",
      label: "Person",
      weight: 100,
      values: associatedPeople.flatMap((person) => [
        person.name,
        person.zhName,
      ]),
    },
    {
      key: "function",
      label: "Function nickname",
      weight: 86,
      values: [
        concept.functionNickname.en,
        concept.functionNickname.zh,
      ],
    },
    {
      key: "question",
      label: "Question answered",
      weight: 66,
      values: [concept.question.en, concept.question.zh],
    },
    {
      key: "intuition",
      label: "Intuition",
      weight: 54,
      values: [concept.intuition.en, concept.intuition.zh],
    },
    {
      key: "application",
      label: "AI application",
      weight: 46,
      values: concept.aiApplications.flatMap((application) => [
        application.en,
        application.zh,
      ]),
    },
    {
      key: "tag",
      label: "Tag",
      weight: 36,
      values: concept.tags,
    },
  ];
}

function personFields(
  person: Person,
  connectedConcepts: readonly Concept[],
): readonly SearchField[] {
  return [
    {
      key: "person",
      label: "Person",
      weight: 140,
      values: [person.name, person.zhName],
    },
    {
      key: "term",
      label: "Associated term",
      weight: 96,
      values: connectedConcepts.flatMap((concept) => [
        concept.term,
        concept.zhTerm,
      ]),
    },
    {
      key: "alias",
      label: "Associated alias",
      weight: 82,
      values: connectedConcepts.flatMap((concept) => concept.aliases),
    },
    {
      key: "function",
      label: "Function nickname",
      weight: 70,
      values: connectedConcepts.flatMap((concept) => [
        concept.functionNickname.en,
        concept.functionNickname.zh,
      ]),
    },
    {
      key: "question",
      label: "Question answered",
      weight: 52,
      values: connectedConcepts.flatMap((concept) => [
        concept.question.en,
        concept.question.zh,
      ]),
    },
    {
      key: "intuition",
      label: "Intuition",
      weight: 44,
      values: connectedConcepts.flatMap((concept) => [
        concept.intuition.en,
        concept.intuition.zh,
      ]),
    },
    {
      key: "application",
      label: "AI application",
      weight: 38,
      values: connectedConcepts.flatMap((concept) =>
        concept.aiApplications.flatMap((application) => [
          application.en,
          application.zh,
        ]),
      ),
    },
    {
      key: "tag",
      label: "Tag",
      weight: 28,
      values: connectedConcepts.flatMap((concept) => concept.tags),
    },
    {
      key: "summary",
      label: "Biography",
      weight: 24,
      values: [person.summary.en, person.summary.zh],
    },
  ];
}

function scoreText(
  value: string,
  normalizedQuery: string,
  queryTokens: readonly string[],
): { readonly factor: number; readonly quality: string } | undefined {
  const candidate = normalize(value);
  if (candidate === "") {
    return undefined;
  }

  if (candidate === normalizedQuery) {
    return { factor: 1.6, quality: "exact" };
  }
  if (candidate.startsWith(normalizedQuery)) {
    return { factor: 1.28, quality: "prefix" };
  }
  if (candidate.includes(normalizedQuery)) {
    return { factor: 1, quality: "phrase" };
  }

  const matchedTokens = queryTokens.filter((token) =>
    candidate.includes(token),
  ).length;
  if (matchedTokens === 0) {
    return undefined;
  }

  const coverage = matchedTokens / queryTokens.length;
  if (coverage === 1) {
    return { factor: 0.86, quality: "all words" };
  }
  return { factor: 0.42 * coverage, quality: "partial" };
}

function bestFieldMatch(
  field: SearchField,
  normalizedQuery: string,
  queryTokens: readonly string[],
): FieldMatch | undefined {
  let best:
    | {
        readonly score: number;
        readonly quality: string;
        readonly value: string;
      }
    | undefined;

  for (const value of field.values) {
    const textScore = scoreText(value, normalizedQuery, queryTokens);
    if (textScore === undefined) {
      continue;
    }

    const score = field.weight * textScore.factor;
    if (
      best === undefined ||
      score > best.score ||
      (score === best.score && value.length < best.value.length)
    ) {
      best = { score, quality: textScore.quality, value };
    }
  }

  if (best === undefined) {
    return undefined;
  }

  return {
    score: best.score,
    reason: `${field.label} (${best.quality}): ${best.value}`,
  };
}

function scoreFields(
  fields: readonly SearchField[],
  normalizedQuery: string,
): Pick<SearchResult, "score" | "matchReasons"> | undefined {
  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const matches = fields
    .map((field) => bestFieldMatch(field, normalizedQuery, queryTokens))
    .filter((match): match is FieldMatch => match !== undefined)
    .sort((left, right) => right.score - left.score);

  if (matches.length === 0) {
    return undefined;
  }

  return {
    score: Math.round(
      matches.reduce((total, match) => total + match.score, 0) * 100,
    ) / 100,
    // Four concise reasons explain the rank without overwhelming result cards.
    matchReasons: matches.slice(0, 4).map((match) => match.reason),
  };
}

function stableResultSort(
  left: SearchResult,
  right: SearchResult,
  mode: SearchMode,
): number {
  const scoreDifference = right.score - left.score;
  if (scoreDifference !== 0) {
    return scoreDifference;
  }

  const order = mode === "concepts" ? conceptOrder : personOrder;
  return (
    (order.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
      (order.get(right.id) ?? Number.MAX_SAFE_INTEGER) ||
    left.id.localeCompare(right.id)
  );
}

/**
 * Search every reader-facing localized concept field.
 *
 * Ranking is deterministic and additive across fields. Exact matches outrank
 * prefixes, phrases, all-token matches, and partial-token matches; field
 * weights favor the term itself, aliases, and eponymous person names.
 */
export function searchCatalog(
  query: string,
  mode: SearchMode,
  filters: SearchFilters = {},
): SearchResult[] {
  const normalizedQuery = normalize(query);

  if (mode === "concepts") {
    return concepts
      .filter((concept) => conceptPassesFilters(concept, filters))
      .map((concept): SearchResult | undefined => {
        if (normalizedQuery === "") {
          return {
            kind: "concept",
            id: concept.id,
            score: 0,
            matchReasons: [],
          };
        }

        const scored = scoreFields(conceptFields(concept), normalizedQuery);
        return scored === undefined
          ? undefined
          : {
              kind: "concept",
              id: concept.id,
              ...scored,
            };
      })
      .filter((result): result is SearchResult => result !== undefined)
      .sort((left, right) => stableResultSort(left, right, mode));
  }

  return people
    .map((person): SearchResult | undefined => {
      const connectedConcepts = (conceptsForPerson.get(person.id) ?? []).filter(
        (concept) => conceptPassesFilters(concept, filters),
      );

      const hasActiveFilter =
        (filters.category?.trim() ?? "") !== "" ||
        (filters.application?.trim() ?? "") !== "";
      if (hasActiveFilter && connectedConcepts.length === 0) {
        return undefined;
      }

      if (normalizedQuery === "") {
        return {
          kind: "person",
          id: person.id,
          score: 0,
          matchReasons: [],
        };
      }

      const scored = scoreFields(
        personFields(person, connectedConcepts),
        normalizedQuery,
      );
      return scored === undefined
        ? undefined
        : {
            kind: "person",
            id: person.id,
            ...scored,
          };
    })
    .filter((result): result is SearchResult => result !== undefined)
    .sort((left, right) => stableResultSort(left, right, mode));
}
