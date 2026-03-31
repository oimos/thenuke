export function domainMatches(
  url: string,
  blacklistSet: Set<string>,
): boolean {
  try {
    let hostname = new URL(url).hostname;
    if (hostname.startsWith("www.")) {
      hostname = hostname.slice(4);
    }
    if (blacklistSet.has(hostname)) return true;
    const parts = hostname.split(".");
    for (let i = 1; i < parts.length - 1; i++) {
      if (blacklistSet.has(parts.slice(i).join("."))) return true;
    }
    return false;
  } catch {
    return false;
  }
}
