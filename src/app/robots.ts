import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /ideas$ is the private "My ideas" page; /ideas/<slug> stays crawlable.
      disallow: ["/api/", "/admin", "/profile", "/ideas$"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
