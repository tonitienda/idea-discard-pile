"use client";

import { BsMoonStars, BsSun } from "react-icons/bs";
import styles from "./nav.module.css";

// Both icons are rendered and CSS shows the one for the active theme, so the
// server markup is the same whatever the visitor's theme is.
export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const current =
      root.dataset.theme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // The choice still applies to this page view.
    }
  };

  return (
    <button
      type="button"
      className={styles.iconButton}
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
    >
      <BsMoonStars className={styles.showInLight} />
      <BsSun className={styles.showInDark} />
    </button>
  );
}
