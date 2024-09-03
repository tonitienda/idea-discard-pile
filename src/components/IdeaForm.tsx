"use client";

// components/IdeaForm.tsx
import { useState } from "react";
import { Idea } from "../app/api/model";
import { trackIdeaCreation } from "../client/ga";

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
      return [idea, new Error("Idea is flagged")];
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
  const [submissionError, setSubmissionError] = useState<Error | null>(null);

  const addIdea = async (description: string): Promise<void> => {
    setSubmissionSuccess(null);
    setSubmissionPercent(5);
    setSubmittingIdea(true);

    const [ideaId, postError] = await postIdea(description);

    if (postError) {
      setSubmissionSuccess(false);
      setSubmittingIdea(false);
      setSubmissionError(postError);
      return;
    }

    setSubmissionPercent(60);

    const [idea, getError] = await getIdea(ideaId);

    if (getError) {
      setSubmissionSuccess(false);
    }

    setSubmissionPercent(100);

    if (idea) {
      trackIdeaCreation(idea.id, idea.title);
      props.onIdeaAdded(idea);
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
      {submissionError && (
        <div className="alert alert-dismissible alert-danger">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
          ></button>
          {submissionError.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="d-flex w-100">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Inspire others with your idea..."
          rows={onFocus ? 4 : 1}
          onFocus={() => setOnFocus(true)}
          className="form-control me-2"
        />
        <button
          type="submit"
          onFocus={() => setOnFocus(true)}
          className="btn btn-primary"
          disabled={submittingIdea || !description.trim()}
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
