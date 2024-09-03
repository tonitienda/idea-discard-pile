import { createTypedHooks, Action, createStore, action } from "easy-peasy";

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

export type MessageNotification = {
  level: "info" | "warning" | "danger" | "success";
  message: TrustedHTML;
};

type StoreModel = {
  notifications: MessageNotification[];
  addNotification: Action<StoreModel, MessageNotification>;
  deleteNotification: Action<StoreModel, number>;
};

export const store = createStore<StoreModel>({
  notifications: [],
  addNotification: action((state, payload) => {
    state.notifications.push(payload);
  }),
  deleteNotification: action((state, index) => {
    state.notifications.splice(index, 1);
  }),
});
