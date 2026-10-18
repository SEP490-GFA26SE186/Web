import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  claimReview,
  decideReview,
  decideSeller,
  getModeratorOverview,
  getReview,
  getReviewQueue,
  getSellerApplications,
  viewPage,
} from "../services/moderatorService";

export const modKeys = {
  all: ["moderator"],
  overview: ["moderator", "overview"],
  queue: ["moderator", "queue"],
  sellers: (status) => ["moderator", "sellers", status],
  review: (id) => ["moderator", "review", id],
};

export const useModeratorOverview = () => useQuery({ queryKey: modKeys.overview, queryFn: getModeratorOverview, refetchInterval: 60_000 });
export const useReviewQueue = () => useQuery({ queryKey: modKeys.queue, queryFn: getReviewQueue });
export const useSellerApplications = (status = "pending") =>
  useQuery({ queryKey: modKeys.sellers(status), queryFn: () => getSellerApplications(status) });
export const useReview = (reviewId) => useQuery({ queryKey: modKeys.review(reviewId), queryFn: () => getReview(reviewId), enabled: !!reviewId });

/** Mọi thao tác trả lại chi tiết lượt duyệt → ghi thẳng vào cache; làm mới hàng đợi + badge. */
const useReviewMutation = (reviewId, fn) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (detail) => {
      queryClient.setQueryData(modKeys.review(reviewId), detail);
      queryClient.invalidateQueries({ queryKey: modKeys.queue });
      queryClient.invalidateQueries({ queryKey: modKeys.overview });
    },
  });
};

export const useClaimReview = (reviewId) => useReviewMutation(reviewId, () => claimReview(reviewId));
export const useViewPage = (reviewId) => useReviewMutation(reviewId, ({ pageId, comment }) => viewPage(reviewId, pageId, comment));
export const useDecideReview = (reviewId) => useReviewMutation(reviewId, (body) => decideReview(reviewId, body));

export const useDecideSeller = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, approve }) => decideSeller(userId, approve),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderator", "sellers"] });
      queryClient.invalidateQueries({ queryKey: modKeys.overview });
    },
  });
};
