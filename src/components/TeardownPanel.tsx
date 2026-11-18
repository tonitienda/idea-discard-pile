"use client";

import { useState } from "react";
import { Teardown, Verdict } from "../app/api/model";
import { BsChevronDown } from "react-icons/bs";
import styles from "./teardown.module.css";

export const VERDICT_LABELS: Record<Verdict, string> = {
  "worth-reviving": "Worth reviving",
  "needs-a-twist": "Needs a twist",
  "let-it-go": "Let it go",
};

const STATUS_LABELS = {
  active: "Active",
  defunct: "Defunct",
  unknown: "Status unknown",
};

export const requestTeardown = async (
  ideaId: string
): Promise<[Teardown | null, Error | null]> => {
  try {
    const response = await fetch(`/api/ideas/${ideaId}/teardown`, {
      method: "POST",
    });
    const data = await response.json();
    if (!response.ok) {
      return [null, new Error(data.message || "Teardown failed")];
    }
    return [data as Teardown, null];
  } catch {
    return [null, new Error("Teardown failed")];
  }
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  return (
    <span className={`${styles.verdict} ${styles[verdict]} wash`}>
      {VERDICT_LABELS[verdict]}
    </span>
  );
}

type TeardownPanelProps = {
  ideaId: string;
  teardown?: Teardown;
  canGenerate: boolean;
  defaultOpen?: boolean;
};

export default function TeardownPanel({
  ideaId,
  teardown: initialTeardown,
  canGenerate,
  defaultOpen = false,
}: TeardownPanelProps) {
  const [teardown, setTeardown] = useState(initialTeardown);
  const [open, setOpen] = useState(defaultOpen && !!initialTeardown);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!teardown) {
    if (!canGenerate) {
      return null;
    }
    return (
      <div className={styles.pending}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setError("");
            const [result, err] = await requestTeardown(ideaId);
            setLoading(false);
            if (err) {
              setError(err.message);
              return;
            }
            setTeardown(result);
            setOpen(true);
          }}
        >
          {loading ? "Writing your teardown…" : "Get an honest teardown"}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <button
        type="button"
        className={`${styles.toggle} wash`}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className={styles.toggleText}>
          <strong>{open ? "Hide the teardown" : "Teardown"}</strong>
          {!open && (
            <span className={styles.toggleSummary}>{teardown.summary}</span>
          )}
        </span>
        <BsChevronDown className={styles.chevron} aria-hidden="true" />
      </button>

      {open && (
        <div className={`${styles.sheet} wash`}>
          <p className={styles.summary}>{teardown.summary}</p>

          <dl className={styles.spec}>
            <div className={styles.row}>
              <dt>Who already tried it</dt>
              <dd>
                {teardown.priorArt.length ? (
                  <ul className={styles.priorArt}>
                    {teardown.priorArt.map((p) => (
                      <li key={p.name}>
                        <strong>{p.name}</strong>
                        <span className={styles.status}>
                          {STATUS_LABELS[p.status]}
                        </span>
                        <p>{p.description}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    Nothing well known. That&apos;s either an opening or a
                    warning.
                  </p>
                )}
              </dd>
            </div>

            <div className={styles.row}>
              <dt>Why ideas like this usually fail</dt>
              <dd>
                <ul>
                  {teardown.whyItFails.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </dd>
            </div>

            <div className={styles.row}>
              <dt>What would have to be true</dt>
              <dd>
                <ul>
                  {teardown.mustBeTrue.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </dd>
            </div>

            <div className={styles.row}>
              <dt>Cheapest first test</dt>
              <dd>
                <p>{teardown.firstExperiment}</p>
              </dd>
            </div>

            <div className={styles.row}>
              <dt>Verdict</dt>
              <dd>
                <VerdictBadge verdict={teardown.verdict} />
                <p className={styles.verdictReason}>{teardown.verdictReason}</p>
              </dd>
            </div>
          </dl>

          <p className={styles.disclaimer}>
            Written by AI. Prior art may be incomplete or out of date, so check
            before you rely on it.
          </p>
        </div>
      )}
    </div>
  );
}
