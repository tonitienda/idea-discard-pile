"use client";

import { useState } from "react";
import { Idea } from "../app/api/model";
import styles from "./ideafeed.module.css";

import {
  BsChat,
  BsEmojiLaughing,
  BsEmojiLaughingFill,
  BsHandThumbsDown,
  BsHandThumbsDownFill,
  BsHeart,
  BsHeartFill,
  BsPersonRaisedHand,
} from "react-icons/bs";
import { store } from "../store";

import DateComponent from "./DateComponent";
import {
  INTERACTION_FUNNY,
  INTERACTION_LOVE,
  INTERACTION_NOT_USEFUL,
  INTERACTION_SUPPORT,
} from "../app/api/model";
import { trackIdeaReaction } from "../client/ga";
import TeardownPanel, { VerdictBadge } from "./TeardownPanel";
import BuildingBadge from "./BuildingBadge";

type IdeaCardProps = {
  idea: Idea;
  enableInteractions: boolean;
  onInteractionAttempted?: (ideaId: string, action: string) => void;
  viewerId?: string;
  teardownOpen?: boolean;
  variant?: "feed" | "page";
};

// The quiet reactions. Offering help and discussing get their own labelled
// buttons because they are what starts a collaboration.
const QUIET_REACTIONS = [
  {
    action: INTERACTION_LOVE,
    label: "Love it",
    Icon: BsHeart,
    ActiveIcon: BsHeartFill,
  },
  {
    action: INTERACTION_FUNNY,
    label: "Funny",
    Icon: BsEmojiLaughing,
    ActiveIcon: BsEmojiLaughingFill,
  },
  {
    action: INTERACTION_NOT_USEFUL,
    label: "Not useful",
    Icon: BsHandThumbsDown,
    ActiveIcon: BsHandThumbsDownFill,
  },
];

export function IdeaCard({
  idea,
  enableInteractions,
  onInteractionAttempted,
  viewerId,
  teardownOpen,
  variant = "feed",
}: IdeaCardProps) {
  // The viewer's changes since the page loaded, by reaction.
  const [changes, setChanges] = useState<{ [action: string]: boolean }>({});

  const isActive = (action: string) =>
    changes[action] ?? !!idea.myReactions[action];

  const countOf = (action: string) => {
    const before = !!idea.myReactions[action];
    const now = isActive(action);
    return (idea.reactions[action] || 0) + (now === before ? 0 : now ? 1 : -1);
  };

  const handleAction = async (action: string) => {
    if (onInteractionAttempted) {
      onInteractionAttempted(idea.id, action);
    }
    if (!enableInteractions) {
      return;
    }

    if (isActive(action)) {
      setChanges((prev) => ({ ...prev, [action]: false }));
      trackIdeaReaction(idea.id, action, "disabled");

      await fetch(`/api/ideas/${idea.id}/reactions/${action}`, {
        method: "DELETE",
      });
      return;
    }

    setChanges((prev) => ({ ...prev, [action]: true }));
    trackIdeaReaction(idea.id, action, "enabled");

    const res = await fetch(`/api/ideas/${idea.id}/reactions/${action}`, {
      method: "POST",
    });

    if (
      res.ok &&
      action === INTERACTION_SUPPORT &&
      viewerId !== idea.owner.id
    ) {
      store.getActions().addNotification({
        level: "success",
        message: `We let ${idea.owner.handle} know. <a href="/ideas/${idea.slug}#comments">Add a comment</a> to say how you can help.`,
      });
    }
  };

  const isPage = variant === "page";
  const Title = isPage ? "h1" : "h2";
  const helping = isActive(INTERACTION_SUPPORT);
  const helpCount = countOf(INTERACTION_SUPPORT);

  return (
    <article className={`${styles.idea} ${isPage ? styles.page : ""}`}>
      {idea.isFlagged && (
        <p className={styles.flagNote}>
          This idea was flagged as spam or inappropriate, so it isn&apos;t
          shown in the public feed.
        </p>
      )}
      <header className={styles.header}>
        <img src={idea.owner.picture} alt="" className={styles.avatar} />
        <span className={styles.handle}>{idea.owner.handle}</span>
        <span className={styles.meta}>
          <DateComponent date={new Date(idea.createdAt)} />
        </span>
        {(idea.building || (idea.teardown && !idea.isFlagged)) && (
          <span className={styles.badges}>
            {idea.building && <BuildingBadge />}
            {idea.teardown && !idea.isFlagged && (
              <VerdictBadge verdict={idea.teardown.verdict} />
            )}
          </span>
        )}
      </header>

      <Title className={styles.title}>
        {isPage ? (
          idea.title
        ) : (
          <a href={`/ideas/${idea.slug}`} className={styles.titleLink}>
            {idea.title}
          </a>
        )}
      </Title>
      <p className={styles.description}>{idea.description}</p>

      {idea.tags.length > 0 && (
        <ul className={styles.tags}>
          {idea.tags.map((tag, index) => (
            <li key={index}>#{tag}</li>
          ))}
        </ul>
      )}

      {!idea.isFlagged && (
        <TeardownPanel
          ideaId={idea.id}
          teardown={idea.teardown}
          canGenerate={!!viewerId && viewerId === idea.owner.id}
          defaultOpen={teardownOpen}
        />
      )}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => handleAction(INTERACTION_SUPPORT)}
          className={`${styles.action} ${helping ? styles.actionActive : ""}`}
          aria-pressed={helping}
        >
          <BsPersonRaisedHand aria-hidden="true" />
          {helping ? "You offered to help" : "I can help"}
          {helpCount > 0 && <span className={styles.count}>{helpCount}</span>}
        </button>
        {idea.commentCount !== undefined && (
          <a
            href={isPage ? "#comments" : `/ideas/${idea.slug}#comments`}
            className={styles.action}
          >
            <BsChat aria-hidden="true" />
            Discuss
            {idea.commentCount > 0 && (
              <span className={styles.count}>{idea.commentCount}</span>
            )}
          </a>
        )}

        <div className={styles.reactions}>
          {QUIET_REACTIONS.map(({ action, label, Icon, ActiveIcon }) => {
            const active = isActive(action);
            return (
              <button
                type="button"
                key={action}
                onClick={() => handleAction(action)}
                className={`${styles.reaction} ${
                  active ? styles.reactionActive : ""
                }`}
                aria-pressed={active}
                aria-label={label}
                title={label}
              >
                {active ? <ActiveIcon /> : <Icon />}
                <span>{countOf(action)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
