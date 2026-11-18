import styles from "./footer.module.css";

const FEEDBACK_URL = "https://y5mtc76sp1w.typeform.com/to/gqJGirOo";

// Every page ends on the same valley, seen from further along the path.
// The feedback link lives here too, because the nav hides it on phones.
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.line}>Aidia Hub, for the ideas people never built.</p>
        <a href={FEEDBACK_URL} target="_blank" rel="noreferrer">
          Give feedback
        </a>
      </div>
      <div className={`${styles.horizon} view`} aria-hidden="true" />
    </footer>
  );
}
