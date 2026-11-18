"use client";

import { StoreProvider } from "easy-peasy";
import {
  MessageNotification,
  store,
  useStoreActions,
  useStoreState,
} from "../store";
import { BsX } from "react-icons/bs";
import styles from "./toasts.module.css";

const Notification = (props: {
  level: MessageNotification["level"];
  message: MessageNotification["message"];
  onClose: () => void;
}) => (
  <div
    className={`${styles.toast} ${styles[props.level]}`}
    role={props.level === "danger" ? "alert" : "status"}
  >
    <span dangerouslySetInnerHTML={{ __html: props.message }}></span>
    <button
      type="button"
      className={styles.close}
      onClick={props.onClose}
      aria-label="Dismiss"
    >
      <BsX />
    </button>
  </div>
);

function NotificationsBar() {
  const notifications = useStoreState((state) => state.notifications);
  const closeNotification = useStoreActions(
    (actions) => actions.deleteNotification
  );

  if (!notifications.length) {
    return null;
  }

  return (
    <div className={styles.stack}>
      {notifications.map((notification, idx) => (
        <Notification
          key={idx}
          {...notification}
          onClose={() => {
            closeNotification(idx);
          }}
        />
      ))}
    </div>
  );
}

export default function NotificationsBarWrapper() {
  return (
    <StoreProvider store={store}>
      <NotificationsBar />
    </StoreProvider>
  );
}
