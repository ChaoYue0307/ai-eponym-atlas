import type {
  Concept,
  ConceptCategory,
  LocalizedText,
  Person,
  SourceLink,
} from "../types";

export const categoryLabels: Readonly<
  Record<ConceptCategory, LocalizedText>
> = Object.freeze({
  algebra: { en: "Algebra & spaces", zh: "代数与空间" },
  calculus: { en: "Calculus & autodiff", zh: "微积分与自动微分" },
  computation: { en: "Computation", zh: "计算理论" },
  dynamics: { en: "Dynamics & control", zh: "动力系统与控制" },
  geometry: { en: "Geometry", zh: "几何" },
  information: { en: "Information theory", zh: "信息论" },
  optimization: { en: "Optimization", zh: "优化" },
  probability: { en: "Probability", zh: "概率" },
  statistics: { en: "Statistics", zh: "统计" },
});

const regionLabels: Readonly<Record<string, string>> = Object.freeze({
  "Alexandria, Ptolemaic Egypt": "托勒密埃及·亚历山大里亚",
  "Australia / United States": "澳大利亚 / 美国",
  Austria: "奥地利",
  "Austria / United States": "奥地利 / 美国",
  Canada: "加拿大",
  "Canada / United States": "加拿大 / 美国",
  Denmark: "丹麦",
  England: "英格兰",
  Finland: "芬兰",
  France: "法国",
  "France / United States": "法国 / 美国",
  Germany: "德国",
  "Germany / Denmark": "德国 / 丹麦",
  "Germany / United States": "德国 / 美国",
  "Greece / United States": "希腊 / 美国",
  Hungary: "匈牙利",
  "Hungary / United Kingdom": "匈牙利 / 英国",
  "Hungary / United States": "匈牙利 / 美国",
  India: "印度",
  "India / United States": "印度 / 美国",
  "Italy / France": "意大利 / 法国",
  "Italy / United States": "意大利 / 美国",
  Japan: "日本",
  Netherlands: "荷兰",
  Norway: "挪威",
  Poland: "波兰",
  Prussia: "普鲁士",
  "Russian Empire": "俄罗斯帝国",
  "Russian Empire / Soviet Union": "俄罗斯帝国 / 苏联",
  "Soviet Union": "苏联",
  "Soviet Union / Belgium": "苏联 / 比利时",
  "Soviet Union / France": "苏联 / 法国",
  "Soviet Union / Israel": "苏联 / 以色列",
  "Soviet Union / Russia": "苏联 / 俄罗斯",
  "Soviet Union / United States": "苏联 / 美国",
  Sweden: "瑞典",
  Switzerland: "瑞士",
  "United Kingdom": "英国",
  "United Kingdom / Ireland": "英国 / 爱尔兰",
  "United States": "美国",
});

export interface ProfileApplication {
  readonly text: LocalizedText;
  readonly conceptIds: readonly string[];
}

export interface ProfileSource extends SourceLink {
  readonly conceptIds: readonly string[];
}

export interface DerivedPersonProfile {
  readonly concepts: readonly Concept[];
  readonly categories: readonly ConceptCategory[];
  readonly applications: readonly ProfileApplication[];
  readonly sources: readonly ProfileSource[];
}

function appendReference(
  index: Map<string, { value: LocalizedText; conceptIds: string[] }>,
  key: string,
  value: LocalizedText,
  conceptId: string,
) {
  const existing = index.get(key);
  if (existing) {
    if (!existing.conceptIds.includes(conceptId)) {
      existing.conceptIds.push(conceptId);
    }
    return;
  }
  index.set(key, { value, conceptIds: [conceptId] });
}

/**
 * Builds the reader-facing person profile entirely from canonical concept data.
 * Keeping this derivation in one place prevents contribution, application, and
 * citation claims from drifting away from their full concept entries.
 */
export function derivePersonProfile(
  person: Person,
  conceptIndex: ReadonlyMap<string, Concept>,
): DerivedPersonProfile {
  const namedConcepts = person.concepts
    .map((conceptId) => conceptIndex.get(conceptId))
    .filter((concept): concept is Concept => concept !== undefined);
  const categories = [...new Set(namedConcepts.map((concept) => concept.category))];
  const applicationIndex = new Map<
    string,
    { value: LocalizedText; conceptIds: string[] }
  >();
  const sourceIndex = new Map<
    string,
    { label: string; url: string; conceptIds: string[] }
  >();

  for (const concept of namedConcepts) {
    for (const application of concept.aiApplications) {
      appendReference(
        applicationIndex,
        `${application.en}\u0000${application.zh}`,
        application,
        concept.id,
      );
    }
    for (const source of concept.sourceLinks) {
      const existing = sourceIndex.get(source.url);
      if (existing) {
        if (!existing.conceptIds.includes(concept.id)) {
          existing.conceptIds.push(concept.id);
        }
      } else {
        sourceIndex.set(source.url, {
          ...source,
          conceptIds: [concept.id],
        });
      }
    }
  }

  return {
    concepts: namedConcepts,
    categories,
    applications: [...applicationIndex.values()].map((item) => ({
      text: item.value,
      conceptIds: item.conceptIds,
    })),
    sources: [...sourceIndex.values()],
  };
}

export function formatRegion(
  region: string,
  locale: "en" | "zh",
): string {
  return locale === "zh" ? (regionLabels[region] ?? region) : region;
}
