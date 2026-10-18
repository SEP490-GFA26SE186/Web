import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkoutPlan, getOrder, getPlans } from "../services/billingService";
import { parentKeys } from "./useParent";
import { refreshCredit } from "./useStudio";

export const usePlans = () => useQuery({ queryKey: ["billing", "plans"], queryFn: getPlans, staleTime: 5 * 60_000 });

export const useCheckoutPlan = () => useMutation({ mutationFn: checkoutPlan });

/** Trạng thái đơn: hỏi lại mỗi 3 s khi còn chờ (tối đa ~3 phút); xong thì làm mới gói + credit. */
export const useOrder = (orderId) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["billing", "order", orderId],
    queryFn: async () => {
      const order = await getOrder(orderId);
      if (order.status !== "pending") {
        queryClient.invalidateQueries({ queryKey: parentKeys.subscription });
        refreshCredit(queryClient);
      }
      return order;
    },
    enabled: !!orderId,
    refetchInterval: (query) =>
      query.state.data?.status === "pending" && query.state.dataUpdateCount < 60 ? 3000 : false,
  });
};
