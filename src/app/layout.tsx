import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import NavBar from "../components/NavBar";
import { getSession } from "@auth0/nextjs-auth0";
import Landing from "../components/Landing/index";
import LandingNavBar from "../components/Landing/NavBar";

export const metadata: Metadata = {
  title: "Idea DISCARD PILE",
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
          href={`https://bootswatch.com/5/${template}/bootstrap.css`}
        />
      </head>
      <UserProvider>
        <body>
          {user ? <NavBar /> : <LandingNavBar />}
          {user ? (
            <div className="container" style={{ paddingTop: 24 }}>
              {children}
            </div>
          ) : (
            <div className="container" style={{ paddingTop: 60 }}>
              <Landing />
            </div>
          )}
          <Analytics />
        </body>
      </UserProvider>
    </html>
  );
}
