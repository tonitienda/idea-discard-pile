import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { GoogleAnalytics } from "@next/third-parties/google";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import NotificationsBar from "../components/NotificationsBar";
import { useUser } from "./hooks/use-user";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";
import "./globals.css";

const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - The ideas people never built`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: { siteName: SITE_NAME, type: "website" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6efdf" },
    { media: "(prefers-color-scheme: dark)", color: "#17191d" },
  ],
};

// Applies a saved theme before first paint. Without a saved choice the CSS
// follows the system setting.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await useUser();

  return (
    <html
      lang="en"
      className={`${body.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <UserProvider>
        <body>
          <NavBar user={user} />
          <NotificationsBar />
          <main className="page">{children}</main>
          <Footer />
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
