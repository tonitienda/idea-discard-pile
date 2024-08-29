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
} from "react-icons/bs";
import { BsHandThumbsDown } from "react-icons/bs";
import DateComponent from "./DateComponent";

interface IdeaFeedProps {
  ideas: Idea[];
}

export default function IdeaFeed({ ideas }: IdeaFeedProps) {
  const [likedIdeas, setLikedIdeas] = useState<{ [key: string]: boolean }>({});
  const [inspiredIdeas, setInspiredIdeas] = useState<{
    [key: string]: boolean;
  }>({});
  const [dislikedIdeas, setDislikedIdeas] = useState<{
    [key: string]: boolean;
  }>({});
  const [workedIdeas, setWorkedIdeas] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleAction = (ideaId: string, action: string) => {
    if (action === "like") {
      setLikedIdeas({ ...likedIdeas, [ideaId]: !likedIdeas[ideaId] });
    } else if (action === "dislike") {
      setDislikedIdeas({ ...dislikedIdeas, [ideaId]: !dislikedIdeas[ideaId] });
    } else if (action === "inspire") {
      setInspiredIdeas({ ...inspiredIdeas, [ideaId]: !inspiredIdeas[ideaId] });
    } else if (action === "work") {
      setWorkedIdeas({ ...workedIdeas, [ideaId]: !workedIdeas[ideaId] });
    }
  };

  return (
    <div className={styles.feed}>
      {ideas.map((idea) => (
        <div key={idea.id} className={styles.idea}>
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
          <div className={styles.actions}>
            <button
              onClick={() => handleAction(idea.id, "like")}
              className={`${styles.actionButton} ${
                likedIdeas[idea.id] ? styles.liked : ""
              }`}
            >
              {likedIdeas[idea.id] ? (
                <BsHandThumbsUpFill />
              ) : (
                <BsHandThumbsUp />
              )}
            </button>
            <button
              onClick={() => handleAction(idea.id, "dislike")}
              className={`${styles.actionButton} ${
                dislikedIdeas[idea.id] ? styles.disliked : ""
              }`}
            >
              {dislikedIdeas[idea.id] ? (
                <BsHandThumbsDownFill />
              ) : (
                <BsHandThumbsDown />
              )}
            </button>
            <button
              onClick={() => handleAction(idea.id, "inspire")}
              className={`${styles.actionButton} ${
                inspiredIdeas[idea.id] ? styles.inspired : ""
              }`}
            >
              {inspiredIdeas[idea.id] ? <BsLightbulbFill /> : <BsLightbulb />}
            </button>
            <button
              onClick={() => handleAction(idea.id, "work")}
              className={`${styles.actionButton} ${
                workedIdeas[idea.id] ? styles.worked : ""
              }`}
            >
              {workedIdeas[idea.id] ? <BsRocketFill /> : <BsRocket />}
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
