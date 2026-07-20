export const SITE = {
  name: "PlanTeller",
  url: "https://www.planteller.de",
  publicEmail: "kochbuch_app@outlook.de",
  formEndpoint: "https://formspree.io/f/mojgjzlv",
  appStatus: "closed-beta",
  recipeScheme: "planteller://recipe-share",
} as const;

export type ThemePreference = "system" | "light" | "dark";
export type ContrastPreference = "system" | "standard" | "high";
export type MotionPreference = "system" | "reduced";

export interface DisplaySettings {
  theme: ThemePreference;
  contrast: ContrastPreference;
  motion: MotionPreference;
}

export const DISPLAY_SETTINGS_KEY = "planteller-display-settings";

export const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  theme: "system",
  contrast: "system",
  motion: "system",
};
