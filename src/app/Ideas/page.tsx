"use client";

import { useEffect, useState } from "react";
import { Idea } from "../api/model";
import Head from "next/head";
import styles from "./ideas.module.css";

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

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    fetch("/api/ideas")
      .then((response) => response.json())
      .then((data) => setIdeas(data.items));
  }, []);

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
    <div>
      <Head>
        <title>A Pile of Ideas</title>
        <meta
          name="description"
          content="Share and discover innovative ideas"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <div className="row">
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
                      {new Date(idea.createdAt).toLocaleString()}
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
                    {inspiredIdeas[idea.id] ? (
                      <BsLightbulbFill />
                    ) : (
                      <BsLightbulb />
                    )}
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
        </div>
      </main>
    </div>
  );
}
