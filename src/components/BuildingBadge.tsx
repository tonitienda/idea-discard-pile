import styles from "./building.module.css";

// The site's mark, finished: the outline that was left open is closed, with
// the gold light now inside it.
export function BuildingMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="5"
        width="22"
        height="22"
        rx="6.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <rect className={styles.markLight} x="11" y="11" width="10" height="10" rx="1.6" />
    </svg>
  );
}

export default function BuildingBadge() {
  return (
    <span className={styles.badge}>
      <BuildingMark />
      Building
    </span>
  );
}
