"use client";

import { useState } from "react";
import { Teardown, Verdict } from "../app/api/model";
import styles from "./teardown.module.css";

const VERDICT_LABELS: Record<Verdict, string> = {
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
    <span className={`${styles.verdict} ${styles[verdict]}`}>
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
      <div className={styles.panel}>
        <button
          type="button"
          className={styles.toggle}
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
        className={styles.toggle}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span>{open ? "▾" : "▸"} Teardown</span>
        <VerdictBadge verdict={teardown.verdict} />
      </button>

      {open && (
        <div className={styles.body}>
          <p className={styles.summary}>{teardown.summary}</p>

          <section>
            <h4>Who already tried it</h4>
            {teardown.priorArt.length ? (
              <ul>
                {teardown.priorArt.map((p) => (
                  <li key={p.name}>
                    <strong>{p.name}</strong>{" "}
                    <span className={styles.status}>
                      {STATUS_LABELS[p.status]}
                    </span>
                    <br />
                    {p.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nothing well known. That's either an opening or a warning.</p>
            )}
          </section>

          <section>
            <h4>Why ideas like this usually fail</h4>
            <ul>
              {teardown.whyItFails.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4>What would have to be true</h4>
            <ul>
              {teardown.mustBeTrue.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4>Cheapest first test</h4>
            <p>{teardown.firstExperiment}</p>
          </section>

          <section>
            <h4>
              Verdict: <VerdictBadge verdict={teardown.verdict} />
            </h4>
            <p>{teardown.verdictReason}</p>
          </section>

          <p className={styles.disclaimer}>
            Written by AI. Prior art may be incomplete or out of date, so check
            before you rely on it.
          </p>
        </div>
      )}
    </div>
  );
}
