"use client";

// components/IdeaForm.tsx
import { useState } from "react";
import { Idea } from "../app/api/model";
import { trackIdeaCreation } from "../client/ga";

import { useStoreActions } from "../store";
import {
  DISCARDED_REASON_MAX_LENGTH,
  IDEA_DESCRIPTION_MAX_LENGTH,
  IDEA_DESCRIPTION_MIN_LENGTH,
} from "../app/invariants";
import { requestTeardown } from "./TeardownPanel";
import styles from "./ideaform.module.css";
interface IdeaFormProps {
  onIdeaAdded: (idea: Idea | null) => void;
}

const postIdea = async (
  description: string,
  discardedReason: string
): Promise<[string | null, Error | null]> => {
  const partialIdea: Partial<Idea> = { description, discardedReason };

  const response = await fetch(`/api/ideas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(partialIdea),
  });

  if (response.ok) {
    const data = await response.json();
    return [data.id, null];
  }

  try {
    const data = await response.json();

    return [null, new Error(data.message)];
  } catch (error) {
    return [null, new Error("Failed to post idea")];
  }
};

const getIdea = async (id: string): Promise<[Idea | null, Error | null]> => {
  const response = await fetch(`/api/ideas/${id}`);

  if (response.ok) {
    const idea: Idea = await response.json();
    if (idea.isFlagged) {
      return [
        idea,
        new Error(
          "Your idea was flagged. Please make sure it is not spam or inappropriate.<br /> You can always find it under <a href='/ideas'>My Ideas</a> "
        ),
      ];
    }
    return [idea as Idea, null];
  }

  return [null, new Error("Failed to fetch idea")];
};

export default function IdeaForm(props: IdeaFormProps) {
  const [description, setDescription] = useState("");
  const [discardedReason, setDiscardedReason] = useState("");
  const [status, setStatus] = useState("");
  const [onFocus, setOnFocus] = useState(false);
  const [submittingIdea, setSubmittingIdea] = useState(false);
  const [submissionPercent, setSubmissionPercent] = useState(0);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean | null>(
    null
  );

  const addNotification = useStoreActions((actions) => actions.addNotification);

  const addIdea = async (
    description: string,
    discardedReason: string
  ): Promise<boolean> => {
    setSubmissionSuccess(null);
    setSubmissionPercent(5);
    setSubmittingIdea(true);
    setStatus("Checking your idea…");

    const [ideaId, postError] = await postIdea(description, discardedReason);

    if (postError) {
      setSubmissionSuccess(false);
      setSubmittingIdea(false);
      addNotification({
        level: "danger",
        message: postError.message,
      });
      setStatus("");
      return false;
    }

    setSubmissionPercent(30);

    const [idea, getError] = await getIdea(ideaId);

    if (getError) {
      setSubmissionSuccess(false);
      addNotification({
        level: "danger",
        message: getError.message,
      });
    }

    if (idea && !getError) {
      trackIdeaCreation(idea.id, idea.title);

      setSubmissionPercent(60);
      setStatus("Writing your teardown. This takes a few seconds…");
      const [teardown, teardownError] = await requestTeardown(idea.id);
      if (teardownError) {
        addNotification({
          level: "warning",
          message:
            "Your idea was shared, but the teardown failed. You can retry it from the idea card.",
        });
      }

      setSubmissionPercent(100);
      setSubmissionSuccess(true);
      props.onIdeaAdded({ ...idea, teardown: teardown ?? undefined });
    } else {
      setSubmissionPercent(100);
      props.onIdeaAdded(null);
    }

    setStatus("");
    setTimeout(() => {
      setSubmittingIdea(false);
    }, 200);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      addIdea(description.trim(), discardedReason.trim()).then((posted) => {
        if (posted) {
          setDescription("");
          setDiscardedReason("");
        }
        setOnFocus(true);
      });
    }
  };

  const missing = IDEA_DESCRIPTION_MIN_LENGTH - description.trim().length;

  return (
    <div className={styles.wrapper}>
      <form
        onSubmit={handleSubmit}
        className={`${styles.composer} ${onFocus ? styles.open : ""}`}
      >
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's the idea you never built?"
          rows={onFocus ? 4 : 1}
          onFocus={() => setOnFocus(true)}
          className={styles.field}
          disabled={submittingIdea}
          aria-label="Your idea"
        />
        {onFocus && (
          <textarea
            value={discardedReason}
            onChange={(e) => setDiscardedReason(e.target.value)}
            placeholder="Why did you drop it? Optional, and it sharpens the teardown."
            rows={2}
            maxLength={DISCARDED_REASON_MAX_LENGTH}
            className={`${styles.field} ${styles.second}`}
            disabled={submittingIdea}
            aria-label="Why you dropped it"
          />
        )}
        <div className={styles.footer}>
          {onFocus && (
            <p className={styles.hint} aria-live="polite">
              {submittingIdea && status
                ? status
                : missing > 0
                ? `${missing} more characters to go.`
                : "You'll get an honest teardown: who tried it, why it fails, and the cheapest way to test it."}
            </p>
          )}
          <button
            type="submit"
            onFocus={() => setOnFocus(true)}
            className="btn btn-primary"
            disabled={
              submittingIdea ||
              description.trim().length < IDEA_DESCRIPTION_MIN_LENGTH ||
              description.trim().length > IDEA_DESCRIPTION_MAX_LENGTH
            }
          >
            Share idea
          </button>
        </div>
        {submittingIdea && (
          <div
            className={`${styles.progress} ${
              submissionSuccess === false ? styles.failed : ""
            }`}
            role="progressbar"
            aria-label="Sharing your idea"
            aria-valuenow={submissionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div style={{ width: submissionPercent + "%" }}></div>
          </div>
        )}
      </form>
    </div>
  );
}
