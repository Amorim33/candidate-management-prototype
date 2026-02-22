const LINKEDIN_HOST_PATTERN = /(^|\.)linkedin\.com$/;
const LINKEDIN_PATH_PATTERN = /^\/(in|pub)\//;

export function getSafeLinkedInUrl(rawValue?: string): string | null {
  if (!rawValue) {
    return null;
  }

  const trimmedValue = rawValue.trim();
  if (!trimmedValue) {
    return null;
  }

  const normalizedUrl = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const parsedUrl = new URL(normalizedUrl);
    const hostname = parsedUrl.hostname.toLowerCase();

    if (!LINKEDIN_HOST_PATTERN.test(hostname)) {
      return null;
    }

    if (!LINKEDIN_PATH_PATTERN.test(parsedUrl.pathname)) {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}
