import { PublicUser } from "../app/api/model";
import styles from "./comments.module.css";

// Shown to the idea's owner: who pressed "I can help".
export default function HelpersList({ helpers }: { helpers: PublicUser[] }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>People who offered to help</h2>
      {helpers.length === 0 ? (
        <p className={styles.empty}>Nobody yet.</p>
      ) : (
        <>
          <ul className={styles.helpers}>
            {helpers.map((h) => (
              <li key={h.id} className={styles.helper}>
                <img src={h.picture} alt="" className={styles.avatar} />
                {h.handle}
              </li>
            ))}
          </ul>
          <p className={styles.hint}>
            Reply in the comments to start the conversation.
          </p>
        </>
      )}
    </section>
  );
}
