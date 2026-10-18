import api, { getErrorMessage } from "./api";

const call = async (request) => {
  try {
    const { data } = await request;
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

/**
 * GET /subscriptions/me → { isFallback, plan{ code, name, creditsPerMonth, maxChildren, maxCharacters, canSell, … },
 * status, periodEnd, usage{ childrenCount, charactersCount } }. Credit còn lại lấy từ GET /auth/me (wallet.creditBalance).
 */
export const getSubscription = async () => (await call(api.get("/subscriptions/me"))).data;

/**
 * Truyện riêng đã tạo xong nhưng ba mẹ chưa xem lại (stories.status = ready, reviewed_at = null).
 * Bắt buộc xem lại trước khi đưa lên giá sách của bé.
 * Mỗi truyện: { id, title, topic{ title, competency }, mode: "ai"|"manual", length, pageCount, checkpointCount, … }
 */
export const getPendingDrafts = async () =>
  (await call(api.get("/stories", { params: { status: "ready", reviewed: "false", limit: 20 } }))).data;
