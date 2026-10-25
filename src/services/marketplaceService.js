import api, { getErrorMessage } from "./api";

// Chợ truyện (rev8): truyện đã được chuyên gia duyệt, mua qua payOS (0đ nhận ngay).
// Người mua dùng bản đăng bán nguyên trạng (tên chung) — quyền đọc là entitlement.
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

/**
 * params: { search, competency, age, priceMin?, priceMax?, sort: best_selling | rating | newest | price_asc, page, limit }
 * → { items: [{ id, title, description, topic{title, competency, ageMin, ageMax}, totalPages, priceVnd, seller, purchaseCount, ratingAvg, ratingCount, hasAiContent, owned, publishedStoryId }], pagination }
 */
export const getListings = (params) =>
  call(api.get("/market/listings", { params: Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null)) }));

/** → listing (+ preview: chữ trang đầu, isMine) */
export const getListing = async (listingId) => (await call(api.get(`/market/listings/${listingId}`))).listing;


/** Hồ sơ công khai người bán → { seller{ id, displayName, bio, expertise, totalSales, ratingAvg, ratingCount, listingCount, sellingSince }, items } */
export const getSellerProfile = (sellerId) => call(api.get(`/market/sellers/${sellerId}`));

/** POST /market/checkout { listingId } → { order, checkoutUrl } (null với truyện miễn phí) */
export const checkoutListing = (listingId) => call(api.post("/market/checkout", { listingId }));

/** Báo cáo truyện đang bán: { category, description?, pageId? } → { reportId, suspended }. Đã báo cáo → 409. */
export const reportListing = (listingId, body) => call(api.post(`/market/listings/${listingId}/reports`, body));

/** Đánh giá của truyện → { reviews, distribution, myReview, canReview, reason, isSeller, tags } */
export const getReviews = (listingId) => call(api.get(`/market/listings/${listingId}/reviews`));
/** Tạo / sửa đánh giá của mình: { rating, comment?, tags? } */
export const saveReview = (listingId, body) => call(api.put(`/market/listings/${listingId}/review`, body));
export const replyReview = (reviewId, reply) => call(api.post(`/market/reviews/${reviewId}/reply`, { reply }));
export const reportReview = (reviewId, body) => call(api.post(`/market/reviews/${reviewId}/reports`, body));
