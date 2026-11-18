"use client";
import { useEffect } from "react";
import styles from "./modal.module.css";

type PromptToLoginModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function PromptToLoginModal({
  open,
  onClose,
}: PromptToLoginModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-prompt-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="login-prompt-title">Log in to join in</h2>
        <p>
          With an account you can offer to help, react to ideas, comment, and
          share the ideas you never built.
        </p>
        <div className={styles.buttons}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Not now
          </button>
          <a href="/api/auth/login" className="btn btn-primary" autoFocus>
            Log in or sign up
          </a>
        </div>
      </div>
    </div>
  );
}
