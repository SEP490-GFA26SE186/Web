// Nội dung tĩnh của Landing page. Chỉ ghi điều sản phẩm làm thật (rev8, 2026-10-18) — không số liệu marketing,
// không lời khen giả. Đổi tính năng thì sửa ở đây.

export const LANDING_NAV = [
  { id: "gioi-thieu", label: "Giới thiệu" },
  { id: "cach-hoat-dong", label: "Cách hoạt động" },
  { id: "mo-hinh-casel", label: "Mô hình CASEL" },
  { id: "danh-cho-gia-dinh", label: "Gia đình & Người bán" },
  { id: "cau-hoi", label: "Câu hỏi thường gặp" },
];

export const TRUST_BADGES = [
  { icon: "school", title: "Khung CASEL", desc: "5 năng lực cảm xúc – xã hội", tone: "primaryDark" },
  { icon: "shield", title: "Không quảng cáo", desc: "Không cần ảnh của bé", tone: "secondary" },
  { icon: "star", title: "Duyệt từng trang", desc: "Truyện trên Chợ đều qua kiểm duyệt", tone: "primary" },
];

// Mô phỏng một điểm dừng "Giải quyết tình huống" trong Kid Mode (bé nghe câu hỏi, chạm chọn, nghe phản hồi).
export const HERO_DEMO = {
  chapter: "Bài học: Khi con nổi giận",
  level: "5–8 tuổi",
  narrator: "Giọng đọc kể truyện tiếng Việt",
  text: "Lâu đài khối gỗ của Bin đổ sập. Bin thấy mặt nóng bừng, tay nắm chặt. Lúc này Bin nên làm gì?",
  choices: [
    {
      id: "A",
      text: "Hít thật sâu, đếm đến 3 rồi xếp lại",
      tone: "secondary",
      feedback: "Bin thở chậm… cơn giận dịu dần. Bin xếp lại lâu đài còn cao hơn lúc nãy! 🌿",
    },
    {
      id: "B",
      text: "Nhờ bà giúp giữ khối gỗ cho vững",
      tone: "primary",
      feedback: "Bà cùng Bin xếp lại. Biết nhờ người lớn giúp cũng là một cách giỏi! 🧱",
    },
  ],
  skillBadge: "Rèn luyện Tự quản lý (Self-Management)",
};

export const MISSION_PILLARS = [
  {
    icon: "sad",
    iconTone: "danger",
    eyebrow: "Điều ba mẹ hay gặp",
    eyebrowTone: "danger",
    title: "Bé chưa biết gọi tên cảm xúc",
    problem: "Trẻ 5–8 tuổi hay giận dữ, khóc hoặc thu mình vì chưa biết nói ra mình đang cảm thấy gì.",
    solutionIcon: "verified",
    solutionTone: "secondary",
    solution: "Trong truyện, bé được hỏi “nhân vật đang cảm thấy thế nào?” và chọn cảm xúc. Chọn chưa đúng thì có gợi ý để thử lại.",
  },
  {
    icon: "tvOff",
    iconTone: "neutral",
    eyebrow: "Điều ba mẹ hay gặp",
    eyebrowTone: "muted",
    title: "Xem màn hình một cách thụ động",
    problem: "Video ngắn nối tiếp nhau khiến trẻ chỉ xem, ít phải nghĩ xem mình sẽ làm gì khi gặp chuyện tương tự.",
    solutionIcon: "lightbulb",
    solutionTone: "primary",
    solution: "Truyện dừng lại ở những điểm quan trọng để bé tự chọn cách xử lý, rồi nghe xem chuyện gì xảy ra tiếp theo.",
  },
  {
    icon: "hourglass",
    iconTone: "neutral",
    eyebrow: "Điều ba mẹ hay gặp",
    eyebrowTone: "muted",
    title: "Khó biết con đang tiến bộ ở đâu",
    problem: "Ba mẹ bận rộn, khó theo dõi con đã hiểu cảm xúc của mình và của người khác đến đâu.",
    solutionIcon: "family",
    solutionTone: "secondary",
    solution: "Báo cáo EQ tổng hợp câu trả lời của bé theo 5 năng lực CASEL, kèm gợi ý hoạt động để ba mẹ cùng con luyện tập.",
  },
];

export const PRINCIPLES = [
  {
    icon: "check",
    tone: "secondary",
    title: "Ba mẹ duyệt trước, bé mới đọc",
    desc: "Chữ do AI viết đi qua bộ lọc từ khoá do kiểm duyệt viên quản lý. Truyện chỉ lên giá sách của bé khi ba mẹ đã xem và bấm hoàn tất. Truyện trên Chợ được kiểm duyệt viên đọc từng trang theo checklist.",
  },
  {
    icon: "noCamera",
    tone: "primary",
    title: "Không cần ảnh, không lộ tên thật",
    desc: "Nhân vật được mô tả bằng chữ. Tên thật của bé và người thân được thay bằng mã trước khi gửi cho AI, và được thay bằng tên chung khi đăng bán.",
  },
  {
    icon: "lock",
    tone: "neutral",
    title: "Ba mẹ giữ quyền kiểm soát",
    desc: "Sửa từng trang, từng câu hỏi bất cứ lúc nào. Chế độ Trẻ Em khoá các nút ra ngoài; thoát ra cần mã PIN của ba mẹ.",
  },
];

export const WORKFLOW = [
  { title: "AI viết theo tình huống thật", desc: "Ba mẹ kể chuyện bé vừa gặp, chọn bài học — AI viết truyện kèm câu hỏi.", tone: "primary" },
  { title: "Ba mẹ sửa & hoàn tất", desc: "Chỉnh câu chữ, câu hỏi cho hợp với con rồi bấm hoàn tất.", tone: "secondary" },
  { title: "Bé đọc an toàn trong Kid Mode", desc: "Giọng đọc kể truyện, chạm để trả lời, không có đường dẫn ra ngoài.", tone: "navy" },
];

// 5 năng lực CASEL — mỗi bài học (do kiểm duyệt viên soạn) gắn đúng một năng lực.
export const CASEL_SKILLS = [
  {
    icon: "brain",
    tone: "primary",
    title: "Tự nhận thức",
    en: "Self-Awareness",
    desc: "Nhận ra mình đang vui, buồn, giận hay sợ — và vì sao.",
  },
  {
    icon: "calm",
    tone: "secondary",
    title: "Tự quản lý",
    en: "Self-Management",
    desc: "Bình tĩnh lại khi giận, kiên nhẫn chờ đến lượt, kiềm chế hành động bốc đồng.",
  },
  {
    icon: "heart",
    tone: "navy",
    title: "Nhận thức xã hội",
    en: "Social Awareness",
    desc: "Đặt mình vào vị trí người khác, hiểu khi bạn buồn hay ông bà mệt.",
  },
  {
    icon: "users",
    tone: "primary",
    title: "Kỹ năng quan hệ",
    en: "Relationship Skills",
    desc: "Nói lời cảm ơn, xin lỗi, chia sẻ đồ chơi và giải quyết mâu thuẫn nhẹ nhàng.",
  },
  {
    icon: "scale",
    tone: "secondary",
    title: "Ra quyết định có trách nhiệm",
    en: "Responsible Decisions",
    desc: "Nghĩ đến điều sẽ xảy ra trước khi làm, giữ lời hứa, chọn điều đúng.",
  },
];

export const STEPS = [
  {
    tone: "primary",
    icon: "search",
    scene: ["🧒", "😤", "🧱"],
    gradient: "from-orange-200 via-amber-100 to-rose-100",
    title: "Chọn bài học & kể tình huống của con",
    desc: "Chọn một bài học theo 5 năng lực CASEL, kể chuyện bé vừa gặp (ví dụ: nổi giận khi đồ chơi đổ) và chọn nhân vật — bé, ông bà, anh chị, thú cưng.",
  },
  {
    tone: "secondary",
    icon: "tune",
    scene: ["✍️", "📖", "💡"],
    gradient: "from-teal-200 via-emerald-100 to-lime-100",
    title: "AI viết giúp — hoặc ba mẹ tự viết",
    desc: "AI viết truyện 6–10 trang kèm các câu hỏi cảm xúc và tình huống; ba mẹ sửa thoải mái. Muốn tự viết từ đầu cũng được.",
  },
  {
    tone: "navy",
    icon: "book",
    scene: ["👩‍👧", "🔊", "✨"],
    gradient: "from-indigo-200 via-violet-100 to-pink-100",
    title: "Bé nghe truyện và trả lời trong Kid Mode",
    desc: "Giọng đọc kể truyện cho bé chưa biết chữ. Bé chạm để chọn câu trả lời, nghe phản hồi; câu trả lời được tổng hợp vào Báo cáo EQ.",
  },
];

export const AUDIENCES = [
  {
    icon: "baby",
    tone: "primary",
    title: "Dành cho ba mẹ & bé",
    desc: "Truyện riêng cho con dựa trên tình huống thật, giọng đọc tiếng Việt và báo cáo tiến bộ cảm xúc.",
    bullets: [
      "Nhân vật gia đình mô tả bằng chữ, dùng lại cho mọi truyện",
      "Giọng đọc kể truyện cho bé chưa biết chữ",
      "Báo cáo EQ theo 5 năng lực, kèm gợi ý hoạt động",
    ],
    cta: "Tạo tài khoản miễn phí",
    to: "signup",
  },
  {
    icon: "pen",
    tone: "secondary",
    title: "Dành cho ba mẹ muốn bán truyện",
    desc: "Truyện ba mẹ đã viết có thể đăng lên Chợ truyện để các gia đình khác cùng dùng (cần gói Gia đình và hồ sơ người bán được duyệt).",
    bullets: [
      "Tên thật của gia đình được thay bằng tên chung trước khi đăng",
      "Kiểm duyệt viên đọc từng trang theo checklist trước khi lên Chợ",
      "Nhận 80% giá bán; tiền giữ 3 ngày rồi rút về tài khoản ngân hàng",
    ],
    cta: "Bắt đầu viết truyện",
    to: "signup",
  },
];

export const FAQS = [
  {
    q: "Bé chưa biết chữ có dùng được không?",
    a: "Được. Truyện có giọng đọc kể truyện tiếng Việt; câu hỏi và các lựa chọn cũng được đọc to, bé chỉ cần chạm để trả lời. Truyện ba mẹ tắt giọng đọc sẽ hiện nhãn “Chỉ có chữ”.",
  },
  {
    q: "AI có biết tên thật của con tôi không?",
    a: "Không. Trước khi gửi cho AI, tên của bé và người thân được thay bằng mã như {NV1}. Tên thật chỉ ghép lại khi hiển thị cho gia đình và khi đọc giọng.",
  },
  {
    q: "Ai kiểm tra nội dung trước khi bé đọc?",
    a: "Truyện của gia đình: ba mẹ đọc lại và bấm hoàn tất. Truyện mua trên Chợ: kiểm duyệt viên đọc 100% số trang theo checklist sư phạm. Phụ huynh có thể báo cáo truyện không phù hợp; đủ nhiều báo cáo, truyện tự tạm gỡ chờ xem lại.",
  },
  {
    q: "Credit là gì, có mất phí không?",
    a: "Credit dùng cho các lần AI viết truyện. Gói Miễn phí cấp credit mỗi tháng; gói Gia đình cấp nhiều hơn và mở tính năng bán truyện. Truyện tự viết không tốn credit. Thanh toán bằng chuyển khoản ngân hàng hoặc quét mã VietQR.",
  },
  {
    q: "Điểm EQ của con được tính thế nào?",
    a: "Từ câu trả lời ở lượt đọc đầu tiên của mỗi truyện, theo năng lực CASEL của bài học. Mỗi năng lực cần ít nhất 5 câu trả lời mới hiện điểm, để tránh kết luận vội.",
  },
  {
    q: "Mua truyện rồi không hài lòng thì sao?",
    a: "Ba mẹ gửi yêu cầu hoàn tiền trong 3 ngày kể từ lúc thanh toán, ở mục Lịch sử thanh toán. Quản trị viên xem xét và chuyển trả vào tài khoản đã thanh toán.",
  },
];
