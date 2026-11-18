import { BsBoxArrowRight } from "react-icons/bs";
import { User } from "../app/api/model";
import NotificationsBell from "./NotificationsBell";
import ThemeToggle from "./ThemeToggle";
import styles from "./nav.module.css";

const FEEDBACK_URL = "https://y5mtc76sp1w.typeform.com/to/gqJGirOo";

export default function NavBar({ user }: { user: User | null }) {
  return (
    <header className={styles.nav}>
      <nav className={styles.inner} aria-label="Main">
        <a className={styles.brand} href="/">
          <svg
            className={styles.mark}
            viewBox="0 0 20 20"
            width="20"
            height="20"
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
              strokeWidth="2"
              strokeDasharray="4.5 3.5"
            />
            <rect className={styles.markLight} x="6.5" y="6.5" width="7" height="7" rx="1" />
          </svg>
          Aidia Hub
        </a>

        <div className={styles.links}>
          <a
            className={`${styles.link} ${styles.wideOnly}`}
            href={FEEDBACK_URL}
            target="_blank"
            rel="noreferrer"
          >
            Give feedback
          </a>
          {user && (
            <a className={styles.link} href="/ideas">
              My ideas
            </a>
          )}
          <ThemeToggle />
          {user ? (
            <>
              <NotificationsBell />
              <a
                className={styles.profile}
                href="/profile"
                title="Your profile"
              >
                <img src={user.picture} alt="Your profile" />
              </a>
              <a
                className={styles.link}
                href="/api/auth/logout"
                title="Log out"
              >
                <span className={styles.wideOnly}>Log out</span>
                <BsBoxArrowRight
                  className={styles.narrowOnly}
                  aria-label="Log out"
                />
              </a>
            </>
          ) : (
            <>
              <a className={styles.link} href="/api/auth/login">
                Log in
              </a>
              <a
                className="btn btn-primary btn-sm"
                href="/api/auth/login?screen_hint=signup"
              >
                Sign up
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
