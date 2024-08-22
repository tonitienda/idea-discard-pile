import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import NavBar from "../components/NavBar";
import { getSession } from "@auth0/nextjs-auth0";
import Landing from "../components/Landing";

export const metadata: Metadata = {
  title: "Idea DISCARD PILE",
  description: "Discarded ideas that could be usefule to you!",
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
          href="https://bootswatch.com/5/sketchy/bootstrap.css"
        />
      </head>
      <UserProvider>
        <body>
          {user && <NavBar />}

          {user ? (
            <div className="container" style={{ paddingTop: 120 }}>
              {children}
            </div>
          ) : (
            <div className="container" style={{ paddingTop: 120 }}>
              <Landing />
            </div>
          )}
          <Analytics />
        </body>
      </UserProvider>
    </html>
  );
}
