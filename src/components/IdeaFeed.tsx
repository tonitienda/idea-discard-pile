"use client";

import { useState } from "react";
import { Idea, Verdict, VERDICTS } from "../app/api/model";
import styles from "./ideafeed.module.css";

import { IdeaCard } from "./IdeaCard";
import PromptToLoginModal from "./PromptToLoginModal";
import { VERDICT_LABELS } from "./TeardownPanel";

interface IdeaFeedProps {
  ideas: Idea[];
  enableInteractions: boolean;
  viewerId?: string;
  openTeardownFor?: string;
  // "page" shows a single idea in full, as on its own page.
  variant?: "feed" | "page";
  // Lets readers narrow the list by teardown verdict.
  filterable?: boolean;
  emptyMessage?: string;
}

export default function IdeaFeed({
  ideas,
  enableInteractions,
  viewerId,
  openTeardownFor,
  variant = "feed",
  filterable = false,
  emptyMessage = "No ideas here yet.",
}: IdeaFeedProps) {
  const [promptToLoginModalOpen, setPromptToLoginModalOpen] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  if (!ideas.length) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  const count = (v: Verdict) =>
    ideas.filter((idea) => idea.teardown?.verdict === v).length;
  const verdicts = VERDICTS.filter((v) => count(v) > 0);
  const showFilters = filterable && verdicts.length > 1;
  const visible = verdict
    ? ideas.filter((idea) => idea.teardown?.verdict === verdict)
    : ideas;

  return (
    <>
      <PromptToLoginModal
        open={promptToLoginModalOpen}
        onClose={() => setPromptToLoginModalOpen(false)}
      />
      {showFilters && (
        <div className={styles.filters} role="group" aria-label="Filter ideas">
          <button
            type="button"
            className={styles.filter}
            aria-pressed={verdict === null}
            onClick={() => setVerdict(null)}
          >
            All ideas
          </button>
          {verdicts.map((v) => (
            <button
              type="button"
              key={v}
              className={styles.filter}
              aria-pressed={verdict === v}
              onClick={() => setVerdict(v)}
            >
              {VERDICT_LABELS[v]} <span>{count(v)}</span>
            </button>
          ))}
        </div>
      )}
      <div className={styles.feed}>
        {visible.map((idea, idx) => (
          <IdeaCard
            idea={idea}
            key={idea.id || idx}
            variant={variant}
            enableInteractions={enableInteractions}
            viewerId={viewerId}
            teardownOpen={idea.id === openTeardownFor}
            onInteractionAttempted={() => {
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
