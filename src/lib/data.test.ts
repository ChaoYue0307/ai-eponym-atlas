import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import katex from "katex";
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
import { learningPaths } from "../data/learningPaths";
import {
  constellationConceptIds,
  constellationEdges,
  constellationNodes,
  constellationViewBoxes,
  mobileConstellationPositions,
} from "../data/constellation";
import { connectCircleBoundaries } from "./constellationGeometry";
import { buildEgoGraph } from "./graph";
import {
  graphNodeVisualBounds,
  layoutNodes,
  mergeGraphs,
  routeGraphEdge,
} from "./graphLayout";
import { conceptCountDistribution } from "./personConceptStats";

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
    expect(catalogStats.personConceptLinks).toBe(
      people.reduce((total, person) => total + person.concepts.length, 0),
    );
    expect(catalogStats.sharedConcepts).toBe(
      concepts.filter((concept) => concept.personIds.length > 1).length,
    );
    expect(catalogStats.singleConceptPeople + catalogStats.multiConceptPeople).toBe(
      people.length,
    );
    expect(catalogStats.fields).toBe(categories.length);
    expect(catalogStats.verifiedPortraits).toBe(
      people.filter((person) => person.portrait !== undefined).length,
    );
    expect(catalogStats.portraitFallbacks).toBe(
      people.filter((person) => person.portrait === undefined).length,
    );
    expect(catalogStats.sourceCitations).toBe(
      concepts.reduce(
        (total, concept) => total + concept.sourceLinks.length,
        0,
      ),
    );
    expect(catalogStats.uniqueSources).toBe(
      new Set(
        concepts.flatMap((concept) =>
          concept.sourceLinks.map((source) => source.url),
        ),
      ).size,
    );
  });

  it("keeps every learning path ordered, distinct, and connected to the catalog", () => {
    expect(learningPaths.length).toBeGreaterThanOrEqual(4);
    expect(new Set(learningPaths.map((path) => path.id)).size).toBe(
      learningPaths.length,
    );
    for (const path of learningPaths) {
      expect(path.title.en.trim()).not.toBe("");
      expect(path.title.zh.trim()).not.toBe("");
      expect(path.description.en.trim()).not.toBe("");
      expect(path.description.zh.trim()).not.toBe("");
      expect(path.conceptIds.length).toBeGreaterThanOrEqual(4);
      expect(new Set(path.conceptIds).size).toBe(path.conceptIds.length);
      for (const conceptId of path.conceptIds) {
        expect(conceptsById.get(conceptId), `${path.id} -> ${conceptId}`).toBeDefined();
      }
    }
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

  it("has complete localized reader-facing fields", () => {
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

  it("renders every catalog formula with strict KaTeX parsing", () => {
    for (const concept of concepts) {
      const parts = concept.formalDefinition.split("$");
      expect(parts.length % 2, `${concept.id}: balanced math delimiters`).toBe(1);
      for (let index = 1; index < parts.length; index += 2) {
        expect(() =>
          katex.renderToString(parts[index], {
            throwOnError: true,
            output: "htmlAndMathml",
          }), `${concept.id}: ${parts[index]}`).not.toThrow();
      }
    }
  });

  it("keeps portrait identity, provenance, licenses, and local files auditable", () => {
    expect(mediaCatalog.profiles).toHaveLength(people.length);
    const portraitProfiles = mediaCatalog.profiles.filter(
      (profile) => profile.portrait !== undefined,
    );
    expect(portraitProfiles.length).toBeGreaterThanOrEqual(70);
    expect(
      new Set(mediaCatalog.profiles.map((profile) => profile.personId)).size,
    ).toBe(mediaCatalog.profiles.length);
    expect(new Set(mediaCatalog.profiles.map((profile) => profile.personId))).toEqual(
      new Set(people.map((person) => person.id)),
    );

    const acceptedLicenses = new Set([
      "Public domain",
      "CC0",
      "CC0 1.0",
      "CC BY 1.0",
      "CC BY 2.0",
      "CC BY 2.5",
      "CC BY 3.0",
      "CC BY 4.0",
      "CC BY-SA 1.0",
      "CC BY-SA 2.0",
      "CC BY-SA 2.0 DE",
      "CC BY-SA 2.5",
      "CC BY-SA 3.0",
      "CC BY-SA 4.0",
    ]);

    const portraitFiles = new Set<string>();
    const profileUrls = new Set<string>();
    const sourceUrls = new Set<string>();
    for (const profile of mediaCatalog.profiles) {
      expect(peopleById.get(profile.personId), profile.personId).toBeDefined();
      if (profile.profileUrl) {
        expect(profile.profileUrl).toMatch(
          /^https:\/\/www\.wikidata\.org\/wiki\/Q\d+$/,
        );
        expect(profileUrls.has(profile.profileUrl), profile.profileUrl).toBe(false);
        profileUrls.add(profile.profileUrl);
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
      expect(sourceUrls.has(portrait.sourceUrl), portrait.sourceUrl).toBe(false);
      sourceUrls.add(portrait.sourceUrl);
      expect(portrait.creator.trim()).not.toBe("");
      expect(acceptedLicenses.has(portrait.license), portrait.license).toBe(true);
      expect(portrait.license).not.toMatch(/(?:-NC|-ND)/);
      expect(portrait.licenseUrl).toMatch(/^https:\/\//);
      expect(portrait.alt.en.trim()).not.toBe("");
      expect(portrait.alt.zh.trim()).not.toBe("");
      if (portrait.cropScale !== undefined) {
        expect(portrait.cropScale).toBeGreaterThanOrEqual(1);
        expect(portrait.cropScale).toBeLessThanOrEqual(2);
      }
      if (portrait.objectPosition !== undefined) {
        expect(portrait.objectPosition).toMatch(
          /^(?:(?:left|center|right|\d+(?:\.\d+)?%)\s+(?:top|center|bottom|\d+(?:\.\d+)?%))$/,
        );
      }
      expect(statSync(resolve("public", portrait.file)).size).toBeLessThanOrEqual(
        200 * 1024,
      );
      expect(portrait.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }

    const checkedInPortraits = new Set(
      readdirSync(resolve("public", "portraits")).map(
        (fileName) => `portraits/${fileName}`,
      ),
    );
    expect(checkedInPortraits).toEqual(portraitFiles);
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
    expect(readme).toContain(
      `**${catalogStats.personConceptLinks}** person–concept links`,
    );
    expect(readme).toContain(
      `**${people.length} people + ${catalogStats.additionalPersonLinks} additional concept links = ${catalogStats.personConceptLinks} person–concept links**`,
    );
    expect(readme).toContain(`**${sourceCount}** citation links`);
    expect(readme).toContain(`**${catalogStats.uniqueSources}** unique source URLs`);
    expect(readme).toContain(`**${portraitCount}** verified portraits`);
    expect(readme).toContain(`**${categories.length}** fields`);
    expect(readme).toMatch(
      /<a href="https:\/\/chaoyue0307\.github\.io\/ai-eponym-atlas\/">\s*<img src="\.\/public\/og-card\.jpg"/,
    );
    expect(readme).toMatch(
      /\[!\[[^\]]+\]\(\.\/docs\/images\/atlas-overview\.jpg\)\]\(https:\/\/chaoyue0307\.github\.io\/ai-eponym-atlas\/\)/,
    );
    expect(readme).toMatch(
      /\[!\[[^\]]+\]\(\.\/docs\/images\/people-concept-ranking\.jpg\)\]\(https:\/\/chaoyue0307\.github\.io\/ai-eponym-atlas\/#\/atlas\?view=people&layout=ranking\)/,
    );

    const coverage = readFileSync(resolve("docs/COVERAGE.md"), "utf8");
    const peopleWith = (conceptCount: number) =>
      conceptCountDistribution.find((bin) => bin.conceptCount === conceptCount)
        ?.peopleCount ?? 0;
    expect(coverage).toContain(
      `**${catalogStats.personConceptLinks} person–concept links** across ${people.length} people and ${concepts.length}`,
    );
    expect(coverage).toContain(
      `**${peopleWith(1)} people have one catalogued concept, ${peopleWith(2)} have\ntwo, ${peopleWith(3)} have three, ${peopleWith(4)} have four, and ${peopleWith(5)} has five.**`,
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
      "learning-paths.jpg",
      "relationship-graph.jpg",
      "person-profile-mobile.jpg",
      "people-concept-ranking.jpg",
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
      const firstHop = buildEgoGraph(concept.id, {
        maxRelatedConcepts: 6,
        maxApplications: 2,
      });
      const secondHops = firstHop.nodes
        .flatMap((node) =>
          node.kind === "concept" && node.conceptId !== concept.id
            ? [
                buildEgoGraph(node.conceptId, {
                  includePeople: false,
                  includeApplications: false,
                  maxRelatedConcepts: 2,
                }),
              ]
            : [],
        );
      const graph = mergeGraphs([firstHop, ...secondHops], concept.id);
      const positioned = layoutNodes(graph.nodes, graph.edges);
      const boxes = positioned.map((node) => {
        const bounds = graphNodeVisualBounds(node);
        return {
          id: node.id,
          left: node.x + bounds.left,
          right: node.x + bounds.right,
          top: node.y + bounds.top,
          bottom: node.y + bounds.bottom,
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

  it("routes graph edges clear of unrelated node footprints", () => {
    const segmentHitsBox = (
      start: { x: number; y: number },
      end: { x: number; y: number },
      box: { left: number; right: number; top: number; bottom: number },
    ) => {
      const steps = 160;
      for (let index = 1; index < steps; index += 1) {
        const ratio = index / steps;
        const x = start.x + (end.x - start.x) * ratio;
        const y = start.y + (end.y - start.y) * ratio;
        if (x > box.left && x < box.right && y > box.top && y < box.bottom) {
          return true;
        }
      }
      return false;
    };

    for (const concept of concepts) {
      const firstHop = buildEgoGraph(concept.id, {
        maxRelatedConcepts: 6,
        maxApplications: 2,
      });
      const secondHops = firstHop.nodes.flatMap((node) =>
        node.kind === "concept" && node.conceptId !== concept.id
          ? [
              buildEgoGraph(node.conceptId, {
                includePeople: false,
                includeApplications: false,
                maxRelatedConcepts: 2,
              }),
            ]
          : [],
      );
      const graph = mergeGraphs([firstHop, ...secondHops], concept.id);
      const positioned = layoutNodes(graph.nodes, graph.edges);
      const byId = new Map(positioned.map((node) => [node.id, node]));

      graph.edges.forEach((edge) => {
        const start = byId.get(edge.source);
        const end = byId.get(edge.target);
        expect(start).toBeDefined();
        expect(end).toBeDefined();
        if (!start || !end) return;
        const route = routeGraphEdge(start, end, positioned);
        positioned.forEach((node) => {
          if (node.id === start.id || node.id === end.id) return;
          const bounds = graphNodeVisualBounds(node);
          const box = {
            left: node.x + bounds.left,
            right: node.x + bounds.right,
            top: node.y + bounds.top,
            bottom: node.y + bounds.bottom,
          };
          for (let index = 1; index < route.length; index += 1) {
            expect(
              segmentHitsBox(route[index - 1]!, route[index]!, box),
              `${concept.id}: ${edge.source} → ${edge.target} crosses ${node.id}; route=${JSON.stringify(route)}`,
            ).toBe(false);
          }
        });
      });
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
