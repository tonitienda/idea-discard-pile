import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import NavBar from "../components/NavBar";
import { getSession } from "@auth0/nextjs-auth0";
import LoggedOutNavBar from "../components/LoggedOutNavBar";
import { GoogleAnalytics } from "@next/third-parties/google";
import NotificationsBar from "../components/NotificationsBar";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - The ideas people never built`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: { siteName: SITE_NAME, type: "website" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = session ? session.user : null;

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootswatch@4.5.2/dist/lux/bootstrap.min.css"
        />
      </head>
      <UserProvider>
        <body>
          {user ? <NavBar /> : <LoggedOutNavBar />}
          <NotificationsBar />
          <div
            className="container"
            style={{ paddingTop: 24, paddingBottom: 48 }}
          >
            {children}
          </div>
          <Analytics />

          {
            // Google tag (gtag.js)
          }
          <GoogleAnalytics gaId="G-2KK1VCX2DJ" />
        </body>
      </UserProvider>
    </html>
  );
}
