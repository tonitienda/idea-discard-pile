// src/app/feed/FeedClientWrapper.tsx
"use client";

import { useState } from "react";
import IdeaFeed from "./IdeaFeed";
import IdeaForm from "./IdeaForm";

export default function FeedClientWrapper({ initialFeed }) {
  const [ideas, setIdeas] = useState(initialFeed);

  // Callback to add a new idea to the feed
  const addIdea = (newIdea) => {
    setIdeas((prevIdeas) => [...prevIdeas, newIdea]);
  };

  return (
    <>
      <div className="col-lg-12">
        <IdeaForm onIdeaAdded={addIdea} />
      </div>
      <div className="col-lg-12">
        <IdeaFeed ideas={ideas} />
      </div>
    </>
  );
}
