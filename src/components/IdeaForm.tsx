"use client";

// components/IdeaForm.tsx
import { useState } from "react";
import { Idea } from "../app/api/model";
import { trackIdeaCreation } from "../client/ga";

import { BsX } from "react-icons/bs";
import { useStoreActions } from "../store";
import {
  IDEA_DESCRIPTION_MAX_LENGTH,
  IDEA_DESCRIPTION_MIN_LENGTH,
} from "../app/invariants";
interface IdeaFormProps {
  onIdeaAdded: (idea: Idea) => void;
}

const postIdea = async (
  description: string
): Promise<[string | null, Error | null]> => {
  const partialIdea: Partial<Idea> = { description };

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
  const [onFocus, setOnFocus] = useState(false);
  const [submittingIdea, setSubmittingIdea] = useState(false);
  const [submissionPercent, setSubmissionPercent] = useState(0);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean | null>(
    null
  );

  const addNotification = useStoreActions((actions) => actions.addNotification);

  const addIdea = async (description: string): Promise<void> => {
    setSubmissionSuccess(null);
    setSubmissionPercent(5);
    setSubmittingIdea(true);

    const [ideaId, postError] = await postIdea(description);

    if (postError) {
      setSubmissionSuccess(false);
      setSubmittingIdea(false);
      addNotification({
        level: "danger",
        message: postError.message,
      });
      return;
    }

    setSubmissionPercent(60);

    const [idea, getError] = await getIdea(ideaId);

    if (getError) {
      setSubmissionSuccess(false);
      addNotification({
        level: "danger",
        message: getError.message,
      });
    }

    setSubmissionPercent(100);

    if (idea && !getError) {
      trackIdeaCreation(idea.id, idea.title);
      props.onIdeaAdded(idea);

      addNotification({
        level: "success",
        message: "Idea added successfully",
      });
    } else {
      props.onIdeaAdded(null);
    }

    setTimeout(() => {
      setSubmittingIdea(false);
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      addIdea(description.trim()).then(() => {
        setDescription("");
        setOnFocus(true);
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="d-flex w-100">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Inspire others with your idea..."
          rows={onFocus ? 4 : 1}
          onFocus={() => setOnFocus(true)}
          className="form-control me-2"
          disabled={submittingIdea}
        />
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
          Share Idea
        </button>
      </form>
      {submittingIdea && (
        <div className="progress">
          <div
            className={`progress-bar progress-bar-striped progress-bar-animated
              ${
                submissionSuccess === true
                  ? "bg-success"
                  : submissionSuccess == null
                  ? ""
                  : "bg-danger"
              }`}
            role="progressbar"
            aria-valuenow={submissionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ width: submissionPercent + "%" }}
          ></div>
        </div>
      )}
    </>
  );
}
