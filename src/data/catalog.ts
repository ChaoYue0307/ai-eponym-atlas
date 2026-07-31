import rawAtlas from "../../content/eponyms.json";
import rawPeopleMedia from "../../content/people-media.json";
import {
  conceptCategoryIds,
  type AtlasData,
  type AtlasMeta,
  type Concept,
  type ConceptCategory,
  type Person,
  type PersonMediaCatalog,
  type PersonMediaRecord,
} from "../types";

/**
 * JSON imports infer broad `string` values. Keep that broad type at the input
 * boundary, then narrow categories before exposing the public catalog.
 */
type RawConcept = Omit<Concept, "category"> & {
  readonly category: string;
};

type RawPerson = Omit<Person, "lifeStatus"> & {
  readonly lifeStatus?: string;
};

interface RawAtlasData {
  readonly meta: AtlasMeta;
  readonly people: readonly RawPerson[];
  readonly concepts: readonly RawConcept[];
}

const input: RawAtlasData = rawAtlas;
const mediaInput: PersonMediaCatalog = rawPeopleMedia;
const categoryIdSet: ReadonlySet<string> = new Set(conceptCategoryIds);

function parseCategory(value: string): ConceptCategory {
  if (categoryIdSet.has(value)) {
    return value as ConceptCategory;
  }

  throw new TypeError(`Unknown concept category in content/eponyms.json: ${value}`);
}

function parsePerson(person: RawPerson): Person {
  if (person.lifeStatus !== undefined && person.lifeStatus !== "missing") {
    throw new TypeError(
      `Unknown life status in content/eponyms.json: ${person.lifeStatus}`,
    );
  }

  return {
    ...person,
    lifeStatus: person.lifeStatus,
  };
}

function indexMediaByPersonId(
  entries: readonly PersonMediaRecord[],
): ReadonlyMap<string, PersonMediaRecord> {
  const index = new Map<string, PersonMediaRecord>();

  for (const entry of entries) {
    if (index.has(entry.personId)) {
      throw new TypeError(`Duplicate media profile id: ${entry.personId}`);
    }
    index.set(entry.personId, entry);
  }

  return index;
}

function indexById<T extends { readonly id: string }>(
  entries: readonly T[],
): ReadonlyMap<string, T> {
  const index = new Map<string, T>();

  for (const entry of entries) {
    if (index.has(entry.id)) {
      throw new TypeError(`Duplicate atlas id: ${entry.id}`);
    }
    index.set(entry.id, entry);
  }

  return index;
}

export const meta: AtlasMeta = Object.freeze(input.meta);

export const mediaCatalog: PersonMediaCatalog = Object.freeze(mediaInput);
const mediaByPersonId = indexMediaByPersonId(mediaCatalog.profiles);

export const people: readonly Person[] = Object.freeze(
  input.people.map((rawPerson) => {
    const person = parsePerson(rawPerson);
    const media = mediaByPersonId.get(person.id);

    return Object.freeze({
      ...person,
      profileUrl: media?.profileUrl,
      portrait: media?.portrait,
    });
  }),
);

export const concepts: readonly Concept[] = Object.freeze(
  input.concepts.map((concept) =>
    Object.freeze({
      ...concept,
      category: parseCategory(concept.category),
    }),
  ),
);

export const peopleById: ReadonlyMap<string, Person> = indexById(people);

export const conceptsById: ReadonlyMap<string, Concept> = indexById(concepts);

const categoriesPresent = new Set<ConceptCategory>(
  concepts.map((concept) => concept.category),
);

/** Stable editorial order for filters and navigation. */
export const categories: readonly ConceptCategory[] = Object.freeze(
  conceptCategoryIds.filter((category) => categoriesPresent.has(category)),
);

/** Reader-facing coverage totals, derived from the catalog to prevent drift. */
export const catalogStats = Object.freeze({
  people: people.length,
  concepts: concepts.length,
  fields: categories.length,
  sourceCitations: concepts.reduce(
    (total, concept) => total + concept.sourceLinks.length,
    0,
  ),
});

export const catalog: AtlasData = Object.freeze({
  meta,
  people,
  concepts,
});
