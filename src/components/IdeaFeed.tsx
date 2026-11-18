"use client";

import { useState } from "react";
import { Idea, Verdict, VERDICTS } from "../app/api/model";
import styles from "./ideafeed.module.css";

import { IdeaCard } from "./IdeaCard";
import PromptToLoginModal from "./PromptToLoginModal";
import { VERDICT_LABELS } from "./TeardownPanel";

const BUILDING = "building" as const;

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
  // A verdict, or "building" for ideas someone is building.
  const [filter, setFilter] = useState<Verdict | typeof BUILDING | null>(null);

  if (!ideas.length) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  const matches = (idea: Idea, f: Verdict | typeof BUILDING) =>
    f === BUILDING ? !!idea.building : idea.teardown?.verdict === f;
  const count = (f: Verdict | typeof BUILDING) =>
    ideas.filter((idea) => matches(idea, f)).length;
  const verdicts = VERDICTS.filter((v) => count(v) > 0);
  const buildingCount = count(BUILDING);
  const showFilters =
    filterable && (verdicts.length > 1 || buildingCount > 0);
  const visible = filter ? ideas.filter((idea) => matches(idea, filter)) : ideas;

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
            aria-pressed={filter === null}
            onClick={() => setFilter(null)}
          >
            All ideas
          </button>
          {buildingCount > 0 && (
            <button
              type="button"
              className={styles.filter}
              aria-pressed={filter === BUILDING}
              onClick={() => setFilter(BUILDING)}
            >
              Being built <span>{buildingCount}</span>
            </button>
          )}
          {verdicts.map((v) => (
            <button
              type="button"
              key={v}
              className={styles.filter}
              aria-pressed={filter === v}
              onClick={() => setFilter(v)}
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
