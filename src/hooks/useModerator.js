import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getModeratorDashboard,
  getModeratorOverview,
  getReviewQueue,
  getReviewStory,
  resolveReport,
  sampleRandomAudits,
  savePageReview,
  submitReviewDecision,
} from "../services/moderatorService";

export const modKeys = {
  all: ["moderator"],
  overview: ["moderator", "overview"],
  dashboard: ["moderator", "dashboard"],
  queue: (params) => ["moderator", "queue", params],
  review: (id) => ["moderator", "review", id],
};

export const useModeratorOverview = () => useQuery({ queryKey: modKeys.overview, queryFn: getModeratorOverview });

export const useModeratorDashboard = () => useQuery({ queryKey: modKeys.dashboard, queryFn: getModeratorDashboard });

export const useReviewQueue = (params = {}) =>
  useQuery({ queryKey: modKeys.queue(params), queryFn: () => getReviewQueue(params), placeholderData: keepPreviousData });

// Sau mỗi thao tác xử lý, làm mới số liệu tổng quan + badge sidebar
const useInvalidateModerator = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: modKeys.all });
};

export const useResolveReport = () => {
  const invalidate = useInvalidateModerator();
  return useMutation({ mutationFn: ({ id, action }) => resolveReport(id, action), onSuccess: invalidate });
};

export const useSampleAudits = () => {
  const invalidate = useInvalidateModerator();
  return useMutation({ mutationFn: sampleRandomAudits, onSuccess: invalidate });
};

export const useReviewStory = (storyId) =>
  useQuery({ queryKey: modKeys.review(storyId), queryFn: () => getReviewStory(storyId), enabled: !!storyId, retry: false });

export const useSavePageReview = (storyId) =>
  useMutation({ mutationFn: ({ pageNumber, ...payload }) => savePageReview(storyId, pageNumber, payload) });

export const useSubmitDecision = (storyId) => {
  const invalidate = useInvalidateModerator();
  return useMutation({
    mutationFn: ({ decision, note }) => submitReviewDecision(storyId, decision, note),
    onSuccess: invalidate,
  });
};
