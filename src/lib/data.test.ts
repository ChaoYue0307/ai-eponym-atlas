import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  catalogStats,
  categories,
  concepts,
  conceptsById,
  mediaCatalog,
  people,
  peopleById,
} from "../data/catalog";
import { timelineEvents } from "../data/timeline";
import {
  constellationConceptIds,
  constellationEdges,
  constellationNodes,
  constellationViewBoxes,
  mobileConstellationPositions,
} from "../data/constellation";
import { connectCircleBoundaries } from "./constellationGeometry";
import { buildEgoGraph } from "./graph";
import { layoutNodes, mergeGraphs } from "./graphLayout";

describe("atlas data integrity", () => {
  it("has a substantial catalog with unique ids", () => {
    expect(people.length).toBeGreaterThanOrEqual(100);
    expect(concepts.length).toBeGreaterThanOrEqual(120);
    expect(new Set(people.map((person) => person.id)).size).toBe(people.length);
    expect(new Set(concepts.map((concept) => concept.id)).size).toBe(
      concepts.length,
    );
  });

  it("derives reader-facing coverage totals from the catalog", () => {
    expect(catalogStats.people).toBe(people.length);
    expect(catalogStats.concepts).toBe(concepts.length);
    expect(catalogStats.fields).toBe(categories.length);
    expect(catalogStats.sourceCitations).toBe(
      concepts.reduce(
        (total, concept) => total + concept.sourceLinks.length,
        0,
      ),
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
      expect(concept.sourceLinks.length).toBeGreaterThanOrEqual(2);
      for (const source of concept.sourceLinks) {
        expect(source.label.trim()).not.toBe("");
        expect(source.url).toMatch(/^https?:\/\//);
      }
    }
  });

  it("keeps portrait identity, provenance, licenses, and local files auditable", () => {
    expect(mediaCatalog.profiles.length).toBeGreaterThanOrEqual(110);
    const portraitProfiles = mediaCatalog.profiles.filter(
      (profile) => profile.portrait !== undefined,
    );
    expect(portraitProfiles.length).toBeGreaterThanOrEqual(70);
    expect(
      new Set(mediaCatalog.profiles.map((profile) => profile.personId)).size,
    ).toBe(mediaCatalog.profiles.length);

    const portraitFiles = new Set<string>();
    for (const profile of mediaCatalog.profiles) {
      expect(peopleById.get(profile.personId), profile.personId).toBeDefined();
      if (profile.profileUrl) {
        expect(profile.profileUrl).toMatch(
          /^https:\/\/www\.wikidata\.org\/wiki\/Q\d+$/,
        );
      }

      const portrait = profile.portrait;
      if (!portrait) continue;

      expect(profile.profileUrl, profile.personId).toBeDefined();
      expect(portrait.file).toMatch(
        /^portraits\/[a-z0-9-]+\.(?:jpe?g|png|webp)$/,
      );
      expect(portraitFiles.has(portrait.file), portrait.file).toBe(false);
      portraitFiles.add(portrait.file);
      expect(existsSync(resolve("public", portrait.file)), portrait.file).toBe(
        true,
      );
      expect(portrait.sourceImageUrl).toMatch(
        /^https:\/\/upload\.wikimedia\.org\//,
      );
      expect(portrait.sourceUrl).toMatch(
        /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/,
      );
      expect(portrait.creator.trim()).not.toBe("");
      expect(portrait.license).toMatch(
        /^(?:Public domain|CC0|CC BY(?:-SA)?)/,
      );
      expect(portrait.license).not.toBe("Public domain in the United States");
      expect(portrait.licenseUrl).toMatch(/^https:\/\//);
      expect(portrait.alt.en.trim()).not.toBe("");
      expect(portrait.alt.zh.trim()).not.toBe("");
      if (portrait.cropScale !== undefined) {
        expect(portrait.cropScale).toBeGreaterThanOrEqual(1);
        expect(portrait.cropScale).toBeLessThanOrEqual(2);
      }
      expect(portrait.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("keeps the decorative hero artwork local and lightweight", () => {
    const artwork = resolve(
      "public",
      "illustrations",
      "semantic-strata.webp",
    );
    expect(existsSync(artwork)).toBe(true);
    expect(statSync(artwork).size).toBeLessThanOrEqual(180 * 1024);

    const socialCard = resolve("public", "og-card.jpg");
    expect(existsSync(socialCard)).toBe(true);
    expect(statSync(socialCard).size).toBeLessThanOrEqual(200 * 1024);
    expect([...readFileSync(socialCard).subarray(0, 3)]).toEqual([
      0xff, 0xd8, 0xff,
    ]);
    expect(readFileSync(resolve("index.html"), "utf8")).toContain(
      "/ai-eponym-atlas/og-card.jpg",
    );
    expect(readFileSync(resolve("index.html"), "utf8")).toContain(
      'property="og:image:type" content="image/jpeg"',
    );
  });

  it("keeps README facts, local links, and screenshots current", () => {
    const readme = readFileSync(resolve("README.md"), "utf8");
    const sourceCount = concepts.reduce(
      (total, concept) => total + concept.sourceLinks.length,
      0,
    );
    const portraitCount = mediaCatalog.profiles.filter(
      (profile) => profile.portrait !== undefined,
    ).length;

    expect(readme).toContain(`**${concepts.length}** concepts`);
    expect(readme).toContain(`**${people.length}** people`);
    expect(readme).toContain(`**${sourceCount}** cited sources`);
    expect(readme).toContain(`**${portraitCount}** verified portraits`);
    expect(readme).toContain(`**${categories.length}** fields`);
    expect(readme).toMatch(
      /<a href="https:\/\/chaoyue0307\.github\.io\/ai-eponym-atlas\/">\s*<img src="\.\/public\/og-card\.jpg"/,
    );
    expect(readme).toMatch(
      /\[!\[[^\]]+\]\(\.\/docs\/images\/atlas-overview\.jpg\)\]\(https:\/\/chaoyue0307\.github\.io\/ai-eponym-atlas\/\)/,
    );

    const localReferences = new Set([
      ...[...readme.matchAll(/\]\((\.\/[^)#]+)(?:#[^)]*)?\)/g)].map(
        (match) => match[1],
      ),
      ...[...readme.matchAll(/(?:href|src)="(\.\/[^"#]+)(?:#[^"]*)?"/g)].map(
        (match) => match[1],
      ),
    ]);
    for (const reference of localReferences) {
      expect(reference).toBeDefined();
      if (!reference) continue;
      expect(
        existsSync(resolve(reference.replace(/^\.\//, ""))),
        reference,
      ).toBe(true);
    }

    for (const screenshot of [
      "atlas-overview.jpg",
      "relationship-graph.jpg",
      "person-profile-mobile.jpg",
    ]) {
      const path = resolve("docs", "images", screenshot);
      expect(existsSync(path), screenshot).toBe(true);
      expect(statSync(path).size, screenshot).toBeLessThanOrEqual(200 * 1024);
      expect([...readFileSync(path).subarray(0, 3)], screenshot).toEqual([
        0xff, 0xd8, 0xff,
      ]);
    }
  });

  it("keeps the homepage constellation synchronized with catalog data", () => {
    expect(new Set(constellationConceptIds).size).toBe(
      constellationConceptIds.length,
    );
    for (const conceptId of constellationConceptIds) {
      expect(conceptsById.get(conceptId), conceptId).toBeDefined();
    }
    for (const edge of constellationEdges) {
      expect(constellationConceptIds).toContain(edge.from);
      expect(constellationConceptIds).toContain(edge.to);
      expect(edge.from).not.toBe(edge.to);
    }

    for (const node of constellationNodes) {
      for (const locale of ["en", "zh"] as const) {
        const lines = node.labels[locale];
        expect(lines.length).toBeGreaterThanOrEqual(1);
        expect(lines.length).toBeLessThanOrEqual(2);
        for (const line of lines) {
          expect(line.trim()).toBe(line);
          expect(line).not.toBe("");
          expect(line).not.toContain("\n");
        }
      }

      const mobilePosition = mobileConstellationPositions[node.id];
      expect(mobilePosition, node.id).toBeDefined();
      for (const [layout, position] of [
        ["desktop", node],
        ["mobile", mobilePosition],
      ] as const) {
        const viewBox = constellationViewBoxes[layout];
        expect(position.x - position.r, `${layout}:${node.id}:left`).toBeGreaterThan(0);
        expect(position.y - position.r, `${layout}:${node.id}:top`).toBeGreaterThan(0);
        expect(position.x + position.r, `${layout}:${node.id}:right`).toBeLessThan(
          viewBox.width,
        );
        expect(position.y + position.r, `${layout}:${node.id}:bottom`).toBeLessThan(
          viewBox.height,
        );
      }
    }

    const nodeById = new Map(constellationNodes.map((node) => [node.id, node]));
    for (const edge of constellationEdges) {
      const from = nodeById.get(edge.from)!;
      const to = nodeById.get(edge.to)!;
      const connection = connectCircleBoundaries(from, to);
      expect(Math.hypot(connection.x1 - from.x, connection.y1 - from.y)).toBeCloseTo(
        from.r,
      );
      expect(Math.hypot(connection.x2 - to.x, connection.y2 - to.y)).toBeCloseTo(
        to.r,
      );
    }
  });

  it("keeps every visible two-hop graph layout collision-free", () => {
    for (const concept of concepts) {
      const firstHop = buildEgoGraph(concept.id);
      const secondHops = firstHop.nodes
        .flatMap((node) =>
          node.kind === "concept" && node.conceptId !== concept.id
            ? [buildEgoGraph(node.conceptId)]
            : [],
        );
      const positioned = layoutNodes(
        mergeGraphs([firstHop, ...secondHops], concept.id).nodes,
      );
      const boxes = positioned.map((node) => {
        const [width, height] =
          node.kind === "person"
            ? [104, 104]
            : node.kind === "application"
              ? [124, 86]
              : [136, 84];
        return {
          id: node.id,
          left: node.x - width / 2,
          right: node.x + width / 2,
          top: node.y - height / 2,
          bottom: node.y + height / 2,
        };
      });

      for (let first = 0; first < boxes.length; first += 1) {
        for (let second = first + 1; second < boxes.length; second += 1) {
          const a = boxes[first];
          const b = boxes[second];
          expect(a).toBeDefined();
          expect(b).toBeDefined();
          if (!a || !b) continue;
          const horizontalOverlap =
            Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const verticalOverlap =
            Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          expect(
            horizontalOverlap > 0 && verticalOverlap > 0,
            `${concept.id}: ${a.id} (${a.left},${a.top}) overlaps ${b.id} (${b.left},${b.top})`,
          ).toBe(false);
        }
      }
    }
  });

  it("keeps timeline references valid and chronology stable", () => {
    expect(timelineEvents.length).toBeGreaterThanOrEqual(10);
    expect(timelineEvents.length).toBeLessThanOrEqual(24);
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
