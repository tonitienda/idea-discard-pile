"use client";

import { StoreProvider } from "easy-peasy";
import {
  MessageNotification,
  store,
  useStoreActions,
  useStoreState,
} from "../store";
import { BsX } from "react-icons/bs";

const Notification = (props: {
  level: MessageNotification["level"];
  message: MessageNotification["message"];
  onClose: () => void;
}) => (
  <div
    className={`alert alert-dismissible alert-${props.level}`}
    style={{
      display: "flex",
      justifyContent: "space-between",
      paddingRight: 6,
      borderRadius: 6,
    }}
  >
    <span dangerouslySetInnerHTML={{ __html: props.message }}></span>

    <BsX
      style={{ width: 25, height: 25, cursor: "pointer" }}
      onClick={props.onClose}
    />
  </div>
);

function NotificationsBar() {
  const notifications = useStoreState((state) => state.notifications);
  const closeNotification = useStoreActions(
    (actions) => actions.deleteNotification
  );

  return (
    <>
      {notifications.map((notification, idx) => (
        <Notification
          key={idx}
          {...notification}
          onClose={() => {
            closeNotification(idx);
          }}
        />
      ))}
    </>
  );
}

export default function NotificationsBarWrapper() {
  return (
    <StoreProvider store={store}>
      <NotificationsBar />
    </StoreProvider>
  );
}
