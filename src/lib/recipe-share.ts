export function readRecipeShareToken(url: URL): string {
  const queryToken = url.searchParams.get("token")?.trim();
  if (queryToken) return queryToken;

  const parts = url.pathname.split("/").filter(Boolean);
  const shareIndex = parts.findIndex(
    (part) => part.toLowerCase() === "recipe-share",
  );
  const pathToken = parts[shareIndex + 1];

  if (!pathToken) return "";

  try {
    return decodeURIComponent(pathToken).trim();
  } catch {
    return "";
  }
}

export function createRecipeDeepLink(token: string): string {
  return `planteller://recipe-share?token=${encodeURIComponent(token)}`;
}
