// import api from "./api";
import { mockDrafts, mockSubscription } from "../mocks/parentDashboard";

// TODO: chưa nối API gói dịch vụ / truyện theo schema rev8 → dùng mock.
const USE_MOCK = true;
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

/** Gói đang dùng (subscriptions + plans). Credit còn lại lấy từ GET /auth/me (wallet.creditBalance) */
export const getSubscription = async () => {
  if (USE_MOCK) {
    await delay(250);
    return structuredClone(mockSubscription);
  }
  // const { data } = await api.get("/subscriptions/me");
  // return data.data;
};

/**
 * Truyện riêng đã tạo xong nhưng ba mẹ chưa xem lại hết từng trang (stories.status = ready, reviewed_at = null).
 * Bắt buộc xem lại trước khi đưa lên giá sách của bé.
 */
export const getPendingDrafts = async () => {
  if (USE_MOCK) {
    await delay(350);
    return structuredClone(mockDrafts);
  }
  // const { data } = await api.get("/stories", { params: { kind: "private", reviewed: false } });
  // return data.data;
};
