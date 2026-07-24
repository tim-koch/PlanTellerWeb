export function readCollectionShareToken(url: URL): string {
  const queryToken = url.searchParams.get("token")?.trim();
  if (queryToken) return queryToken;

  const parts = url.pathname.split("/").filter(Boolean);
  const shareIndex = parts.findIndex(
    (part) => part.toLowerCase() === "collection-share",
  );
  const pathToken = parts[shareIndex + 1];

  if (!pathToken) return "";

  try {
    return decodeURIComponent(pathToken).trim();
  } catch {
    return "";
  }
}

export function createCollectionDeepLink(token: string): string {
  return `planteller://collection-share?token=${encodeURIComponent(token)}`;
}
