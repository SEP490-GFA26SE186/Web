// Mock Chợ truyện — theo schema rev8: listings (status = published) + price_tiers + seller_profiles + topics.
// Người mua dùng bản đăng bán nguyên trạng (không cá nhân hoá lại sau khi mua).

export const PRICE_TIERS = [
  { id: "pt_free", label: "Miễn phí", priceVnd: 0 },
  { id: "pt_19", label: "19.000đ", priceVnd: 19000 },
  { id: "pt_29", label: "29.000đ", priceVnd: 29000 },
  { id: "pt_49", label: "49.000đ", priceVnd: 49000 },
];

const SELLERS = {
  sel_01: { displayName: "Mẹ Hoa kể chuyện", ratingAvg: 4.8, totalSales: 1240 },
  sel_02: { displayName: "Cô Mai – Giáo viên mầm non", ratingAvg: 4.9, totalSales: 860 },
  sel_03: { displayName: "Bố Tuấn & Bin", ratingAvg: 4.6, totalSales: 310 },
};

// [id, title, description, topicTitle, competency, ageMin, ageMax, pages, priceTierId, sellerId, purchaseCount, ratingAvg, ratingCount, hasAiContent, publishedAt, emoji]
const ROWS = [
  ["l_101", "Bí Mật Của Cây Cổ Thụ Biết Lắng Nghe", "Giúp bé hiểu cảm xúc của bạn khi bạn buồn và cách chăm chú lắng nghe mà không ngắt lời.", "Lắng nghe khi bạn buồn", "social_awareness", 5, 7, 8, "pt_29", "sel_02", 1420, 4.95, 312, true, "2026-09-02", "🌳"],
  ["l_102", "Biệt Đội Đồ Chơi Tự Về Nhà", "Biến việc dọn dẹp đồ chơi thành chuyến phiêu lưu thay vì trận cãi vã.", "Tự giác dọn đồ chơi", "self_management", 5, 6, 6, "pt_19", "sel_01", 2100, 4.9, 455, true, "2026-08-21", "🧸"],
  ["l_103", "Chú Cáo Học Cách Chờ Đến Lượt", "Bé tập làm dịu cảm giác nôn nóng khi xếp hàng ở sân chơi.", "Kiên nhẫn chờ đến lượt", "self_management", 5, 8, 8, "pt_29", "sel_02", 890, 4.85, 140, false, "2026-09-10", "🦊"],
  ["l_104", "Cá Voi Nhỏ Tìm Lại Nụ Cười", "Gọi tên nỗi buồn, chấp nhận cảm xúc và tìm lại niềm vui.", "Gọi tên nỗi buồn", "self_awareness", 5, 8, 10, "pt_49", "sel_01", 1800, 4.97, 380, true, "2026-07-30", "🐋"],
  ["l_105", "Gấu Nhỏ Chia Nửa Hũ Mật", "Gấu nhỏ nhận ra niềm vui khi chia sẻ với người bạn mới.", "Chia sẻ với bạn mới", "relationship_skills", 5, 6, 6, "pt_free", "sel_03", 3250, 4.7, 610, false, "2026-08-05", "🍯"],
  ["l_106", "Sư Tử Con Dám Phát Biểu", "Từng bước tập hít thở và tự tin nói trước cả lớp.", "Tự tin nói trước lớp", "self_awareness", 6, 8, 8, "pt_29", "sel_02", 1100, 4.92, 205, true, "2026-09-15", "🦁"],
  ["l_107", "Ngọn Núi Lửa Trong Bụng Tí", "Nhận biết khi cơn giận sắp bùng lên và bí quyết đếm đến mười.", "Con hay nổi giận", "self_management", 5, 7, 8, "pt_19", "sel_01", 970, 4.8, 166, true, "2026-09-18", "🌋"],
  ["l_108", "Chiếc Ô Của Bạn Nhím", "Trời mưa, Nhím che chung chiếc ô nhỏ với Thỏ dù mình bị ướt một nửa.", "Quan tâm bạn bè", "relationship_skills", 5, 6, 6, "pt_free", "sel_03", 1320, 4.6, 98, false, "2026-08-28", "☂️"],
  ["l_109", "Chiếc Bình Vỡ Của Bin", "Bin lỡ làm vỡ bình hoa và phải chọn: giấu đi hay nói thật với mẹ?", "Dũng cảm nhận lỗi", "responsible_decision_making", 6, 8, 10, "pt_49", "sel_02", 640, 4.88, 87, true, "2026-09-22", "🏺"],
];

export const mockListings = ROWS.map(
  ([id, title, description, topicTitle, competency, ageMin, ageMax, totalPages, priceTierId, sellerId, purchaseCount, ratingAvg, ratingCount, hasAiContent, publishedAt, coverEmoji]) => ({
    id,
    title,
    description,
    topic: { title: topicTitle, competency, ageMin, ageMax },
    totalPages,
    priceTier: PRICE_TIERS.find((t) => t.id === priceTierId),
    seller: { id: sellerId, ...SELLERS[sellerId] },
    purchaseCount,
    ratingAvg,
    ratingCount,
    hasAiContent,
    publishedAt,
    coverEmoji,
  }),
);
