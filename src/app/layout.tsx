import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Idea DISCARD PILE",
  description: "Discarded ideas that could be usefule to you!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://bootswatch.com/5/sketchy/bootstrap.css"
        />
      </head>
      <body style={{ paddingTop: 120 }}>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
