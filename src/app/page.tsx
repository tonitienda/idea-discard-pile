"use server";

import Head from "next/head";

import FeedClientWrapper from "../components/FeedClientWrapper";

export default async function Home() {
  const data = await fetch(`${process.env.BASE_URL}/api/feed`);

  const json = await data.json();
  const ideas = json.items;

  return (
    <div>
      <Head>
        <title>A Pile of Ideas</title>
        <meta
          name="description"
          content="Share and discover innovative ideas"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <div className="row">
          <FeedClientWrapper initialFeed={ideas} />
        </div>
      </main>
    </div>
  );
}
