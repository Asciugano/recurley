import { create } from "zustand";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";

interface SubscriptionsStore {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  setSubscription: (subscriptions: Subscription[]) => void;
}

export const useSubscriptionStore = create<SubscriptionsStore>((set) => ({
  subscriptions: HOME_SUBSCRIPTIONS,
  addSubscription: (subscription) =>
    set((state) => ({ subscriptions: [subscription, ...state.subscriptions] })),
  setSubscription: (subscriptions) => set({ subscriptions }),
}));
