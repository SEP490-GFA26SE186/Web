import api, { getErrorMessage } from "./api";
import useAuthStore from "../stores/authStore";

// Kiểm duyệt (rev8): hàng đợi truyện đăng bán, nhận bài, xem trang, checklist, quyết định;
// hồ sơ người bán. Lỗi BE (422 kèm errors) giữ nguyên message tiếng Việt.
const call = async (request) => {
  try {
    const { data } = await request;
    return data.data;
  } catch (error) {
    const err = new Error(getErrorMessage(error), { cause: error });
    err.status = error.response?.status;
    throw err;
  }
};

/** GET /moderation/submissions → [{ reviewId, listingId, title, seller, priceVnd, topic, competency, pageCount, hasAiContent, submittedAt, claimedBy }] */
export const getReviewQueue = async () => (await call(api.get("/moderation/submissions"))).queue;

/** GET /moderation/sellers?status= → hồ sơ người bán */
export const getSellerApplications = async (status = "pending") =>
  (await call(api.get("/moderation/sellers", { params: { status } }))).sellers;

export const decideSeller = (userId, approve) => call(api.post(`/moderation/sellers/${userId}/decision`, { approve }));

/** Thông tin cho layout: tên Moderator + badge số việc đang chờ. */
export const getModeratorOverview = async () => {
  const [queue, sellers, reports] = await Promise.all([getReviewQueue(), getSellerApplications("pending"), getReportGroups("open")]);
  const user = useAuthStore.getState().user;
  return {
    moderator: { name: user?.fullName || user?.username || "Kiểm duyệt viên", title: "Kiểm duyệt viên", avatar: null },
    navBadges: {
      storyQueue: queue.length,
      sellerApplications: sellers.length,
      reports: reports.reduce((n, g) => n + g.reports.length, 0),
      audits: queue.filter((q) => q.reviewType === "random_audit").length,
    },
  };
};

/** Chi tiết lượt duyệt: { review, listing, seller, story, checklist, pageViews, progress } */
export const getReview = (reviewId) => call(api.get(`/moderation/submissions/${reviewId}`));
export const claimReview = (reviewId) => call(api.post(`/moderation/submissions/${reviewId}/claim`));
export const viewPage = (reviewId, pageId, comment) =>
  call(api.post(`/moderation/submissions/${reviewId}/pages/${pageId}/view`, comment === undefined ? {} : { comment }));
/**
 * Lượt nộp bán: { decision: approved|changes_requested|rejected, comment?, checklist, issueStrike? }.
 * Lượt hậu kiểm (report_followup / random_audit): approved = giữ, taken_down = gỡ hẳn (BE tự cảnh cáo).
 */
export const decideReview = (reviewId, body) => call(api.post(`/moderation/submissions/${reviewId}/decision`, body));

// ---------------------------------------------------------------------------
// Giám sát (luồng 7): báo cáo, tạm gỡ, cảnh cáo, kiểm tra ngẫu nhiên
// ---------------------------------------------------------------------------

/** GET /moderation/reports?status → [{ listing, openReview, reports: [{ id, category, description, status, reporter, pageOrder, createdAt }] }] */
export const getReportGroups = async (status = "open") => (await call(api.get("/moderation/reports", { params: { status } }))).groups;
export const dismissReport = (reportId) => call(api.post(`/moderation/reports/${reportId}/dismiss`));

/** GET /moderation/listings?status=suspended|archived */
export const getRestrictedListings = async (status = "suspended") => (await call(api.get("/moderation/listings", { params: { status } }))).listings;
/** → { listingId, status, reviewId } — tạm gỡ + tạo lượt hậu kiểm */
export const suspendListing = (listingId, reason) => call(api.post(`/moderation/listings/${listingId}/suspend`, { reason }));

/** GET /moderation/strikes → { strikeLimit, strikes } */
export const getStrikes = ({ active } = {}) => call(api.get("/moderation/strikes", { params: active ? { active: "true" } : {} }));
/** { sellerId, source: report|rejection|takedown, sourceId?, reason } → { strikeId, activeStrikes, strikeLimit, sellerSuspended } */
export const issueStrike = (body) => call(api.post("/moderation/strikes", body));

export const getAudits = async () => (await call(api.get("/moderation/audits"))).audits;
/** → { created, reviewIds } */
export const runAudits = (count) => call(api.post("/moderation/audits/run", count ? { count } : {}));

/** Ẩn đánh giá vi phạm (đóng các báo cáo đang mở của đánh giá, tính lại điểm truyện) */
export const hideReview = (reviewId) => call(api.post(`/moderation/product-reviews/${reviewId}/hide`));
