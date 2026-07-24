import { describe, expect, it } from "vitest";
import {
  createAppDeepLink,
  isAppLinkRoute,
  readAppLinkToken,
} from "../../src/lib/app-link";

describe("Einladungs- und Passwortlinks", () => {
  it("liest Codes aus Query und Pfad", () => {
    expect(
      readAppLinkToken(
        new URL("https://www.planteller.de/invite?token=haushalt"),
        "invite",
      ),
    ).toBe("haushalt");
    expect(
      readAppLinkToken(
        new URL("https://www.planteller.de/reset-password/123456"),
        "reset-password",
      ),
    ).toBe("123456");
  });

  it("erzeugt kodierte App-Links", () => {
    expect(createAppDeepLink("invite", "test token")).toBe(
      "planteller://invite?token=test%20token",
    );
    expect(createAppDeepLink("reset-password", "123456")).toBe(
      "planteller://reset-password?token=123456",
    );
  });

  it("akzeptiert nur bekannte App-Routen", () => {
    expect(isAppLinkRoute("invite")).toBe(true);
    expect(isAppLinkRoute("reset-password")).toBe(true);
    expect(isAppLinkRoute("unbekannt")).toBe(false);
  });

  it("behandelt fehlende und kaputte Codes sicher", () => {
    expect(
      readAppLinkToken(new URL("https://www.planteller.de/invite"), "invite"),
    ).toBe("");
    expect(
      readAppLinkToken(
        new URL("https://www.planteller.de/reset-password/%E0%A4%A"),
        "reset-password",
      ),
    ).toBe("");
  });
});
