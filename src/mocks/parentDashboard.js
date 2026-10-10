// Mock cho màn Tổng quan của Parent — theo schema rev8.

// subscriptions + plans (Free / Family). Credit còn lại lấy từ /auth/me (wallet.creditBalance)
export const mockSubscription = {
  plan: { code: "free", name: "Gói Miễn phí", maxChildren: 2, maxCharacters: 4, creditsPerMonth: 20, canSell: false },
  status: "active",
  periodEnd: "2026-10-31T23:59:59+07:00",
};

// stories (kind = private, status = ready, reviewed_at = null): ba mẹ phải xem lại hết từng trang
// trước khi đưa lên giá sách. reviewedPages: số trang đã xem trong lần xem lại hiện tại.
export const mockDrafts = [
  {
    id: "s_201",
    title: "Bo và Chiếc Xe Đồ Chơi Của Bin",
    topic: { title: "Chia sẻ đồ chơi với em", competency: "relationship_skills" },
    mode: "ai", // ai: "Viết giúp tôi" · manual: "Tự viết"
    length: "medium",
    totalPages: 8,
    checkpointsCount: 4,
    reviewedPages: 5,
    useAiImage: true,
    useTts: true,
  },
];
