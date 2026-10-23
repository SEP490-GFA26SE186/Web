import api, { getErrorMessage } from "./api";

// Bán truyện (rev8): hồ sơ người bán, đăng bán bản sao đã gỡ cá nhân hoá, theo dõi kết quả duyệt.
// Lỗi 422 kèm `errors: [{ path, message }]` (vd. "aliases.{NV1}") để tô đỏ đúng ô.
export class SellingError extends Error {
  constructor(error) {
    super(getErrorMessage(error));
    this.status = error.response?.status;
    this.errors = error.response?.data?.errors ?? [];
  }
}

const call = async (request) => {
  try {
    const { data } = await request;
    return data.data;
  } catch (error) {
    throw new SellingError(error);
  }
};

/** → { seller: { status: pending|approved|rejected|suspended, displayName, … } | null, planCanSell } */
export const getMySeller = () => call(api.get("/sellers/me"));
export const applySeller = (payload) => call(api.post("/sellers/apply", payload));

export const getMyListings = async () => (await call(api.get("/listings/mine"))).listings;

/** { storyId, title, description?, priceVnd (0 hoặc 5.000–500.000, bội số 1.000), aliases: [{ token, aliasName }] } → { listing } */
export const createListing = (payload) => call(api.post("/listings", payload));

/** → { sellerStatus, strikeLimit, activeStrikes, strikes: [{ id, source, reason, issuedAt, expiresAt, revokedAt, active, appeal }] } */
export const getMyStrikes = () => call(api.get("/sellers/me/strikes"));
export const appealStrike = (strikeId, reason) => call(api.post(`/sellers/me/strikes/${strikeId}/appeal`, { reason }));

/** Tạo lại các đoạn giọng đọc lỗi / thiếu của bản đăng bán (truyện của người bán). */
export const retryNarration = (storyId) => call(api.post(`/stories/${storyId}/narration/retry`));
