"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { differenceInDays, format, formatDistanceStrict } from "date-fns";
import { Building, BUILDING_URL_MAX_LENGTH } from "../app/api/model";
import { BuildingMark } from "./BuildingBadge";
import styles from "./building.module.css";

type Props = {
  ideaId: string;
  ownerHandle: string;
  createdAt: string;
  building?: Building;
  isOwner: boolean;
};

const day = (date: string) => format(new Date(date), "MMM d, yyyy");

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

// On an idea's page: whether its owner is building it, since when, and where
// to see it. The owner starts and stops it here. Pencil (dashed) while it is
// still only an idea, ink (solid) once it is being built.
export default function BuildingPanel({
  ideaId,
  ownerHandle,
  createdAt,
  building,
  isOwner,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [url, setUrl] = useState(building?.url ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  if (!building && !isOwner) {
    return null;
  }

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    try {
      const res = await fetch(`/api/ideas/${ideaId}/building`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || "Couldn't save. Try again.");
        return;
      }
      setEditing(false);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const stop = async () => {
    setBusy(true);
    setError(undefined);
    try {
      const res = await fetch(`/api/ideas/${ideaId}/building`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("Couldn't save. Try again.");
        return;
      }
      setUrl("");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const form = (
    <form className={styles.form} onSubmit={save}>
      <label htmlFor="building-url" className={styles.label}>
        Link to a prototype, repo or demo{" "}
        <span className={styles.optional}>(optional)</span>
      </label>
      <input
        id="building-url"
        className="form-control"
        type="text"
        inputMode="url"
        autoComplete="url"
        placeholder="github.com/you/your-project"
        maxLength={BUILDING_URL_MAX_LENGTH}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        autoFocus
      />
      <div className={styles.buttons}>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {building ? "Save link" : "Mark as building"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={busy}
          onClick={() => {
            setEditing(false);
            setUrl(building?.url ?? "");
            setError(undefined);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );

  if (!building) {
    return (
      <section className={styles.pending} aria-label="Building status">
        {editing ? (
          form
        ) : (
          <>
            <div>
              <p className={styles.heading}>Started working on this?</p>
              <p className={styles.text}>
                Mark it as being built. Everyone who offered to help hears about
                it, and the feed shows it&apos;s no longer on the pile.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setEditing(true)}
            >
              I&apos;m building it
            </button>
          </>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </section>
    );
  }

  const waited =
    differenceInDays(new Date(building.since), new Date(createdAt)) >= 30
      ? formatDistanceStrict(new Date(building.since), new Date(createdAt), {
          roundingMethod: "floor",
        })
      : null;

  return (
    <section className={styles.building} aria-label="Building status">
      <div className={styles.title}>
        <BuildingMark className={styles.mark} />
        <p className={styles.heading} suppressHydrationWarning>
          Building since {day(building.since)}
        </p>
      </div>
      <p className={styles.text} suppressHydrationWarning>
        {isOwner ? "You" : ownerHandle} posted this idea on {day(createdAt)}
        {waited
          ? ` and started building it ${waited} later.`
          : " and started building it soon after."}
        {!isOwner && (
          <>
            {" "}
            Want in? <a href="#comments">Say how you could help</a>.
          </>
        )}
      </p>

      {editing ? (
        form
      ) : (
        <div className={styles.buttons}>
          {building.url && (
            <a
              className="btn btn-primary"
              href={building.url}
              target="_blank"
              rel="noreferrer ugc"
            >
              See it on {hostOf(building.url)}
            </a>
          )}
          {isOwner && (
            <>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={busy}
                onClick={() => setEditing(true)}
              >
                {building.url ? "Change link" : "Add a link"}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={busy}
                onClick={stop}
              >
                Stop building
              </button>
            </>
          )}
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </section>
  );
}
