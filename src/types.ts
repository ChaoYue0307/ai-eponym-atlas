/**
 * Shared domain types for the atlas.
 *
 * The content file deliberately stays plain JSON. These types make the
 * boundary between editorial content and application code explicit without
 * leaking `any` into consumers.
 */

export interface LocalizedText {
  readonly en: string;
  readonly zh: string;
}

export interface SourceLink {
  readonly label: string;
  readonly url: string;
}

export interface PersonPortrait {
  /** Repository-local path under `public/`, without a leading slash. */
  readonly file: string;
  /** Exact Wikimedia thumbnail URL used to create the repository-local copy. */
  readonly sourceImageUrl: string;
  /** Wikimedia Commons file-description page. */
  readonly sourceUrl: string;
  readonly creator: string;
  readonly license: string;
  readonly licenseUrl: string;
  readonly alt: LocalizedText;
  /** Optional CSS crop focus for portraits whose subject is not centered. */
  readonly objectPosition?: string;
  /** Optional restrained zoom for a subject inside a wider archival photograph. */
  readonly cropScale?: number;
  readonly verifiedOn: string;
}

export interface PersonMedia {
  readonly profileUrl?: string;
  readonly portrait?: PersonPortrait;
}

export interface PersonMediaRecord extends PersonMedia {
  readonly personId: string;
}

export interface PersonMediaCatalog {
  readonly schemaVersion: string;
  readonly lastVerified: string;
  readonly sourcePolicy: LocalizedText;
  readonly profiles: readonly PersonMediaRecord[];
}

export interface AtlasMeta {
  readonly title: string;
  readonly zhTitle: string;
  readonly subtitle: string;
  readonly zhSubtitle: string;
  readonly tagline: string;
  readonly description: LocalizedText;
  readonly schemaVersion: string;
  readonly lastUpdated: string;
  readonly licenseRecommendation: string;
  readonly editorialNote: LocalizedText;
}

export const conceptCategoryIds = [
  "algebra",
  "calculus",
  "computation",
  "dynamics",
  "geometry",
  "information",
  "optimization",
  "probability",
  "statistics",
] as const;

export type ConceptCategory = (typeof conceptCategoryIds)[number];

export interface Person {
  readonly id: string;
  readonly name: string;
  readonly zhName: string;
  readonly born: string | null;
  readonly died: string | null;
  readonly lifeStatus?: "missing";
  readonly region: string;
  readonly portraitInitials: string;
  readonly summary: LocalizedText;
  readonly concepts: readonly string[];
  readonly profileUrl?: string;
  readonly portrait?: PersonPortrait;
}

export interface Concept {
  readonly id: string;
  readonly personIds: readonly string[];
  readonly term: string;
  readonly zhTerm: string;
  readonly functionNickname: LocalizedText;
  readonly question: LocalizedText;
  readonly intuition: LocalizedText;
  readonly formalDefinition: string;
  readonly aiApplications: readonly LocalizedText[];
  readonly category: ConceptCategory;
  readonly era: string;
  readonly relatedConceptIds: readonly string[];
  readonly aliases: readonly string[];
  readonly tags: readonly string[];
  readonly attributionNote: LocalizedText;
  readonly sourceLinks: readonly SourceLink[];
}

export interface AtlasData {
  readonly meta: AtlasMeta;
  readonly people: readonly Person[];
  readonly concepts: readonly Concept[];
}

export type TimelineEventKind =
  | "person"
  | "publication"
  | "naming"
  | "ai-adoption";

export type TimelineEraId =
  | "origins"
  | "formalization"
  | "systems"
  | "modern";

export interface TimelineEvent {
  readonly id: string;
  /** Numeric value used only for chronological sorting. */
  readonly sortYear: number;
  /** Reader-facing year or range, localized when prose is required. */
  readonly year: LocalizedText;
  readonly eraId: TimelineEraId;
  readonly kind: TimelineEventKind;
  readonly title: LocalizedText;
  readonly description: LocalizedText;
  readonly personIds: readonly string[];
  readonly conceptIds: readonly string[];
  /** Sources that directly support the event-level historical or AI claim. */
  readonly sourceLinks: readonly SourceLink[];
}

export type GraphNodeKind = "person" | "concept" | "application";

interface BaseGraphNode {
  readonly id: string;
  readonly kind: GraphNodeKind;
  readonly label: string;
  readonly zhLabel: string;
  readonly isFocus: boolean;
}

export interface PersonGraphNode extends BaseGraphNode {
  readonly kind: "person";
  readonly personId: string;
  readonly meta: {
    readonly born: string | null;
    readonly died: string | null;
    readonly lifeStatus?: "missing";
    readonly region: string;
  };
}

export interface ConceptGraphNode extends BaseGraphNode {
  readonly kind: "concept";
  readonly conceptId: string;
  readonly meta: {
    readonly category: ConceptCategory;
    readonly era: string;
    readonly functionNickname: LocalizedText;
  };
}

export interface ApplicationGraphNode extends BaseGraphNode {
  readonly kind: "application";
  readonly applicationId: string;
  readonly conceptId: string;
}

export type EgoGraphNode =
  | PersonGraphNode
  | ConceptGraphNode
  | ApplicationGraphNode;

export type GraphEdgeRelation =
  | "named-after"
  | "related-to"
  | "applied-in";

export interface EgoGraphEdge {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly relation: GraphEdgeRelation;
  readonly label: string;
  readonly zhLabel: string;
  /** A concise explanation of why the two endpoints are meaningfully linked. */
  readonly note?: string;
  readonly zhNote?: string;
  readonly directed: boolean;
}

export interface EgoGraph {
  readonly focusConceptId: string;
  readonly nodes: readonly EgoGraphNode[];
  readonly edges: readonly EgoGraphEdge[];
}
