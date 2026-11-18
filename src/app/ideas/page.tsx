import type { Metadata } from "next";
import FeedClientWrapper from "../../components/FeedClientWrapper";

import { getIdeasByUserId } from "../../backend/db";
import { useUser } from "../hooks/use-user";

export const metadata: Metadata = {
  title: "My ideas",
  robots: { index: false },
};

export default async function MyIdeas() {
  const user = await useUser();
  const ideas = user ? await getIdeasByUserId(user.id) : [];

  return (
    <div className="row">
      <FeedClientWrapper
        initialFeed={ideas}
        enableInteractions={!!user}
        user={user}
      />
    </div>
  );
}
