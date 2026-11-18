import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import NavBar from "../components/NavBar";
import { getSession } from "@auth0/nextjs-auth0";
import Landing from "../components/Landing/index";
import LandingNavBar from "../components/Landing/NavBar";
import { GoogleAnalytics } from "@next/third-parties/google";
import NotificationsBar from "../components/NotificationsBar";

export const metadata: Metadata = {
  title: "Aidia Hub - Where ideas connect",
  description:
    "Share the ideas you never built, and find ones worth picking up.",
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
          {user ? <NavBar /> : <LandingNavBar />}
          <NotificationsBar />
          {user ? (
            <div
              className="container"
              style={{ paddingTop: 24, paddingBottom: 48 }}
            >
              {children}
            </div>
          ) : (
            <div className="container" style={{ paddingTop: 60 }}>
              <div className="row">
                <Landing />
              </div>
              <div className="row">{children}</div>
            </div>
          )}
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
