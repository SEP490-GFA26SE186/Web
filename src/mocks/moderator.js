// Mock data cho cổng Kiểm duyệt viên (Moderator).

export const mockModerator = {
  id: "mod_01",
  name: "Hoàng Minh",
  title: "KDV Trưởng Sư Phạm",
  avatar: "https://i.pravatar.cc/100?img=12",
};

export const mockShift = {
  name: "Ca Sáng",
  time: "08:00 - 16:30",
  region: "Việt Nam & SEA",
  code: "#SH-260927-01",
  processedPercent: 94,
  onlineModerators: 5,
  aiGuardEnabled: true,
  avgSla: "14 phút/bản thảo",
};

export const mockNavBadges = { sellerApplications: 4, storyQueue: 12, reports: 6 };

export const mockSummary = {
  sellerApplications: { count: 8, today: 3 },
  storyQueue: { count: 24, priority: 6 },
  reports: { count: 5, urgent: 1 },
  suspended: { count: 3 },
  strikes: { count: 12, atLevel2: 2 },
  audits: { done: 35, target: 50, passRate: 96 },
};

// aiAssist: null = tác giả tự viết 100%
export const mockQueue = [
  {
    id: "rv_101", title: "Khủng long Roco học chia sẻ", interactive: true, resubmission: 0,
    author: "Minh Hằng (Cô Mây)", authorStat: "98% duyệt đậu (14/14)", firstStory: false,
    caselSkill: "Tự quản lý", ageRange: "5-7 tuổi", focus: "Trọng tâm: Xử lý cơn giận & hợp tác",
    aiAssist: 35, aiNote: "Minh họa AI + Lời tác giả", submittedMinutesAgo: 45, slaMinutes: 195,
    coverEmoji: "🦖", coverGradient: "from-emerald-300 via-lime-200 to-amber-100",
  },
  {
    id: "rv_102", title: "Bé Heo Dũng Cảm Đi Khám Răng", interactive: false, resubmission: 2,
    author: "Thầy Đỗ Nam", authorStat: "85% duyệt đậu (8 truyện)", firstStory: false,
    caselSkill: "Nhận thức bản thân", ageRange: "4-6 tuổi", focus: "Sửa lại chi tiết phòng khám bớt sợ",
    aiAssist: null, aiNote: "Tranh minh họa tay", submittedMinutesAgo: 60, slaMinutes: 240,
    coverEmoji: "🐷", coverGradient: "from-pink-300 via-rose-200 to-amber-100",
  },
  {
    id: "rv_103", title: "Chiếc Hộp Bí Mật Của Sóc Con", interactive: true, resubmission: 0,
    author: "Lê Hoàng Yến", authorStat: "100% duyệt đậu (21 truyện)", firstStory: false,
    caselSkill: "Kỹ năng xã hội", ageRange: "6-8 tuổi", focus: "Trọng tâm: Giữ lời hứa và tôn trọng ranh giới",
    aiAssist: 60, aiNote: "Cấu trúc câu hỏi EQ do AI", submittedMinutesAgo: 120, slaMinutes: 300,
    coverEmoji: "🐿️", coverGradient: "from-orange-300 via-amber-200 to-yellow-100",
  },
  {
    id: "rv_104", title: "Ước Mơ Khám Phá Rừng Xanh", interactive: true, resubmission: 0,
    author: "Vườn Cổ Tích Xanh (Tác giả mới)", authorStat: "Truyện đầu tay", firstStory: true,
    caselSkill: "Quyết định có trách nhiệm", ageRange: "7-9 tuổi", focus: "Bảo vệ môi trường rừng ngập mặn",
    aiAssist: 45, aiNote: "Sinh thoại AI tinh chỉnh", submittedMinutesAgo: 180, slaMinutes: 360,
    coverEmoji: "🦎", coverGradient: "from-teal-300 via-emerald-200 to-lime-100",
  },
  {
    id: "rv_105", title: "Mèo Mun Không Sợ Sấm", interactive: true, resubmission: 0,
    author: "Studio Mặt Trời", authorStat: "92% duyệt đậu (11 truyện)", firstStory: false,
    caselSkill: "Tự quản lý", ageRange: "3-5 tuổi", focus: "Trọng tâm: Tự trấn an khi sợ hãi",
    aiAssist: 50, aiNote: "Minh họa AI + Lời tác giả", submittedMinutesAgo: 210, slaMinutes: 380,
    coverEmoji: "🐈‍⬛", coverGradient: "from-indigo-300 via-violet-200 to-sky-100",
  },
  {
    id: "rv_106", title: "Hai Bạn Voi Chung Một Chiếc Ô", interactive: false, resubmission: 1,
    author: "Ngọc Lâm", authorStat: "88% duyệt đậu (9 truyện)", firstStory: false,
    caselSkill: null, ageRange: "4-6 tuổi", focus: "Trọng tâm: Chia sẻ khi bạn gặp khó",
    aiAssist: 20, aiNote: "Tác giả vẽ tay + AI tô màu", submittedMinutesAgo: 240, slaMinutes: 420,
    coverEmoji: "🐘", coverGradient: "from-sky-300 via-cyan-200 to-teal-100",
  },
];

export const mockReports = [
  {
    id: "REP-8902", severity: "urgent", slaLabel: "SLA 1h", sentMinutesAgo: 18,
    reporter: "Mẹ Lan Hương (Phụ huynh bé 5 tuổi)", reporterType: "parent",
    storyTitle: "Lạc vào mê cung kẹo ngọt", storyAuthor: "MoonKid_Studio",
    reason: "Nội dung hình ảnh có chi tiết hơi rùng rợn ở trang 4 — hình ảnh người sói trong góc tối có răng nanh chảy máu không phù hợp lứa tuổi mầm non, bé nhà mình đọc trước giờ đi ngủ bị giật mình khóc.",
    primaryAction: { type: "hide_page", label: "Tạm ẩn trang 4 ngay" },
    secondaryLabel: "Mở hồ sơ",
  },
  {
    id: "REP-8894", severity: "normal", slaLabel: "SLA 24h", sentMinutesAgo: 120,
    reporter: "Cô giáo Trần Mai (Trường Mầm non Tuổi Thơ)", reporterType: "teacher",
    storyTitle: "Chuyến dã ngoại của Thỏ Trắng", storyAuthor: "Thỏ Mẹ Kể Chuyện",
    reason: "Hội thoại ở lựa chọn B khuyến khích giấu bí mật với người lớn khi gặp nguy hiểm ở bờ sông. Trái với nguyên tắc an toàn thể chất của lứa tuổi 4-6 tuổi.",
    primaryAction: { type: "request_fix", label: "Yêu cầu tác giả chỉnh nhánh B" },
    secondaryLabel: "Chi tiết nhánh",
  },
  {
    id: "REP-8887", severity: "normal", slaLabel: "SLA 24h", sentMinutesAgo: 300,
    reporter: "Bố Quang Huy (Phụ huynh bé 7 tuổi)", reporterType: "parent",
    storyTitle: "Siêu Nhân Nhí Giải Cứu Thành Phố", storyAuthor: "Hero Kids VN",
    reason: "Nhân vật chính dùng từ 'đồ ngốc' với bạn 3 lần, bé nhà mình bắt chước nói theo ở trường.",
    primaryAction: { type: "request_fix", label: "Yêu cầu tác giả sửa lời thoại" },
    secondaryLabel: "Xem trang",
  },
];

export const mockWeeklyAudit = {
  week: "Tuần 39 / 2026",
  done: 35,
  target: 50,
  deadline: "thứ Sáu 17:00",
  criteria: [
    { label: "Tiêu chuẩn bản quyền ảnh minh họa", pass: 100 },
    { label: "Tính xác thực sư phạm chuẩn CASEL", pass: 96 },
    { label: "Không rò rỉ dữ liệu trẻ em (COPPA)", pass: 100 },
  ],
};

export const mockAiFlags = [
  {
    id: "flag_1", subject: "Seller #289 (Trần Bá Nam)", level: "anomaly",
    detail: "Tần suất tạo lại hình ảnh bất thường: 45 lần/giờ liên tục bằng prompt chứa chi tiết bạo lực nhẹ.",
    highlight: "45 lần/giờ", source: "Hệ thống AI Guard chặn tầng 1", action: "Xem log Prompt",
  },
  {
    id: "flag_2", subject: 'Truyện #ST-882 ("Hành tinh Răng Khểnh")', level: "review",
    detail: "Tỷ lệ phát hiện từ khóa nhạy cảm lọc tầng 1 vượt mức bình thường: 14 từ thuộc danh mục ngôn từ dọa dẫm.",
    source: "Được kích hoạt bởi AI Llama-Guard", action: "Phân tích văn bản",
  },
];

// ===== Không gian kiểm duyệt =====

// Checklist bắt buộc cho từng trang. aiPrefill: AI Guard tự tích sẵn, KDV vẫn có thể bỏ tích nếu thấy sai.
export const REVIEW_CHECKLIST = [
  {
    id: "privacy", title: "Quyền riêng tư & Bản quyền", tone: "secondary", icon: "privacy",
    items: [
      { key: "anonymized", title: "Đã ẩn danh họ tên thật của trẻ em", desc: "Không chứa tên riêng nhạy cảm hoặc địa chỉ liên lạc gia đình.", aiPrefill: true },
      { key: "no_real_photo", title: "Không tải lên ảnh chụp người thật", desc: "Chân dung nhân vật là tranh minh họa AI hoạt hình hư cấu.", aiPrefill: true },
      { key: "no_ip", title: "Không vi phạm nhân vật thương mại", desc: "Bộ lọc đối chiếu Disney / Pixar / Marvel: Không trùng lặp (Pass 100%).", aiPrefill: true },
    ],
  },
  {
    id: "casel", title: "Khung Sư Phạm CASEL (Bắt buộc)", tone: "primary", icon: "casel",
    items: [
      { key: "learning_goal", title: "Bám sát mục tiêu học tập cảm xúc", desc: "Mục tiêu: Nhận diện & hạ hỏa cơn giận an toàn cho trẻ." },
      { key: "casel_signal", title: "Tương thích chính xác tín hiệu CASEL", desc: "Các nhánh lựa chọn cấp điểm EQ đúng danh mục Self-Management." },
      { key: "age_fit", title: "Phù hợp nhận thức lứa tuổi 5-7 tuổi", desc: "Ngôn từ trong sáng, kết cấu câu ngắn, không kích động giận dữ." },
      { key: "healing", title: "Mạch truyện nhân văn & chữa lành", desc: "Kết thúc hướng tới giải pháp hợp tác, xây đắp mối quan hệ tích cực." },
      { key: "no_forced_emotion", title: "Không ép buộc cảm xúc hoặc dạy lệch chuẩn", desc: "Xác nhận trẻ không bị bắt phải kìm nén cảm xúc một cách tiêu cực." },
    ],
  },
  {
    id: "safety", title: "An toàn nội dung", tone: "secondary", icon: "safety",
    items: [
      { key: "no_violence", title: "Không ngôn từ bạo lực / xúc phạm", desc: "AI Guard Safety Confidence: 0.99 (Tuyệt đối lành mạnh).", aiPrefill: true },
      { key: "kid_visual", title: "Hình ảnh chuẩn thị giác thiếu nhi", desc: "Màu sắc ấm áp, không u ám, không gây hoảng sợ ban đêm.", aiPrefill: true },
      { key: "no_ads", title: "Không quảng cáo & liên kết ngoài", desc: "Bảo vệ không gian số thuần khiết cho người học nhỏ tuổi.", aiPrefill: true },
    ],
  },
];

export const QUICK_FEEDBACK = [
  "Lời thoại hơi dài so với lứa tuổi, tác giả rút gọn còn 2-3 câu ngắn giúp nhé.",
  "Hình minh họa hơi tối, đề nghị tăng độ sáng và tông màu ấm.",
  "Nhánh lựa chọn chưa gắn đúng năng lực CASEL, tác giả kiểm tra lại giúp.",
  "Tránh dùng từ mang tính chê bai nhân vật (ví dụ: 'hư', 'ngốc').",
];

const ALL_KEYS = REVIEW_CHECKLIST.flatMap((s) => s.items.map((i) => i.key));
const AI_KEYS = REVIEW_CHECKLIST.flatMap((s) => s.items.filter((i) => i.aiPrefill).map((i) => i.key));
export const allChecked = () => Object.fromEntries(ALL_KEYS.map((k) => [k, true]));
export const aiPrefilled = () => Object.fromEntries(ALL_KEYS.map((k) => [k, AI_KEYS.includes(k)]));

const page = (number, title, emoji, gradient, text, extra = {}) => ({
  number, title, emoji, gradient, text,
  label: null, highlight: null, choices: null,
  audio: { voice: "Giọng đọc AI: Miền Bắc truyền cảm", seconds: 30 + number * 2, speed: 0.9 },
  imageModel: "Flux Dev Sư Phạm",
  ...extra,
});

const rocoPages = [
  page(1, "Khủng long nhỏ Roco", "🦖", "from-emerald-300 via-lime-200 to-amber-100", "Ở khu rừng Xanh Mướt có một chú khủng long nhỏ tên là Roco. Roco rất thích xây lâu đài cát bên bờ suối.", { label: "Bìa" }),
  page(2, "Khủng long bị bạn làm đổ cát", "🏰", "from-amber-300 via-orange-200 to-rose-100", "Một hôm, bạn Sóc chạy vội qua và vô tình làm đổ tòa tháp cát cao nhất của Roco."),
  page(3, "Cảm giác nóng bừng trong ngực", "🔥", "from-orange-300 via-red-200 to-amber-100", "Roco thấy trong ngực nóng bừng lên như có một đốm lửa nhỏ. Đó là cơn giận đang lớn dần."),
  page(4, "Roco muốn hét thật to", "💨", "from-slate-300 via-sky-200 to-indigo-100", "Roco muốn hét thật to và giậm chân thật mạnh. Nhưng Roco nhớ lời mẹ dặn: “Khi giận, con hãy dừng lại một chút.”"),
  page(5, "Lựa chọn phản ứng", "🛤️", "from-teal-300 via-emerald-200 to-lime-100", "Roco đứng trước hai con đường. Bé hãy giúp Roco chọn cách bình tĩnh lại nhé!", {
    label: "Điểm rẽ",
    choices: [
      { id: "a", text: "Thử hít thở thật sâu như thổi bong bóng", tags: [{ label: "Tự quản lý (+3 điểm)", tone: "primary" }], main: true },
      { id: "b", text: "Đi dạo một vòng quanh bờ suối", tags: [{ label: "Tự quản lý cảm xúc (+2 điểm)", tone: "neutral" }], main: false },
    ],
  }),
  page(6, "Kỹ thuật Thở Bong Bóng", "🫧", "from-sky-300 via-cyan-200 to-teal-100", "Roco hít vào thật chậm bằng mũi, rồi thổi ra từ từ như đang thổi một quả bong bóng khổng lồ."),
  page(7, "Bình tâm và nói cảm xúc", "😌", "from-teal-300 via-cyan-200 to-sky-100", "Cơn nóng trong ngực dịu dần. Roco nói nhỏ: “Tớ đang buồn và giận vì tháp cát bị đổ.”"),
  page(8, "Thảo luận & Hóa giải bất hòa", "🤝", "from-lime-300 via-emerald-200 to-teal-100",
    "Roco hít một hơi thật sâu như đang thổi một quả bong bóng xà phòng vô hình khổng lồ. Cơn nóng trong bụng dần tan biến. Roco nhìn bạn Sóc và bảo:", {
      highlight: "‘Tớ đã rất giận khi tháp cát bị đổ, nhưng tớ biết cậu không cố ý. Chúng mình cùng xây lại nhé!’",
      branchLabel: "Nhánh quyết định A (Hòa giải)",
      audio: { voice: "Giọng đọc AI: Miền Bắc truyền cảm", seconds: 42, speed: 0.9 },
      choices: [
        { id: "a", text: "Cùng bạn Sóc gom lại cát và vỏ sò", tags: [{ label: "Kỹ năng quan hệ", tone: "secondary" }, { label: "Tự quản lý (+3 điểm)", tone: "primary" }], main: true },
        { id: "b", text: "Đi tìm một góc yên tĩnh để vẽ tranh", tags: [{ label: "Tự quản lý cảm xúc (+2 điểm)", tone: "neutral" }], main: false },
      ],
    }),
  page(9, "Cùng nhau xây tháp mới", "🏖️", "from-amber-300 via-yellow-200 to-orange-100", "Roco và bạn Sóc cùng nhau xây một tòa lâu đài còn to và đẹp hơn trước, có cả cửa sổ bằng vỏ sò."),
  page(10, "Lời kết & Tín hiệu CASEL", "🌟", "from-indigo-300 via-violet-200 to-pink-100", "Tối hôm đó, Roco kể cho mẹ nghe. Mẹ ôm Roco và thì thầm: “Mẹ tự hào vì con đã biết dừng lại và nói ra cảm xúc.”", { label: "Kết thúc" }),
];

export const mockReviewStory = {
  id: "rv_101",
  title: "Hành trình Vượt Qua Cơn Giận của Bạn Khủng Long Nhỏ",
  author: "Mẹ Thu Hằng",
  authorBadge: "Level 2 Seller (98% Uy tín)",
  ageRange: "5-7 tuổi",
  price: 45000,
  template: "Mẫu #CASEL-SM-04",
  scanner: "CASEL Vietnamese Lexicon v3.2",
  pages: rocoPages.map((p) => ({
    ...p,
    // Trang 1–7 đã duyệt, trang 8 đang xem (thiếu 1 mục CASEL), trang 9–10 chưa xem
    status: p.number <= 7 ? "approved" : "pending",
    checks:
      p.number <= 7
        ? allChecked()
        : p.number === 8
          ? { ...allChecked(), no_forced_emotion: false }
          : aiPrefilled(),
    note: "",
    flagged: false,
  })),
  history: [
    { id: "h1", time: "08:12", author: "AI Guard", type: "ai", text: "Quét tự động toàn bộ 10 trang: 0 vi phạm ngôn từ, 0 hình ảnh nhạy cảm." },
    { id: "h2", time: "08:40", author: "KDV Lan Anh", type: "note", text: "Lần nộp trước đã yêu cầu sửa trang 6 (câu hướng dẫn thở quá dài). Tác giả đã chỉnh đạt." },
  ],
};
