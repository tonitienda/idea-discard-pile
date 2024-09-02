"use server";

import Head from "next/head";
import FeedClientWrapper from "../../components/FeedClientWrapper";

import { getIdeasByUserId } from "../../backend/db";
import { useUser } from "../hooks/use-user";

export default async function Home() {
  const user = await useUser();
  const ideas = user ? await getIdeasByUserId(user.id) : [];

  return (
    <div>
      <Head>
        <title>Aidia Hub - My ideas</title>
        <meta
          name="description"
          content="Share and discover innovative ideas"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <div className="row">
          <FeedClientWrapper initialFeed={ideas} enableInteractions={!!user} />
        </div>
      </main>
    </div>
  );
}
