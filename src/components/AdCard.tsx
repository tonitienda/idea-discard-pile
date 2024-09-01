import DateComponent from "./DateComponent";
import styles from "./ideafeed.module.css";

export function AdCard() {
  return (
    <div className={styles.idea}>
      <div className={styles.header}>
        <img
          src={"images/ideabot_avatar.webp"}
          alt={"@adbot"}
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <h3 className={styles.ownerHandle}>{"@adbot"}</h3>
          <p className={styles.meta}></p>
        </div>
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>Sponsored</h2>
        <p
          className={styles.description}
          dangerouslySetInnerHTML={{
            __html: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXXXXXXXX" data-ad-slot="XXXXXXX"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`,
          }}
        />
      </div>
      <div className={styles.tags}>
        {/* {idea.tags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            #{tag}
          </span>
        ))} */}
      </div>
    </div>
  );
}
