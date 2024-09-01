"use client";

import { useState } from "react";
import { Idea } from "../app/api/model";
import styles from "./ideafeed.module.css";

import {
  BsHearts,
  BsHeart,
  BsEmojiLaughing,
  BsEmojiLaughingFill,
  BsPerson,
  BsHeartbreak,
  BsHeartbreakFill,
} from "react-icons/bs";
import { MdPersonAdd } from "react-icons/md";

import DateComponent from "./DateComponent";
import {
  INTERACTION_FUNNY,
  INTERACTION_LOVE,
  INTERACTION_NOT_USEFUL,
  INTERACTION_SUPPORT,
} from "../app/api/model";
import { trackIdeaReaction } from "../client/ga";

type IdeaCardProps = {
  idea: Idea;
};

export function IdeaCard({ idea }: IdeaCardProps) {
  const [reactions, setReactions] = useState<{
    [key: string]: { [key: string]: boolean };
  }>({});

  const hasDeletedReaction = (ideaId: string, action: string) => {
    return reactions[ideaId] && reactions[ideaId][action] === false;
  };

  const hasActiveReaction = (idea: Idea, action: string) => {
    return (
      !hasDeletedReaction(idea.id, action) &&
      ((reactions[idea.id] && reactions[idea.id][action]) ||
        idea.myReactions[action])
    );
  };

  const hasReactions = (ideaId: string, action: string) => {
    return (
      reactions[ideaId] &&
      reactions[ideaId] != undefined &&
      reactions[ideaId][action]
    );
  };

  const hasCancelledReactions = (ideaId: string, action: string) => {
    return reactions[ideaId] && reactions[ideaId][action] === false;
  };

  const getInteractionCount = (idea: Idea, action: string) => {
    const addition = idea.myReactions[action]
      ? hasCancelledReactions(idea.id, action)
        ? -1
        : 0
      : hasReactions(idea.id, action)
      ? 1
      : 0;
    return (idea.reactions[action] || 0) + addition;
  };

  const hasLove = (idea: Idea) => {
    return hasActiveReaction(idea, INTERACTION_LOVE);
  };

  const getLoveCount = (idea: Idea) => {
    return getInteractionCount(idea, INTERACTION_LOVE);
  };

  const hasSupport = (idea: Idea) => {
    return hasActiveReaction(idea, INTERACTION_SUPPORT);
  };

  const getSupportCount = (idea: Idea) => {
    return getInteractionCount(idea, INTERACTION_SUPPORT);
  };

  const hasNotUseful = (idea: Idea) => {
    return hasActiveReaction(idea, INTERACTION_NOT_USEFUL);
  };

  const getNotUsefulCount = (idea: Idea) => {
    return getInteractionCount(idea, INTERACTION_NOT_USEFUL);
  };

  const hasFunny = (idea: Idea) => {
    return hasActiveReaction(idea, INTERACTION_FUNNY);
  };

  const getFunnyCount = (idea: Idea) => {
    return getInteractionCount(idea, INTERACTION_FUNNY);
  };

  const handleAction = async (idea: Idea, action: string) => {
    if (hasActiveReaction(idea, action)) {
      setReactions((prevReactions) => {
        const ideaReactions = prevReactions[idea.id] || {};
        const newReactions = {
          ...prevReactions,
          [idea.id]: {
            ...ideaReactions,
            [action]: false,
          },
        };

        return newReactions;
      });
      trackIdeaReaction(idea.id, action, "disabled");

      await fetch(`/api/ideas/${idea.id}/reactions/${action}`, {
        method: "DELETE",
      });

      return;
    }

    setReactions((prevReactions) => {
      const ideaReactions = prevReactions[idea.id] || {};

      const newReactions = {
        ...prevReactions,
        [idea.id]: {
          ...ideaReactions,
          [action]: true,
        },
      };

      return newReactions;
    });
    trackIdeaReaction(idea.id, action, "enabled");

    await fetch(`/api/ideas/${idea.id}/reactions/${action}`, {
      method: "POST",
    });
  };

  return (
    <div
      key={idea.id}
      className={`${styles.idea} ${idea.isFlagged ? styles.flaggedIdea : ""}`}
    >
      <div className={styles.header}>
        <img
          src={idea.owner.picture}
          alt={idea.owner.handle}
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <h3 className={styles.ownerHandle}>{idea.owner.handle}</h3>
          <p className={styles.meta}>
            <DateComponent date={new Date(idea.createdAt)} />
          </p>
        </div>
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{idea.title}</h2>
        <p className={styles.description}>{idea.description}</p>
      </div>
      <div className={styles.tags}>
        {idea.tags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            #{tag}
          </span>
        ))}
      </div>
      {!idea.isExample && (
        <div className={`${styles.actions}`}>
          <span>
            <button
              onClick={() => handleAction(idea, INTERACTION_LOVE)}
              className={`${styles.actionButton} ${styles.love} ${
                hasLove(idea) ? styles.loveActive : ""
              }`}
            >
              {hasLove(idea) ? <BsHearts /> : <BsHeart />}
            </button>
            <span>{getLoveCount(idea)}</span>
          </span>
          <span>
            <button
              onClick={() => handleAction(idea, INTERACTION_SUPPORT)}
              className={`${styles.actionButton} ${styles.support} ${
                hasSupport(idea) ? styles.supportActive : ""
              }`}
            >
              {hasSupport(idea) ? <MdPersonAdd /> : <BsPerson />}
            </button>
            <span style={{ display: "inline" }}>{getSupportCount(idea)}</span>
          </span>
          <span>
            <button
              onClick={() => handleAction(idea, INTERACTION_FUNNY)}
              className={`${styles.actionButton} ${styles.funny} ${
                hasFunny(idea) ? styles.funnyActive : ""
              }`}
            >
              {hasFunny(idea) ? <BsEmojiLaughingFill /> : <BsEmojiLaughing />}
            </button>
            <span style={{ display: "inline" }}>{getFunnyCount(idea)}</span>
          </span>
          <span>
            <button
              onClick={() => handleAction(idea, INTERACTION_NOT_USEFUL)}
              className={`${styles.actionButton} ${styles.useless} ${
                hasNotUseful(idea) ? styles.uselessActive : ""
              }`}
            >
              {hasNotUseful(idea) ? <BsHeartbreakFill /> : <BsHeartbreak />}
            </button>
            <span style={{ display: "inline" }}>{getNotUsefulCount(idea)}</span>
          </span>
          {/* <button
      onClick={() => alert("Share clicked!")}
      className={styles.actionButton}
    >
      🔗 Share
    </button> */}
        </div>
      )}
    </div>
  );
}
