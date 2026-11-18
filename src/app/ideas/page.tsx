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

  if (!user) {
    return (
      <p>
        <a href="/api/auth/login?returnTo=%2Fideas">Log in</a> to see the
        ideas you shared.
      </p>
    );
  }

  return (
    <>
      <h1 style={{ marginBottom: 24 }}>My ideas</h1>
      <FeedClientWrapper
        initialFeed={ideas}
        enableInteractions
        user={user}
        emptyMessage="You haven't shared an idea yet. Start with the one you still think about."
      />
    </>
  );
}
