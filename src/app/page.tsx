"use client";
// TODO - See how to avoid use client and render in the server

// pages/index.tsx
import { useState, useEffect } from "react";
import Head from "next/head";
import IdeaForm from "../components/IdeaForm";

import IdeaFeed from "../components/IdeaFeed";
import { Idea, User } from "../app/api/model";

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/ideas")
      .then((response) => (response.ok ? response.json() : { items: [] }))
      .then((data) => setIdeas(data.items));
  }, []);

  const addIdea = (newIdea: Partial<Idea>) => {
    if (currentUser) {
      const ideaWithDetails: Idea = {
        ...newIdea,
        id: Date.now().toString(),
        tags: newIdea.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: currentUser,
      } as Idea;
      setIdeas([ideaWithDetails, ...ideas]);
    }
  };

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
          <div className="col-lg-12">
            <IdeaForm onSubmit={addIdea} />
          </div>

          <div className="col-lg-12">
            <IdeaFeed ideas={ideas} />
          </div>
        </div>
      </main>
    </div>
  );
}
