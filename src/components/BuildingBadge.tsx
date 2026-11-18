import styles from "./building.module.css";

// The site's mark, inked in: the dashed pencil square of "not built yet"
// drawn solid, with the gold light inside.
export function BuildingMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="16"
        height="16"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <rect className={styles.markLight} x="6.5" y="6.5" width="7" height="7" rx="1" />
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
