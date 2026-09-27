// Mock data cho cổng Admin (Hệ thống & Tài chính). Tiền tệ lưu bằng VND (số nguyên).

export const mockAdmin = {
  id: "admin_01",
  name: "Hoàng Minh",
  role: "Super Admin",
  avatar: "https://i.pravatar.cc/100?img=12",
};

export const mockSystemStatus = {
  env: "Production (VN-Central)",
  version: "V1.4.2",
  uptime: 99.98,
  aiHealthy: true,
  navBadges: { withdrawals: 5, refunds: 2, appeals: 3 },
};

// ===== Dashboard điều hành =====
// Số liệu theo khoảng thời gian. "scale" dùng để mock số liệu cho các khoảng khác 7 ngày.
export const DATE_RANGES = [
  { value: "today", label: "Hôm nay", scale: 0.16 },
  { value: "7d", label: "7 ngày qua", scale: 1 },
  { value: "month", label: "Tháng này", scale: 4.1 },
  { value: "year", label: "Năm 2026", scale: 38 },
];

export const mockKpisBase = {
  parents: { total: 14820, growth: 8.4, activeRate: 91.2 },
  sellers: { active: 342, newThisPeriod: 18, revenueShare: "80/20" },
  subscriptions: { total: 3150, growth: 12.0, renewRate: 89.4 },
  gmv: { amount: 482_600_000, growth: 15.3, transactions: 12410 },
  commission: { amount: 96_520_000, rate: 20, escrow: 41_200_000 },
  aiCost: { amount: 28_450_000, grossMargin: 70.5, revenueShare: 5.89 },
};

export const mockWithdrawals = [
  { id: "WD-1201", seller: "Mẹ Thu Hằng", initials: "TH", badge: { label: "Level 2 Seller", tone: "secondary" }, bank: "Vietcombank •• 9428", amount: 3_450_000, note: "Đủ 7 ngày Escrow" },
  { id: "WD-1199", seller: "Vườn Cổ Tích Xanh", initials: "VC", badge: { label: "Top Partner", tone: "primary" }, bank: "Techcombank •• 1083", amount: 5_200_000, note: "Doanh số T9/2026" },
  { id: "WD-1196", seller: "Minh Hằng (Cô Mây)", initials: "MH", badge: { label: "Level 3 Seller", tone: "secondary" }, bank: "MB Bank •• 5521", amount: 4_150_000, note: "Đủ 7 ngày Escrow" },
  { id: "WD-1194", seller: "Studio Mặt Trời", initials: "SM", badge: { label: "Level 2 Seller", tone: "secondary" }, bank: "ACB •• 7730", amount: 3_200_000, note: "Đủ 7 ngày Escrow" },
  { id: "WD-1190", seller: "Thầy Đỗ Nam", initials: "ĐN", badge: { label: "Level 1 Seller", tone: "neutral" }, bank: "BIDV •• 2046", amount: 2_200_000, note: "Đủ 7 ngày Escrow" },
];

export const mockAppeals = [
  {
    id: "KN-8924", title: 'Truyện "Chú Khủng Long Nhút Nhát"', strike: 2, author: "Ngọc Lâm", hoursAgo: 4, priority: true,
    detail: 'khiếu nại quyết định gán nhãn "Nội dung gây sợ hãi trẻ em" của KDV #04. Kèm tài liệu tham vấn chuyên gia tâm lý mầm non.',
    status: "Ưu tiên xử lý",
  },
  {
    id: "KN-8919", title: "Nghi vấn trùng lặp Prompt AI", strike: 1, author: "Studio Mặt Trời", hoursAgo: 18, priority: false,
    detail: "chứng minh chuỗi Seed và phác thảo vector độc quyền trên hệ thống StoryWeaver Canvas.",
    status: "Chờ kiểm chứng AI",
  },
  {
    id: "KN-8911", title: 'Truyện "Bé Heo Đi Lạc"', strike: 1, author: "Heo Hồng Studio", hoursAgo: 22, priority: false,
    detail: "cho rằng tình huống đi lạc đã có hướng dẫn an toàn rõ ràng ở trang kết.",
    status: "Chờ thẩm định",
  },
];

export const mockRefunds = [
  {
    id: "RF-4401", type: "payment", title: "Lỗi quét trùng VietQR", amount: 299_000,
    who: "Phụ huynh", name: "Đỗ Thùy Trang", context: "(Gói Gia Đình 6 tháng). payOS ghi nhận 2 giao dịch liên tiếp cách nhau 4 giây.",
    verification: "payOS xác nhận: Trùng lặp", canRefund: true,
  },
  {
    id: "RF-4398", type: "tts", title: "Lỗi TTS Audio Truyện", amount: 45_000,
    who: "Tài khoản bé", name: "Bé Minh Khang (Gia đình An)", context: ". File giọng đọc chapter 3 bị ngắt đoạn do timeout TTS pipeline.",
    verification: "Đã cấp lại tín chỉ AI", canRefund: false,
  },
];

// Doanh thu gộp & chi phí AI theo tuần (triệu VND)
export const mockRevenueSeries = {
  labels: ["01/09", "08/09", "15/09", "22/09", "Hôm nay (27/09)"],
  revenue: [62, 88, 112, 128, 158],
  aiCost: [5.1, 5.9, 6.4, 7.2, 8.1],
  netMargin: 64.6,
};

export const mockRevenueBreakdown = [
  { label: "Gói Gia Đình (Sub)", amount: 279_908_000, share: 58, tone: "primary" },
  { label: "Hoa hồng chợ 20%", amount: 96_520_000, share: 27, tone: "secondary" },
  { label: "Nạp AI Credits", amount: 72_390_000, share: 15, tone: "navy" },
];

export const mockPricingTiers = [
  { level: 1, name: "Khung Nhập Môn", price: 25_000, desc: "Truyện ngắn 4-6 trang, EQ cảm xúc cơ bản", copies: 5820, share: 47 },
  { level: 2, name: "Khung Tương Tác", price: 45_000, desc: "Đa nhánh kết thúc, bài học EQ lồng ghép", copies: 4910, share: 39 },
  { level: 3, name: "Khung Cao Cấp", price: 79_000, desc: "Series truyện dài, full lồng tiếng Neural TTS", copies: 1680, share: 14 },
];

export const mockEscrow = { days: 7, sellerPayout: 80, onTimeRate: 99.9 };

export const mockPipeline = [
  { id: "llm", name: "OpenAI GPT-4o Mini", status: "Ổn định", desc: "Cốt truyện, phân nhánh & gợi ý EQ", left: ["Latency", "1.2s"], right: ["Đơn giá", "$0.002/call"] },
  { id: "img", name: "Flux.1-Dev Illustrated", status: "Ổn định", desc: "Minh họa sư phạm & bìa hoạt họa", left: ["Hàng đợi", "3 jobs"], right: ["Đơn giá", "$0.025/ảnh"] },
  { id: "tts", name: "Vietnamese Neural TTS", status: "Ổn định", desc: "Giọng đọc biểu cảm phụ huynh & gấu", left: ["Tốc độ", "420 ký tự/s"], right: ["Chất lượng", "48kHz HD"], rightTone: "secondary" },
  { id: "pay", name: "Cổng payOS VietQR", status: "99.85%", desc: "Thanh toán tức thời Napas 247", left: ["Webhooks", "< 350ms"], right: ["Thất bại", "0.15%"], rightTone: "danger" },
];

// ===== Cấu hình AI Engine =====
export const CREDIT_RATE_VND = 1000; // 1 Credit = 1.000đ
export const USD_TO_VND = 25_000;

export const mockAiKpis = {
  monthlySpendUsd: 1300.7,
  spendDelta: -4.2,
  requests24h: 28491,
  successRate: 99.98,
};

export const mockAiActions = [
  { id: "outline", name: "Tạo khung dàn ý truyện theo mẫu CASEL", desc: "Thiết lập tình huống EQ, phân nhánh cảm xúc cốt truyện", icon: "brain", tone: "primary", category: "llm", model: "GPT-4o-mini v2", modelNote: "Temp: 0.72 • Top-P: 0.9", provider: "OpenAI", apiCostUsd: 0.003, unit: "lần", credits: 2, enabled: true },
  { id: "polish", name: "Tinh chỉnh và nâng cấp đoạn văn bản", desc: "Làm mượt từ vựng sư phạm, gia tăng tính tương tác", icon: "edit", tone: "secondary", category: "llm", model: "Claude 3.5 Sonnet", modelNote: "Prompt Empathy-Pedagogy", provider: "Anthropic", apiCostUsd: 0.008, unit: "lần", credits: 1, enabled: true },
  { id: "portrait", name: "Tạo chân dung tham chiếu nhân vật (2 tùy chọn)", desc: "Sinh seed nhân vật đồng nhất xuyên suốt cuốn sách", icon: "face", tone: "primary", category: "image", model: "Flux.1-Dev", modelNote: "Fine-tuned ChildArt LoRA", provider: "Replicate", apiCostUsd: 0.04, unit: "cặp ảnh", credits: 5, enabled: true },
  { id: "page_image", name: "Tạo hình minh họa trang sách (1 ảnh)", desc: "Khổ dọc 3:4, an toàn thị giác trẻ nhỏ", icon: "brush", tone: "secondary", category: "image", model: "Flux.1-Dev", modelNote: "ChildArt v2 • ControlNet", provider: "AWS Bedrock", apiCostUsd: 0.035, unit: "trang", credits: 4, enabled: true },
  { id: "regenerate", name: "Vẽ lại hình minh họa (Regenerate)", desc: "Tối ưu tốc độ cao, giữ bối cảnh câu chuyện", icon: "replay", tone: "navy", category: "image", model: "Flux.1-Schnell Fast", modelNote: "4-Step Latent Iteration", provider: "AWS Bedrock", apiCostUsd: 0.015, unit: "ảnh", credits: 2, enabled: true },
  { id: "tts", name: "Tổng hợp giọng đọc truyền cảm tiếng Việt (TTS 1 trang)", desc: "Giọng Chị Hướng Dương ấm áp, ngắt nghỉ theo cảm xúc", icon: "voice", tone: "primary", category: "tts", model: "VoiceWeaver VN Neural", modelNote: "Kid-friendly Intonation", provider: "ElevenLabs", apiCostUsd: 0.012, unit: "trang", credits: 2, enabled: true },
];

export const mockProviders = [
  { id: "openai", name: "OpenAI Cluster", tag: "Primary LLM", tone: "secondary", icon: "brain", models: "GPT-4o, GPT-4o-mini v2 (Dàn ý & Phân tích tâm lý trẻ)", status: "240ms • Hoạt động tốt", keyLabel: "Khóa Production API Key", keyMasked: "sk-live-•••••••••••••4A92", spentUsd: 420.5, quotaUsd: 2000, lastRotated: "12/08/2026" },
  { id: "bedrock", name: "AWS Bedrock & Replicate", tag: "Image Engine", tone: "primary", icon: "brush", models: "Flux.1-Dev, Schnell Fast (Cụm GPU sinh minh họa sách tranh)", status: "GPU Warm 99.2% • Sẵn sàng", keyLabel: "Khóa Secret ARN & API Key", keyMasked: "aws-live-•••••••••••••88F1", spentUsd: 685.2, quotaUsd: 3500, lastRotated: "30/08/2026" },
  { id: "elevenlabs", name: "ElevenLabs TTS Vietnamese", tag: "Audio Engine", tone: "navy", icon: "voice", models: "Chị Hướng Dương & Chú Gấu Bắc Cực (Voice Model v2.4)", status: "310ms • Trực tuyến", keyLabel: "Khóa Voice Engine Key", keyMasked: "el-live-•••••••••••••33BC", spentUsd: 195, quotaUsd: 1000, lastRotated: "02/09/2026" },
];

export const mockGuardrails = {
  rateLimitEnabled: true,
  imagesPerHour: 30,
  cooldownMinutes: 15,
  autoFailover: true,
  failoverErrorRate: 5,
  failoverWindowMinutes: 3,
  failoverFrom: "OpenAI",
  failoverTo: "Claude 3.5 Haiku",
  failoverLastTriggered: "12 ngày trước",
  coppaMasking: true, // bắt buộc theo pháp lý, không cho tắt
  avgLatency: 1.48,
};

export const mockPromptTemplates = {
  total: 14,
  items: [
    { id: "tpl_anger", tag: "Tự nhận thức cảm xúc", tone: "secondary", version: "v3.2", title: "Nhận biết & Chấp nhận Cơn giận", prompt: "Khi bé gặp mâu thuẫn tranh giành đồ chơi, hướng dẫn câu chuyện qua hình ảnh chú Rồng nhỏ học cách thở ra bong bóng xà phòng thay vì phun lửa...", model: "GPT-4o-mini v2" },
    { id: "tpl_empathy", tag: "Đồng cảm & Chia sẻ", tone: "primary", version: "v2.8", title: "Lắng nghe & An ủi Bạn bè", prompt: "Dẫn dắt bé quan sát ngôn ngữ cơ thể của bạn thỏ đang ủ rũ, khuyến khích bé đưa ra 3 phương án lựa chọn hành vi vị tha...", model: "Claude 3.5 Sonnet" },
    { id: "tpl_dark", tag: "Vượt qua nỗi sợ bóng tối", tone: "navy", version: "v4.1", title: "Chiếc Đèn Ngủ Đom Đóm", prompt: "Biến các bóng đen trong phòng ngủ thành những đám mây thú bông hiền lành, kích thích trí tưởng tượng tích cực trước giờ ngủ...", model: "Flux.1-Dev (ChildArt)" },
  ],
};

export const mockAuditLog = [
  { id: "a1", time: "27/09/2026 08:14", actor: "Hoàng Minh", action: "Đổi giá tác vụ “Vẽ lại hình minh họa” 3 → 2 Credits" },
  { id: "a2", time: "25/09/2026 16:02", actor: "Hoàng Minh", action: "Xoay vòng khóa ElevenLabs (el-live-…33BC)" },
  { id: "a3", time: "22/09/2026 10:47", actor: "Lan Anh (Admin)", action: "Tăng hạn mức sinh ảnh 25 → 30 lần/giờ" },
  { id: "a4", time: "15/09/2026 09:30", actor: "Hệ thống", action: "Auto-failover kích hoạt: OpenAI → Claude 3.5 Haiku (4 phút)" },
  { id: "a5", time: "12/08/2026 14:05", actor: "Hoàng Minh", action: "Xoay vòng khóa OpenAI (sk-live-…4A92)" },
];
