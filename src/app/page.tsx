import type { Metadata } from "next";

import FeedClientWrapper from "../components/FeedClientWrapper";
import Hero from "../components/Hero";
import { getIdeas } from "../backend/db";
import { useUser } from "./hooks/use-user";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const user = await useUser();
  const ideas = await getIdeas(user?.id);

  return (
    <>
      {!user && <Hero />}
      <FeedClientWrapper
        initialFeed={ideas}
        enableInteractions={!!user}
        user={user}
        emptyMessage="No ideas here yet. Share the first one."
      />
    </>
  );
}
