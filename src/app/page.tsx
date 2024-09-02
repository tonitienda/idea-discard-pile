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
    <>
      <Head>
        <title>Aidia Hub - Feed</title>
        <meta
          name="description"
          content="Share and discover innovative ideas"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FeedClientWrapper
        initialFeed={ideas}
        enableInteractions={!!user}
        user={user}
      />
    </>
  );
}
