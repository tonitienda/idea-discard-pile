"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BsBell } from "react-icons/bs";
import { Notification } from "../app/api/model";
import DateComponent from "./DateComponent";
import styles from "./notifications-bell.module.css";

const VERBS: Record<Notification["type"], string> = {
  comment: "commented on",
  icanhelp: "can help with",
  building: "started building",
};

const describe = (n: Notification) => VERBS[n.type] ?? "updated";

export default function NotificationsBell() {
  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        setUnreadCount(data.unreadCount);
      }
    } catch {
      // The bell stays empty; nothing else depends on it.
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (
        (e instanceof KeyboardEvent && e.key === "Escape") ||
        (e instanceof MouseEvent &&
          !wrapper.current?.contains(e.target as Node))
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const toggle = async () => {
    const opening = !open;
    setOpen(opening);
    if (opening && unreadCount > 0) {
      // Items keep their unread highlight until the panel is reopened.
      setUnreadCount(0);
      await fetch("/api/notifications/read", { method: "POST" });
    } else if (!opening) {
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <div className={styles.wrapper} ref={wrapper}>
      <button
        type="button"
        className={styles.bell}
        onClick={toggle}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-expanded={open}
      >
        <BsBell />
        {unreadCount > 0 && (
          <span className={styles.badge}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className={styles.panel}>
          {items.length === 0 ? (
            <p className={styles.empty}>
              No notifications yet. You&apos;ll hear here when someone comments
              on your ideas or offers to help.
            </p>
          ) : (
            <ul className={styles.list}>
              {items.map((n) => (
                <li key={n.id}>
                  <a
                    href={`/ideas/${n.idea.slug}${
                      n.type === "comment" ? "#comments" : ""
                    }`}
                    className={`${styles.item} ${
                      n.read ? "" : styles.unread
                    }`}
                  >
                    <img src={n.actor.picture} alt="" className={styles.avatar} />
                    <div>
                      <p className={styles.text}>
                        <strong>{n.actor.handle}</strong> {describe(n)}{" "}
                        <strong>{n.idea.title}</strong>
                      </p>
                      {n.excerpt && (
                        <p className={styles.excerpt}>{n.excerpt}</p>
                      )}
                      <span className={styles.time}>
                        <DateComponent date={n.createdAt} />
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
