// components/IdeaForm.tsx
import { useState } from "react";
import { Idea } from "../app/api/model";

interface IdeaFormProps {
  onSubmit: (idea: Partial<Idea>) => void;
}

export default function IdeaForm({ onSubmit }: IdeaFormProps) {
  const [description, setDescription] = useState("");
  const [onFocus, setOnFocus] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit({
        description,
      });
      setDescription("");
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
        onBlur={() => setOnFocus(false)}
        className="form-control me-2"
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={!description.trim()}
      >
        Share Idea
      </button>
    </form>
  );
}
