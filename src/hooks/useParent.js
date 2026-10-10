import { useQuery } from "@tanstack/react-query";
import { getPendingDrafts, getSubscription } from "../services/parentService";
import useAuthStore from "../stores/authStore";

export const parentKeys = {
  subscription: ["parent", "subscription"],
  drafts: ["parent", "drafts"],
};

export const useSubscription = () => useQuery({ queryKey: parentKeys.subscription, queryFn: getSubscription });

export const usePendingDrafts = () => useQuery({ queryKey: parentKeys.drafts, queryFn: getPendingDrafts });

/** Thông tin phụ huynh hiển thị trên giao diện: tên & credit lấy từ /auth/me, gói lấy từ subscription (mock) */
export const useParentProfile = () => {
  const user = useAuthStore((s) => s.user);
  const { data: subscription } = useSubscription();
  return {
    name: user?.fullName || user?.username || "Ba mẹ",
    email: user?.email,
    creditBalance: user?.wallet?.creditBalance ?? null,
    planName: subscription?.plan.name,
  };
};
