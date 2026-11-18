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
    <div className="row">
      {!user && (
        <div className="col-lg-12">
          <Hero />
        </div>
      )}
      <FeedClientWrapper
        initialFeed={ideas}
        enableInteractions={!!user}
        user={user}
      />
    </div>
  );
}
