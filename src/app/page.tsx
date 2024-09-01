"use server";

import Head from "next/head";

import FeedClientWrapper from "../components/FeedClientWrapper";
import { getFeed } from "../backend/ideas";
import { getUser } from "../backend/users";
import { useUser } from "./hooks/use-user";

export default async function Home() {
  const user = await useUser();
  const ideas = await getFeed(user?.id);

  return (
    <div>
      <Head>
        <title>Aidia Hub - Feed</title>
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
