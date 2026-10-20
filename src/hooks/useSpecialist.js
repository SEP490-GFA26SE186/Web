import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  claimReview,
  decideReview,
  decideSeller,
  dismissReport,
  getAiFlags,
  getAudits,
  getSpecialistOverview,
  getReportGroups,
  getRestrictedListings,
  getStrikes,
  hideReview,
  issueStrike,
  runAudits,
  setAiBlock,
  suspendListing,
  getReview,
  getReviewQueue,
  getSellerApplications,
  viewPage,
} from "../services/specialistService";

export const modKeys = {
  all: ["specialist"],
  overview: ["specialist", "overview"],
  queue: ["specialist", "queue"],
  sellers: (status) => ["specialist", "sellers", status],
  review: (id) => ["specialist", "review", id],
  reports: (status) => ["specialist", "reports", status],
  restricted: (status) => ["specialist", "restricted", status],
  strikes: (filter) => ["specialist", "strikes", filter],
  audits: ["specialist", "audits"],
  aiFlags: (f) => ["specialist", "ai-flags", f],
};

export const useSpecialistOverview = () => useQuery({ queryKey: modKeys.overview, queryFn: getSpecialistOverview, refetchInterval: 60_000 });
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
      queryClient.invalidateQueries({ queryKey: ["specialist", "sellers"] });
      queryClient.invalidateQueries({ queryKey: modKeys.overview });
    },
  });
};

// Giám sát: mỗi thao tác có thể đổi hàng đợi, báo cáo, truyện tạm gỡ, cảnh cáo → làm mới cả nhóm "specialist".
const useMonitoringMutation = (mutationFn) => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: modKeys.all }) });
};

export const useReportGroups = (status) => useQuery({ queryKey: modKeys.reports(status), queryFn: () => getReportGroups(status) });
export const useRestrictedListings = (status) => useQuery({ queryKey: modKeys.restricted(status), queryFn: () => getRestrictedListings(status) });
export const useStrikes = (filter = {}) => useQuery({ queryKey: modKeys.strikes(filter), queryFn: () => getStrikes(filter) });
export const useAudits = () => useQuery({ queryKey: modKeys.audits, queryFn: getAudits });

export const useDismissReport = () => useMonitoringMutation(dismissReport);
export const useSuspendListing = () => useMonitoringMutation(({ listingId, reason }) => suspendListing(listingId, reason));
export const useIssueStrike = () => useMonitoringMutation(issueStrike);
export const useHideReview = () => useMonitoringMutation(hideReview);
export const useAiFlags = (filter) => useQuery({ queryKey: modKeys.aiFlags(filter), queryFn: () => getAiFlags(filter) });
export const useSetAiBlock = () => useMonitoringMutation(({ userId, ...body }) => setAiBlock(userId, body));
export const useRunAudits = () => useMonitoringMutation(runAudits);
