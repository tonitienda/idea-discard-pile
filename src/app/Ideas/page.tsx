"use client";

import { useEffect, useState } from "react";
import { Idea } from "../api/model";

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    fetch("/api/ideas")
      .then((response) => response.json())
      .then((data) => setIdeas(data));
  }, []);

  return ideas.map((idea) => (
    <div key={idea.id} className="card">
      <div className="card-body">
        <h5 className="card-title">{idea.title}</h5>
        <p className="card-text">{idea.description}</p>
      </div>
    </div>
  ));
}
