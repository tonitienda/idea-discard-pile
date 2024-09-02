// src/app/feed/FeedClientWrapper.tsx
"use client";

import { useState } from "react";
import IdeaFeed from "./IdeaFeed";
import IdeaForm from "./IdeaForm";
import { Idea } from "../app/api/model";

type FeedClientWrapperProps = {
  initialFeed: Idea[];
  enableInteractions: boolean;
};

export default function FeedClientWrapper(props: FeedClientWrapperProps) {
  const { initialFeed, enableInteractions } = props;
  const [ideas, setIdeas] = useState(initialFeed);

  // Callback to add a new idea to the feed
  const addIdea = (newIdea) => {
    setIdeas((prevIdeas) => [...prevIdeas, newIdea]);
  };

  return (
    <>
      {enableInteractions && (
        <div className="col-lg-12">
          <IdeaForm onIdeaAdded={addIdea} />
        </div>
      )}
      <div className="col-lg-12">
        <IdeaFeed ideas={ideas} enableInteractions={enableInteractions} />
      </div>
    </>
  );
}
