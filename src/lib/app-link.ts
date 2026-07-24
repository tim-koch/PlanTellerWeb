export const APP_LINK_ROUTES = ["invite", "reset-password"] as const;

export type AppLinkRoute = (typeof APP_LINK_ROUTES)[number];

export function isAppLinkRoute(
  value: string | undefined,
): value is AppLinkRoute {
  return APP_LINK_ROUTES.some((route) => route === value);
}

export function readAppLinkToken(url: URL, route: AppLinkRoute): string {
  const queryToken = url.searchParams.get("token")?.trim();
  if (queryToken) return queryToken;

  const parts = url.pathname.split("/").filter(Boolean);
  const routeIndex = parts.findIndex((part) => part.toLowerCase() === route);
  const pathToken = parts[routeIndex + 1];
  if (!pathToken) return "";

  try {
    return decodeURIComponent(pathToken).trim();
  } catch {
    return "";
  }
}

export function createAppDeepLink(route: AppLinkRoute, token: string): string {
  return `planteller://${route}?token=${encodeURIComponent(token)}`;
}
