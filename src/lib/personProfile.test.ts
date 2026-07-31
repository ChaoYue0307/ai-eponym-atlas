import { describe, expect, it } from "vitest";

import { conceptsById, people } from "../data/catalog";
import { derivePersonProfile, formatRegion } from "./personProfile";

describe("derivePersonProfile", () => {
  it("builds complete contribution, application, field, and evidence views", () => {
    for (const person of people) {
      const profile = derivePersonProfile(person, conceptsById);

      expect(profile.concepts.map((concept) => concept.id)).toEqual(
        person.concepts,
      );
      expect(profile.categories.length, person.id).toBeGreaterThan(0);
      expect(profile.applications.length, person.id).toBeGreaterThan(0);
      expect(profile.sources.length, person.id).toBeGreaterThanOrEqual(2);
      expect(
        profile.applications.every((item) => item.conceptIds.length > 0),
        person.id,
      ).toBe(true);
      expect(
        profile.sources.every((source) => source.conceptIds.length > 0),
        person.id,
      ).toBe(true);
    }
  });

  it("deduplicates repeated applications and sources while retaining provenance", () => {
    const descartes = people.find((person) => person.id === "rene-descartes");
    expect(descartes).toBeDefined();
    if (!descartes) return;

    const profile = derivePersonProfile(descartes, conceptsById);
    expect(new Set(profile.sources.map((source) => source.url)).size).toBe(
      profile.sources.length,
    );
    expect(
      new Set(
        profile.applications.map(
          (application) => `${application.text.en}\u0000${application.text.zh}`,
        ),
      ).size,
    ).toBe(profile.applications.length);
  });

  it("localizes known regions without changing English labels", () => {
    expect(formatRegion("France", "en")).toBe("France");
    expect(formatRegion("France", "zh")).toBe("法国");
    expect(formatRegion("Unknown region", "zh")).toBe("Unknown region");

    for (const person of people) {
      expect(formatRegion(person.region, "zh"), person.id).not.toBe(
        person.region,
      );
    }
  });
});
