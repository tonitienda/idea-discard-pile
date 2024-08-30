"use server";

import Head from "next/head";

import FeedClientWrapper from "../components/FeedClientWrapper";
import { getIdeas } from "../backend/db";

export default async function Home() {
  // TODO - Make sure the user is logged in
  const ideas = await getIdeas();

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
