import styles from "./hero.module.css";

const SIGNUP_URL = "/api/auth/login?screen_hint=signup";

// Intro above the feed for visitors who are not logged in. The headline sits
// on bare paper with a painted valley under it, and a gold path through it:
// the light is someone helping. The call to action looks like the idea box
// members get, so the first thing a visitor sees is the thing they would do.
export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>The ideas people never built</h1>
      <p className={styles.lead}>
        Post the idea you gave up on. We&apos;ll tell you who already tried
        it, why ideas like it usually fail, and the cheapest way to test it.
        Then someone here might help you build it.
      </p>
      <a className={styles.prompt} href={SIGNUP_URL}>
        <span className={styles.placeholder}>
          What&apos;s the idea you never built?
        </span>
        <span className="btn btn-primary">Share an idea</span>
      </a>
      <div className={`${styles.landscape} view`} aria-hidden="true" />
    </section>
  );
}
