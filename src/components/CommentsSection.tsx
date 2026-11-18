"use client";

import { FormEvent, useState } from "react";
import { Comment } from "../app/api/model";
import { COMMENT_MAX_LENGTH } from "../app/invariants";
import DateComponent from "./DateComponent";
import styles from "./comments.module.css";

type Props = {
  ideaId: string;
  ideaOwnerId: string;
  initialComments: Comment[];
  viewerId?: string;
  loginUrl: string;
};

export default function CommentsSection({
  ideaId,
  ideaOwnerId,
  initialComments,
  viewerId,
  loginUrl,
}: Props) {
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!body.trim() || submitting) {
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/ideas/${ideaId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }
      setComments((prev) => [...prev, data as Comment]);
      setBody("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this comment?")) {
      return;
    }
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    } else {
      setError("Couldn't delete the comment. Please try again.");
    }
  };

  const canDelete = (c: Comment) =>
    !!viewerId && (viewerId === c.author.id || viewerId === ideaOwnerId);

  return (
    <section id="comments" className={styles.section}>
      <h2 className={styles.heading}>
        Comments{comments.length > 0 ? ` (${comments.length})` : ""}
      </h2>

      {comments.length === 0 ? (
        <p className={styles.empty}>
          No comments yet. Know a way to make it work, or why it can't?
        </p>
      ) : (
        <ul className={styles.list}>
          {comments.map((c) => (
            <li key={c.id} className={styles.comment}>
              <img src={c.author.picture} alt="" className={styles.avatar} />
              <div className={styles.commentMain}>
                <div className={styles.commentMeta}>
                  <span className={styles.author}>{c.author.handle}</span>
                  {c.author.id === ideaOwnerId && <span>· author</span>}
                  <DateComponent date={c.createdAt} />
                  {canDelete(c) && (
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => remove(c.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className={styles.body}>{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {viewerId ? (
        <form className={styles.form} onSubmit={submit}>
          <textarea
            className="form-control"
            placeholder="Add a comment"
            aria-label="Add a comment"
            value={body}
            maxLength={COMMENT_MAX_LENGTH}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className={styles.formFooter}>
            <span>
              {body.length}/{COMMENT_MAX_LENGTH}
            </span>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={submitting || !body.trim()}
            >
              {submitting ? "Posting…" : "Post comment"}
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      ) : (
        <p className={styles.empty}>
          <a href={loginUrl}>Log in</a> to join the conversation.
        </p>
      )}
    </section>
  );
}
