import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import NavBar from "../components/NavBar";
import { getSession } from "@auth0/nextjs-auth0";
import Landing from "../components/Landing/index";
import LandingNavBar from "../components/Landing/NavBar";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Aidia Hub - Where ideas connect",
  description: "Discarded ideas that could be usefule to you!",
};

const templates = [
  "lux",
  "materia",
  "minty",
  "pulse",
  "sandstone",
  "solar",
  "superhero",
  "united",
  "yeti",
  "quartz",
  "sketchy",
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = session ? session.user : null;

  //const template = templates[Math.floor(Math.random() * templates.length)];
  const template = "lux";

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href={`https://cdn.jsdelivr.net/npm/bootswatch@4.5.2/dist/${template}/bootstrap.min.css`}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1105071770248849"
          crossOrigin="anonymous"
        ></script>
      </head>
      <UserProvider>
        <body>
          {user ? <NavBar /> : <LandingNavBar />}
          {user ? (
            <div
              className="container"
              style={{ paddingTop: 24, paddingBottom: 48 }}
            >
              {children}
            </div>
          ) : (
            <div className="container" style={{ paddingTop: 60 }}>
              <Landing />
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
