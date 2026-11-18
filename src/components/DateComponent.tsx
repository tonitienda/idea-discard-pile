"use client";

import { useEffect, useState } from "react";
import { format, formatDistanceToNowStrict } from "date-fns";

const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
const RELATIVE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

// The server renders a plain UTC date. After mount it becomes "3 days ago"
// for recent dates, or the date in the reader's time zone for older ones,
// which avoids a hydration mismatch.
export default function DateComponent({ date }: { date: Date | string }) {
  const d = new Date(date);
  const valid = !isNaN(d.getTime());
  const iso = valid ? d.toISOString() : "";
  const [label, setLabel] = useState(
    valid
      ? `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
      : ""
  );
  const [title, setTitle] = useState<string>();

  useEffect(() => {
    if (!iso) {
      return;
    }
    const local = new Date(iso);
    setTitle(format(local, "PPp"));
    setLabel(
      Date.now() - local.getTime() < RELATIVE_WINDOW_MS
        ? formatDistanceToNowStrict(local, { addSuffix: true })
        : format(local, "MMM d, yyyy")
    );
  }, [iso]);

  return (
    <time dateTime={iso} title={title}>
      {label}
    </time>
  );
}
