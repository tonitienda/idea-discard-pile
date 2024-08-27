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

  useEffect(() => {
    fetch("/api/feed")
      .then((response) => (response.ok ? response.json() : { items: [] }))
      .then((data) => setIdeas(data.items));
  }, []);

  const addIdea = async (newIdea: Partial<Idea>): Promise<void> => {
    const ideaWithDetails: Idea = {
      ...newIdea,
      tags: newIdea.tags || [],
    } as Idea;
    return fetch("/api/ideas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ideaWithDetails),
    })
      .then((response) => response.json())
      .then((data) => fetch(`/api/ideas/${data.id}`))
      .then((response) => (response.ok ? response.json() : null))
      .then((idea) => {
        if (idea) {
          setIdeas((ideas) => [idea, ...ideas]);
        }
      });
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
