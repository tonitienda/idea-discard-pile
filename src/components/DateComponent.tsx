"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

// The server renders in UTC and the browser in local time, so the local
// format is applied only after mount to avoid a hydration mismatch.
export default function DateComponent({ date }: { date: Date | string }) {
  const d = new Date(date);
  const iso = isNaN(d.getTime()) ? "" : d.toISOString();
  const [label, setLabel] = useState(iso.slice(0, 10).replaceAll("-", "/"));

  useEffect(() => {
    if (iso) {
      setLabel(format(new Date(iso), "yyyy/MM/dd HH:mm"));
    }
  }, [iso]);

  return <time dateTime={iso}>{label}</time>;
}
