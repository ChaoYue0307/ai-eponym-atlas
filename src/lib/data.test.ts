import { describe, expect, it } from "vitest";

import {
  categories,
  concepts,
  conceptsById,
  people,
  peopleById,
} from "../data/catalog";
import { timelineEvents } from "../data/timeline";
import { buildEgoGraph } from "./graph";

describe("atlas data integrity", () => {
  it("has a substantial catalog with unique ids", () => {
    expect(people.length).toBeGreaterThanOrEqual(50);
    expect(concepts.length).toBeGreaterThanOrEqual(60);
    expect(new Set(people.map((person) => person.id)).size).toBe(people.length);
    expect(new Set(concepts.map((concept) => concept.id)).size).toBe(
      concepts.length,
    );
  });

  it("keeps person/concept references bidirectional", () => {
    for (const person of people) {
      for (const conceptId of person.concepts) {
        const concept = conceptsById.get(conceptId);
        expect(concept, `${person.id} -> ${conceptId}`).toBeDefined();
        expect(concept?.personIds).toContain(person.id);
      }
    }

    for (const concept of concepts) {
      expect(concept.personIds.length).toBeGreaterThan(0);
      for (const personId of concept.personIds) {
        const person = peopleById.get(personId);
        expect(person, `${concept.id} -> ${personId}`).toBeDefined();
        expect(person?.concepts).toContain(concept.id);
      }
    }
  });

  it("contains no dangling related-concept references", () => {
    for (const concept of concepts) {
      for (const relatedId of concept.relatedConceptIds) {
        expect(
          conceptsById.get(relatedId),
          `${concept.id} -> ${relatedId}`,
        ).toBeDefined();
      }
    }
  });

  it("renders related-concept references as navigable in both directions", () => {
    for (const concept of concepts) {
      for (const relatedId of concept.relatedConceptIds) {
        const reverseGraph = buildEgoGraph(relatedId, {
          includePeople: false,
          includeApplications: false,
        });
        expect(
          reverseGraph.nodes.some(
            (node) =>
              node.kind === "concept" && node.conceptId === concept.id,
          ),
          `${concept.id} should remain visible when focusing ${relatedId}`,
        ).toBe(true);
      }
    }
  });

  it("has complete bilingual reader-facing fields", () => {
    for (const concept of concepts) {
      expect(concept.term.trim()).not.toBe("");
      expect(concept.zhTerm.trim()).not.toBe("");
      expect(concept.functionNickname.en.trim()).not.toBe("");
      expect(concept.functionNickname.zh.trim()).not.toBe("");
      expect(concept.question.en.trim()).not.toBe("");
      expect(concept.question.zh.trim()).not.toBe("");
      expect(concept.intuition.en.trim()).not.toBe("");
      expect(concept.intuition.zh.trim()).not.toBe("");
      expect(concept.aiApplications.length).toBeGreaterThan(0);
      expect(categories).toContain(concept.category);
      expect(concept.sourceLinks.length).toBeGreaterThan(0);
      for (const source of concept.sourceLinks) {
        expect(source.label.trim()).not.toBe("");
        expect(source.url).toMatch(/^https?:\/\//);
      }
    }
  });

  it("keeps timeline references valid and chronology stable", () => {
    expect(timelineEvents.length).toBeGreaterThanOrEqual(10);
    expect(timelineEvents.length).toBeLessThanOrEqual(14);
    expect(new Set(timelineEvents.map((event) => event.kind))).toEqual(
      new Set(["person", "publication", "naming", "ai-adoption"]),
    );

    for (let index = 0; index < timelineEvents.length; index += 1) {
      const event = timelineEvents[index];
      expect(event).toBeDefined();
      if (event === undefined) {
        continue;
      }

      expect(event.title.en.trim()).not.toBe("");
      expect(event.title.zh.trim()).not.toBe("");
      expect(event.description.en.trim()).not.toBe("");
      expect(event.description.zh.trim()).not.toBe("");

      if (index > 0) {
        expect(event.sortYear).toBeGreaterThanOrEqual(
          timelineEvents[index - 1]?.sortYear ?? Number.NEGATIVE_INFINITY,
        );
      }
      for (const personId of event.personIds) {
        expect(
          peopleById.get(personId),
          `${event.id} -> ${personId}`,
        ).toBeDefined();
      }
      for (const conceptId of event.conceptIds) {
        expect(
          conceptsById.get(conceptId),
          `${event.id} -> ${conceptId}`,
        ).toBeDefined();
      }
    }
  });
});

describe("one-hop ego graph", () => {
  it("includes semantic person, concept, and application neighbors", () => {
    const graph = buildEgoGraph("hessian-matrix");
    const focusId = "concept:hessian-matrix";

    expect(graph.nodes.find((node) => node.id === focusId)?.isFocus).toBe(true);
    expect(graph.nodes.some((node) => node.kind === "person")).toBe(true);
    expect(graph.nodes.some((node) => node.kind === "concept" && !node.isFocus)).toBe(
      true,
    );
    expect(graph.nodes.some((node) => node.kind === "application")).toBe(true);
    expect(new Set(graph.edges.map((edge) => edge.relation))).toEqual(
      new Set(["named-after", "related-to", "applied-in"]),
    );
    expect(
      graph.edges.every(
        (edge) => edge.source === focusId || edge.target === focusId,
      ),
    ).toBe(true);
  });

  it("supports compact options and rejects unknown ids", () => {
    const graph = buildEgoGraph("bayes-theorem", {
      includeRelatedConcepts: false,
      maxApplications: 1,
    });

    expect(
      graph.nodes.filter((node) => node.kind === "application"),
    ).toHaveLength(1);
    expect(graph.edges.some((edge) => edge.relation === "related-to")).toBe(
      false,
    );
    expect(() => buildEgoGraph("not-a-real-concept")).toThrow(RangeError);
  });
});
