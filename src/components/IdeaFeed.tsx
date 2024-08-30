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

interface IdeaFeedProps {
  ideas: Idea[];
}

export default function IdeaFeed({ ideas }: IdeaFeedProps) {
  if (!ideas.length) {
    return (
      <div className={styles.feed}>
        <h3>
          No ideas found
          <small className="text-body-secondary">
            {" "}
            Create your first idea!
          </small>
        </h3>
      </div>
    );
  }
  const [interactions, setInteractions] = useState<{
    [key: string]: { [key: string]: boolean };
  }>({});

  const hasInteractions = (ideaId: string, action: string) => {
    return interactions[ideaId] && interactions[ideaId][action];
  };

  const getInteractionCount = (idea: Idea, action: string) => {
    const addition = idea.myInteractions[action]
      ? hasInteractions(idea.id, action)
        ? 0
        : -1
      : hasInteractions(idea.id, action)
      ? 1
      : 0;
    return (idea.interactions[action] || 0) + addition;
  };

  const hasLove = (idea: Idea) => {
    return (
      idea.myInteractions[INTERACTION_LOVE] ||
      hasInteractions(idea.id, INTERACTION_LOVE)
    );
  };

  const getLoveCount = (idea: Idea) => {
    return getInteractionCount(idea, INTERACTION_LOVE);
  };

  const hasSupport = (idea: Idea) => {
    return (
      idea.myInteractions[INTERACTION_SUPPORT] ||
      hasInteractions(idea.id, INTERACTION_SUPPORT)
    );
  };

  const getSupportCount = (idea: Idea) => {
    return getInteractionCount(idea, INTERACTION_SUPPORT);
  };

  const hasNotUseful = (idea: Idea) => {
    return (
      idea.myInteractions[INTERACTION_NOT_USEFUL] ||
      hasInteractions(idea.id, INTERACTION_NOT_USEFUL)
    );
  };

  const getNotUsefulCount = (idea: Idea) => {
    return getInteractionCount(idea, INTERACTION_NOT_USEFUL);
  };

  const hasFunny = (idea: Idea) => {
    return (
      idea.myInteractions[INTERACTION_FUNNY] ||
      hasInteractions(idea.id, INTERACTION_FUNNY)
    );
  };

  const getFunnyCount = (idea: Idea) => {
    return getInteractionCount(idea, INTERACTION_FUNNY);
  };

  const handleAction = (ideaId: string, action: string) => {
    if (!interactions[ideaId]) {
      setInteractions((prevInteractions) => ({
        ...prevInteractions,
        [ideaId]: { [action]: true },
      }));
      return;
    }

    if (interactions[ideaId][action] == undefined) {
      setInteractions((prevInteractions) => ({
        ...prevInteractions,
        [ideaId]: {
          ...prevInteractions[ideaId],
          [action]: true,
        },
      }));
      return;
    }

    setInteractions((prevInteractions) => ({
      ...prevInteractions,
      [ideaId]: {
        ...prevInteractions[ideaId],
        [action]: !interactions[ideaId][action],
      },
    }));
  };

  return (
    <div className={styles.feed}>
      {ideas.map((idea) => (
        <div
          key={idea.id}
          className={`${styles.idea} ${
            idea.isFlagged ? styles.flaggedIdea : ""
          }`}
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
                  onClick={() => handleAction(idea.id, INTERACTION_LOVE)}
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
                  onClick={() => handleAction(idea.id, INTERACTION_SUPPORT)}
                  className={`${styles.actionButton} ${styles.support} ${
                    hasSupport(idea) ? styles.supportActive : ""
                  }`}
                >
                  {hasSupport(idea) ? <MdPersonAdd /> : <BsPerson />}
                </button>
                <span style={{ display: "inline" }}>
                  {getSupportCount(idea)}
                </span>
              </span>
              <span>
                <button
                  onClick={() => handleAction(idea.id, INTERACTION_FUNNY)}
                  className={`${styles.actionButton} ${styles.funny} ${
                    hasFunny(idea) ? styles.funnyActive : ""
                  }`}
                >
                  {hasFunny(idea) ? (
                    <BsEmojiLaughingFill />
                  ) : (
                    <BsEmojiLaughing />
                  )}
                </button>
                <span style={{ display: "inline" }}>{getFunnyCount(idea)}</span>
              </span>
              <span>
                <button
                  onClick={() => handleAction(idea.id, INTERACTION_NOT_USEFUL)}
                  className={`${styles.actionButton} ${styles.useless} ${
                    hasNotUseful(idea) ? styles.uselessActive : ""
                  }`}
                >
                  {hasNotUseful(idea) ? <BsHeartbreakFill /> : <BsHeartbreak />}
                </button>
                <span style={{ display: "inline" }}>
                  {getNotUsefulCount(idea)}
                </span>
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
      ))}
    </div>
  );
}
