import styles from "./hero.module.css";

// Short intro above the feed for visitors who are not logged in.
export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>The ideas people never built</h1>
      <p className={styles.lead}>
        Share an idea you dropped and get an honest teardown: who already
        tried it, why ideas like it usually fail, and the cheapest way to test
        it. Or browse other people&apos;s and pick one up.
      </p>
      <a className="btn btn-primary" href="/api/auth/login?screen_hint=signup">
        Share an idea
      </a>
    </section>
  );
}
