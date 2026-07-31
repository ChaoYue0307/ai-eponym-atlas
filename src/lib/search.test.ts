import { describe, expect, it } from "vitest";

import { searchCatalog } from "./search";

describe("searchCatalog", () => {
  it("searches canonical English and Chinese terms", () => {
    const english = searchCatalog("Fourier transform", "concepts");
    const chinese = searchCatalog("贝叶斯定理", "concepts");

    expect(english[0]?.id).toBe("fourier-transform");
    expect(english[0]?.matchReasons[0]).toContain("Term (exact)");
    expect(chinese[0]?.id).toBe("bayes-theorem");
    expect(chinese[0]?.matchReasons[0]).toContain("Term (exact)");
  });

  it("ranks an exact English alias above incidental matches", () => {
    const results = searchCatalog("KAN", "concepts");

    expect(results[0]?.id).toBe("kolmogorov-arnold-network");
    expect(results[0]?.matchReasons[0]).toContain("Alias (exact)");
  });

  it("searches Chinese function nicknames", () => {
    const results = searchCatalog("曲率矩阵", "concepts");

    expect(results[0]?.id).toBe("hessian-matrix");
    expect(results[0]?.matchReasons.join(" ")).toContain("Function nickname");
  });

  it("searches bilingual questions, intuition, and AI applications", () => {
    const questionResults = searchCatalog("观察到证据后", "concepts");
    const intuitionResults = searchCatalog("勾股定理", "concepts");
    const applicationResults = searchCatalog(
      "embedding retrieval",
      "concepts",
    );

    expect(questionResults.some((result) => result.id === "bayes-theorem")).toBe(
      true,
    );
    expect(
      intuitionResults.some((result) => result.id === "euclidean-distance"),
    ).toBe(true);
    expect(applicationResults[0]?.id).toBe("euclidean-distance");
  });

  it("searches technical tags", () => {
    const results = searchCatalog("loss-landscape", "concepts");

    expect(results[0]?.id).toBe("hessian-matrix");
    expect(results[0]?.matchReasons.join(" ")).toContain("Tag (exact)");
  });

  it("finds people through their own names and associated concepts", () => {
    const byName = searchCatalog("Bayes", "people");
    const byContribution = searchCatalog("马尔可夫决策过程", "people");

    expect(byName[0]?.id).toBe("thomas-bayes");
    expect(byName[0]?.kind).toBe("person");
    expect(byContribution[0]?.id).toBe("andrey-markov");
  });

  it("applies category and application filters to both modes", () => {
    const geometryConcepts = searchCatalog("", "concepts", {
      category: "geometry",
    });
    const roboticsPeople = searchCatalog("", "people", {
      application: "robotics",
    });

    expect(geometryConcepts.length).toBeGreaterThan(0);
    expect(
      geometryConcepts.every((result) =>
        [
          "cartesian-coordinate-system",
          "cartesian-robot-frame",
          "euclidean-distance",
          "riemannian-manifold",
          "minkowski-distance",
        ].includes(result.id),
      ),
    ).toBe(true);
    expect(
      roboticsPeople.some((result) => result.id === "rene-descartes"),
    ).toBe(true);
  });

  it("is deterministic and returns explainable scores", () => {
    const first = searchCatalog("probability uncertainty", "concepts");
    const second = searchCatalog("probability uncertainty", "concepts");

    expect(first).toEqual(second);
    expect(first.length).toBeGreaterThan(0);
    expect(first.every((result) => result.score > 0)).toBe(true);
    expect(first.every((result) => result.matchReasons.length > 0)).toBe(true);
  });
});
