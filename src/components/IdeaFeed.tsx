"use client";

import { Idea } from "../app/api/model";
import styles from "./ideafeed.module.css";

import { IdeaCard } from "./IdeaCard";
import PromptToLoginModal from "./PromptToLoginModal";
import { useState } from "react";

interface IdeaFeedProps {
  ideas: Idea[];
  enableInteractions: boolean;
  viewerId?: string;
  openTeardownFor?: string;
}

export default function IdeaFeed({
  ideas,
  enableInteractions,
  viewerId,
  openTeardownFor,
}: IdeaFeedProps) {
  const [promptToLoginModalOpen, setPromptToLoginModalOpen] = useState(false);

  if (!ideas.length) {
    return (
      <div className={styles.feed}>
        <h3>
          No ideas found
          <small className="text-body-secondary">Create your first idea!</small>
        </h3>
      </div>
    );
  }

  return (
    <>
      <PromptToLoginModal open={promptToLoginModalOpen} />
      <div className={styles.feed}>
        {ideas.map((idea, idx) => (
          <IdeaCard
            idea={idea}
            key={idea.id || idx}
            enableInteractions={enableInteractions}
            viewerId={viewerId}
            teardownOpen={idea.id === openTeardownFor}
            onInteractionAttempted={(ideaId, action) => {
              if (!enableInteractions) {
                setPromptToLoginModalOpen(true);
              }
            }}
          />
        ))}
      </div>
    </>
  );
}
