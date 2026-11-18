// src/app/feed/FeedClientWrapper.tsx
"use client";

import { useState } from "react";
import IdeaFeed from "./IdeaFeed";
import IdeaForm from "./IdeaForm";
import { Idea, User } from "../app/api/model";
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
  const [lastAddedId, setLastAddedId] = useState<string>();

  // Adds a newly shared idea to the top, with its teardown open
  const addIdea = (newIdea: Idea | null) => {
    if (newIdea) {
      setIdeas((prevIdeas) => [newIdea, ...prevIdeas]);
      setLastAddedId(newIdea.id);
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
        <IdeaFeed
          ideas={ideas}
          enableInteractions={enableInteractions}
          viewerId={props.user?.id}
          openTeardownFor={lastAddedId}
        />
      </div>
    </>
  );
}
