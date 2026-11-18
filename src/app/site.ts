// Canonical origin for metadata, the sitemap and robots.txt. Previews keep
// pointing at production so search engines only index the real site.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aidiahub.com";

export const SITE_NAME = "Aidia Hub";

export const SITE_DESCRIPTION =
  "Ideas people never built, with honest teardowns: who already tried them, why they usually fail, and the cheapest way to test them.";
