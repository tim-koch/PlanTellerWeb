import { describe, expect, it } from "vitest";
import {
  createRecipeDeepLink,
  readRecipeShareToken,
} from "../../src/lib/recipe-share";

describe("Rezeptfreigabe", () => {
  it("liest einen Token aus dem Pfad", () => {
    expect(
      readRecipeShareToken(
        new URL("https://www.planteller.de/recipe-share/test-token"),
      ),
    ).toBe("test-token");
  });

  it("bevorzugt einen Token aus der Query", () => {
    const url = new URL(
      "https://www.planteller.de/recipe-share/path-token?token=query-token",
    );
    expect(readRecipeShareToken(url)).toBe("query-token");
  });

  it("behält das Deep-Link-Schema unverändert", () => {
    expect(createRecipeDeepLink("test token")).toBe(
      "planteller://recipe-share?token=test%20token",
    );
  });

  it("behandelt kaputte URL-Kodierung sicher", () => {
    expect(
      readRecipeShareToken(
        new URL("https://www.planteller.de/recipe-share/%E0%A4%A"),
      ),
    ).toBe("");
  });
});
