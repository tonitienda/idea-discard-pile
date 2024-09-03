// src/app/feed/FeedClientWrapper.tsx
"use client";

import { useState } from "react";
import IdeaFeed from "./IdeaFeed";
import IdeaForm from "./IdeaForm";
import { Idea, User } from "../app/api/model";
import { format } from "date-fns";
import { StoreProvider } from "easy-peasy";
import { store } from "../store";

type FeedClientWrapperProps = {
  initialFeed: Idea[];
  enableInteractions: boolean;
  user: User;
};

export default function FeedClientWrapper(props: FeedClientWrapperProps) {
  const { initialFeed, enableInteractions } = props;
  const [ideas, setIdeas] = useState(initialFeed);

  // Callback to add a new idea to the feed
  const addIdea = (newIdea) => {
    if (newIdea) {
      setIdeas((prevIdeas) => [newIdea, ...prevIdeas]);
    }
  };

  return (
    <>
      {enableInteractions && (
        <StoreProvider store={store}>
          <div className="col-lg-12">
            <IdeaForm onIdeaAdded={addIdea} />
          </div>
        </StoreProvider>
      )}
      <div className="col-lg-12">
        <IdeaFeed ideas={ideas} enableInteractions={enableInteractions} />
      </div>
    </>
  );
}
