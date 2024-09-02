"use client";

// components/IdeaForm.tsx
import { useState } from "react";
import { Idea } from "../app/api/model";
import { trackIdeaCreation } from "../client/ga";

interface IdeaFormProps {
  onIdeaAdded: (idea: Idea) => void;
}

export default function IdeaForm(props: IdeaFormProps) {
  const [description, setDescription] = useState("");
  const [onFocus, setOnFocus] = useState(false);
  const [submittingIdea, setSubmittingIdea] = useState(false);
  const [submissionPercent, setSubmissionPercent] = useState(0);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean | null>(
    null
  );

  const addIdea = async (description: string): Promise<void> => {
    setSubmissionSuccess(null);
    setSubmissionPercent(5);
    setSubmittingIdea(true);
    const partialIdea: Partial<Idea> = { description };

    return fetch(`/api/ideas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(partialIdea),
    })
      .then((response) => {
        setSubmissionPercent(50);
        return response.json();
      })
      .then((data) => {
        setSubmissionPercent(60);
        return fetch(`/api/ideas/${data.id}`);
      })
      .then((response) => {
        if (response.ok) {
          setSubmissionPercent(70);
          return response.json();
        }

        setSubmissionSuccess(false);
        setSubmittingIdea(false);

        return null;
      })

      .then((idea) => {
        setSubmissionSuccess(true);
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
      });
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
