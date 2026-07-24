import { describe, expect, it } from "vitest";
import {
  createCollectionDeepLink,
  readCollectionShareToken,
} from "../../src/lib/collection-share";

describe("Buch- und Menüfreigabe", () => {
  it("liest einen Token aus dem Pfad", () => {
    expect(
      readCollectionShareToken(
        new URL("https://www.planteller.de/collection-share/test-token"),
      ),
    ).toBe("test-token");
  });

  it("bevorzugt einen Token aus der Query", () => {
    const url = new URL(
      "https://www.planteller.de/collection-share/path-token?token=query-token",
    );
    expect(readCollectionShareToken(url)).toBe("query-token");
  });

  it("erzeugt den passenden App-Link", () => {
    expect(createCollectionDeepLink("test token")).toBe(
      "planteller://collection-share?token=test%20token",
    );
  });

  it("behandelt kaputte URL-Kodierung sicher", () => {
    expect(
      readCollectionShareToken(
        new URL("https://www.planteller.de/collection-share/%E0%A4%A"),
      ),
    ).toBe("");
  });
});
