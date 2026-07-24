import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Digital Asset Links", () => {
  it("liefert gueltiges JSON ohne Byte Order Mark", () => {
    const content = readFileSync(
      new URL("../../public/.well-known/assetlinks.json", import.meta.url),
      "utf8",
    );

    expect(content.charCodeAt(0)).not.toBe(0xfeff);
    expect(() => JSON.parse(content)).not.toThrow();
  });
});
