import type { Locale } from "../copy";
import type { Person } from "../types";

/**
 * Missing birth and death years mean that reliable dates were not established.
 * A known birth year with no death year continues to identify a living person.
 */
export function formatLifespan(
  person: Pick<Person, "born" | "died" | "lifeStatus">,
  locale: Locale,
): string {
  if (person.lifeStatus === "missing") {
    const born = person.born ?? "?";
    return locale === "zh"
      ? `${born}–失踪（年份见人物简介）`
      : `${born}–missing (see profile)`;
  }

  if (person.born === null && person.died === null) {
    return locale === "zh" ? "生卒年待考" : "dates not established";
  }

  const born = person.born ?? "?";
  const died = person.died ?? (locale === "zh" ? "至今" : "present");
  return `${born}–${died}`;
}
