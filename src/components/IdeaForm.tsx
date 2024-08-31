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

  const addIdea = async (description: string): Promise<void> => {
    const partialIdea: Partial<Idea> = { description };
    return fetch(`/api/ideas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(partialIdea),
    })
      .then((response) => response.json())
      .then((data) => fetch(`/api/ideas/${data.id}`))
      .then((response) => (response.ok ? response.json() : null))
      .then((idea) => {
        if (idea) {
          trackIdeaCreation(idea.id, idea.title);
          props.onIdeaAdded(idea);
        }
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
        disabled={!description.trim()}
      >
        Share Idea
      </button>
    </form>
  );
}
