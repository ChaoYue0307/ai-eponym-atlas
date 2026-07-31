import { describe, expect, it } from "vitest";

import { formatLifespan } from "./lifespan";

describe("formatLifespan", () => {
  it("distinguishes living, unknown-date, and missing people", () => {
    expect(
      formatLifespan({ born: "1931", died: null }, "en"),
    ).toBe("1931–present");
    expect(
      formatLifespan({ born: null, died: null }, "zh"),
    ).toBe("生卒年待考");
    expect(
      formatLifespan(
        { born: "1941", died: null, lifeStatus: "missing" },
        "en",
      ),
    ).toBe("1941–missing (see profile)");
  });

  it("keeps a known death year when a birth year is unresolved", () => {
    expect(
      formatLifespan({ born: null, died: "1995" }, "en"),
    ).toBe("?–1995");
  });
});
