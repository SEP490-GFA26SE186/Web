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
  const [queue, sellers] = await Promise.all([getReviewQueue(), getSellerApplications("pending")]);
  const user = useAuthStore.getState().user;
  return {
    moderator: { name: user?.fullName || user?.username || "Kiểm duyệt viên", title: "Kiểm duyệt viên", avatar: null },
    navBadges: { storyQueue: queue.length, sellerApplications: sellers.length },
  };
};

/** Chi tiết lượt duyệt: { review, listing, seller, story, checklist, pageViews, progress } */
export const getReview = (reviewId) => call(api.get(`/moderation/submissions/${reviewId}`));
export const claimReview = (reviewId) => call(api.post(`/moderation/submissions/${reviewId}/claim`));
export const viewPage = (reviewId, pageId, comment) =>
  call(api.post(`/moderation/submissions/${reviewId}/pages/${pageId}/view`, comment === undefined ? {} : { comment }));
/** { decision: approved|changes_requested|rejected, comment?, checklist: [{ itemId, passed }] } */
export const decideReview = (reviewId, body) => call(api.post(`/moderation/submissions/${reviewId}/decision`, body));
