"use client";

const { useState } = require("react");

export default function IdeaForm() {
  const [idea, setIdea] = useState("");
  const [reason, setReason] = useState("");
  const [askForReason, setAskForReason] = useState(false);

  return (
    <div className="input-group mb-3">
      {askForReason ? (
        <input
          type="text"
          value={reason}
          className="form-control"
          style={{ fontSize: "2em" }}
          aria-label="Your reason"
          placeholder="Why did you discard it?"
          onChange={(e) => setReason(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              setReason("");
              setAskForReason(false);
            } else if (e.key === "Escape") {
              setReason("");
              setAskForReason(false);
            }
          }}
        />
      ) : (
        <input
          type="text"
          value={idea}
          className="form-control"
          style={{ fontSize: "2em" }}
          aria-label="Your idea"
          placeholder="Enter your idea here"
          onChange={(e) => setIdea(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              setIdea("");
              setAskForReason(true);
            }
          }}
        />
      )}
      <span className="input-group-text">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-arrow-right"
          viewBox="0 0 16 16" // viewBox is a required attribute for SVGs.
        >
          <path
            fillRule="evenodd"
            d="M11.354 8.354a.5.5 0 0 0 0-.708l-7-7a.5.5 0 0 0-.708.708L10.293 8l-6.647 6.646a.5.5 0 0 0 .708.708l7-7a.5.5 0 0 0 0-.708z"
          />
        </svg>
      </span>
    </div>
  );
}
