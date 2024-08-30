"use client";

import { useState } from "react";
import { Idea } from "../app/api/model";
import styles from "./ideafeed.module.css";

import {
  BsHandThumbsDownFill,
  BsHandThumbsUp,
  BsHandThumbsUpFill,
  BsLightbulb,
  BsLightbulbFill,
  BsRocket,
  BsRocketFill,
  BsHearts,
  BsHeart,
  BsEmojiLaughing,
  BsEmojiLaughingFill,
  BsPerson,
  BsPersonRaisedHand,
  BsEmojiNeutral,
  BsHeartbreak,
  BsHeartbreakFill,
} from "react-icons/bs";
import { MdPersonAdd, MdOutlineMoodBad } from "react-icons/md";

import { BsHandThumbsDown } from "react-icons/bs";
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

  const [lovedIdeas, setLovedIdeas] = useState<{ [key: string]: boolean }>({});
  const [funnyIdeas, setFunnyIdeas] = useState<{
    [key: string]: boolean;
  }>({});
  const [uselessIdeas, setUselessIdeas] = useState<{
    [key: string]: boolean;
  }>({});
  const [supportIdeas, setSupportIdeas] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleAction = (ideaId: string, action: string) => {
    if (action === INTERACTION_LOVE) {
      setLovedIdeas((ideas) => ({ ...ideas, [ideaId]: !ideas[ideaId] }));
    } else if (action === INTERACTION_FUNNY) {
      setFunnyIdeas((ideas) => ({ ...ideas, [ideaId]: !ideas[ideaId] }));
    } else if (action === INTERACTION_NOT_USEFUL) {
      setUselessIdeas((ideas) => ({ ...ideas, [ideaId]: !ideas[ideaId] }));
    } else if (action === INTERACTION_SUPPORT) {
      setSupportIdeas((ideas) => ({ ...ideas, [ideaId]: !ideas[ideaId] }));
    }
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
          <div className={`${styles.actions}`}>
            <button
              onClick={() => handleAction(idea.id, INTERACTION_LOVE)}
              className={`${styles.actionButton} ${styles.love} ${
                lovedIdeas[idea.id] ? styles.loveActive : ""
              }`}
            >
              {lovedIdeas[idea.id] ? <BsHearts /> : <BsHeart />}
            </button>
            <button
              onClick={() => handleAction(idea.id, INTERACTION_SUPPORT)}
              className={`${styles.actionButton} ${styles.support} ${
                supportIdeas[idea.id] ? styles.supportActive : ""
              }`}
            >
              {supportIdeas[idea.id] ? <MdPersonAdd /> : <BsPerson />}
            </button>
            <button
              onClick={() => handleAction(idea.id, INTERACTION_FUNNY)}
              className={`${styles.actionButton} ${styles.funny} ${
                funnyIdeas[idea.id] ? styles.funnyActive : ""
              }`}
            >
              {funnyIdeas[idea.id] ? (
                <BsEmojiLaughingFill />
              ) : (
                <BsEmojiNeutral />
              )}
            </button>
            <button
              onClick={() => handleAction(idea.id, INTERACTION_NOT_USEFUL)}
              className={`${styles.actionButton} ${styles.useless} ${
                uselessIdeas[idea.id] ? styles.uselessActive : ""
              }`}
            >
              {uselessIdeas[idea.id] ? <BsHeartbreakFill /> : <BsHeartbreak />}
            </button>
            <button
              onClick={() => alert("Share clicked!")}
              className={styles.actionButton}
            >
              🔗 Share
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
