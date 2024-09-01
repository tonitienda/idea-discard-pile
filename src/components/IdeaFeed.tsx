"use client";

import { Idea } from "../app/api/model";
import styles from "./ideafeed.module.css";

import { IdeaCard } from "./IdeaCard";
// import { AdCard } from "./AdCard";

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

  return (
    <div className={styles.feed}>
      {ideas.map((idea, idx) => (
        <>
          <IdeaCard idea={idea} key={idea.id} />
          {/* {(idx + 1) % 5 === 0 && <AdCard />} */}
        </>
      ))}
    </div>
  );
}
