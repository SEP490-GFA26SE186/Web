import api, { getErrorMessage } from "./api";

// Chợ truyện (rev8): truyện đã được Moderator duyệt, mua qua payOS (0đ nhận ngay).
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

export const getPriceTiers = async () => (await call(api.get("/listings/price-tiers"))).priceTiers;

/**
 * params: { search, competency, age, priceTierId, sort: best_selling | rating | newest | price_asc, page, limit }
 * → { items: [{ id, title, description, topic{title, competency, ageMin, ageMax}, totalPages, priceTier, seller, purchaseCount, ratingAvg, ratingCount, hasAiContent, owned, publishedStoryId }], pagination }
 */
export const getListings = (params) =>
  call(api.get("/market/listings", { params: Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null)) }));

/** → listing (+ preview: chữ trang đầu, isMine) */
export const getListing = async (listingId) => (await call(api.get(`/market/listings/${listingId}`))).listing;

export const getOwnedListings = async () => (await call(api.get("/market/owned"))).items;

/** POST /market/checkout { listingId } → { order, checkoutUrl } (null với truyện miễn phí) */
export const checkoutListing = (listingId) => call(api.post("/market/checkout", { listingId }));
