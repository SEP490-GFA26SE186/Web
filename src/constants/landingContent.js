// Nội dung tĩnh của Landing page — chỉnh câu chữ / số liệu marketing tại đây.

export const LANDING_NAV = [
  { id: "gioi-thieu", label: "Giới thiệu" },
  { id: "cach-hoat-dong", label: "Cách hoạt động" },
  { id: "mo-hinh-casel", label: "Mô hình CASEL" },
  { id: "danh-cho-gia-dinh", label: "Dành cho Gia đình & Bé" },
  { id: "cong-dong", label: "Cộng đồng Tác giả" },
];

export const TRUST_BADGES = [
  {
    icon: "star",
    title: "14,000+ Gia đình",
    desc: "Tin tưởng sử dụng",
    tone: "primary",
  },
  // { icon: "shield", title: "Chuẩn COPPA", desc: "100% Không quảng cáo", tone: "secondary" },
  {
    icon: "school",
    title: "Khung CASEL",
    desc: "Khoa học sư phạm Hoa Kỳ",
    tone: "primaryDark",
  },
];

export const HERO_DEMO = {
  chapter: "Chương 2: Cơn giận của Khủng long Roco",
  level: "EQ Level 2",
  narrator: "Giọng đọc Mẹ Ổi ấm áp",
  text: "Roco dẫm chân thật mạnh. Bé cảm thấy lồng ngực như có một ngọn núi lửa nhỏ đang sôi sục! Lúc này, Roco nên làm gì?",
  choices: [
    {
      id: "A",
      text: "Hít thật sâu đếm đến 3 rồi xếp lại",
      tone: "secondary",
      feedback:
        "Roco thở phù một hơi… núi lửa nguội dần. Bé đã rèn luyện Tự quản lý! 🌿",
    },
    {
      id: "B",
      text: "Nhờ mẹ gấu hướng dẫn cách giữ thăng bằng",
      tone: "primary",
      feedback:
        "Mẹ gấu ôm Roco và cùng xếp lại. Biết nhờ giúp đỡ cũng là một kỹ năng tuyệt vời! 🐻",
    },
  ],
  skillBadge: "Rèn luyện Tự quản lý (Self-Management)",
};

export const MISSION_PILLARS = [
  {
    icon: "sad",
    iconTone: "danger",
    eyebrow: "Thực trạng hiện nay",
    eyebrowTone: "danger",
    title: "Thiếu nhận thức cảm xúc cơ bản",
    problem:
      "Trẻ thường biểu hiện giận dữ, khóc lóc hoặc thu mình vì chưa được dạy cách gọi tên chính xác cảm xúc đang diễn ra bên trong cơ thể.",
    solutionIcon: "verified",
    solutionTone: "secondary",
    solution:
      "Bé nhận diện & phân biệt rõ cơn giận, nỗi sợ, sự đồng cảm qua 200+ nhân vật muông thú gần gũi và gương soi cảm xúc.",
  },
  {
    icon: "tvOff",
    iconTone: "neutral",
    eyebrow: "Thực trạng hiện nay",
    eyebrowTone: "muted",
    title: "Tiếp xúc thụ động với màn hình",
    problem:
      "Xem video ngắn ngắt quãng làm suy giảm khả năng tập trung sâu và khiến trẻ mất dần phản xạ tư duy phản biện khi gặp khó khăn ngoài đời.",
    solutionIcon: "lightbulb",
    solutionTone: "primary",
    solution:
      "Tương tác chủ động: Bé đóng vai nhân vật chính, tự đưa ra lựa chọn tại ngã rẽ cốt truyện và chứng kiến hệ quả hành động một cách trực quan.",
  },
  {
    icon: "hourglass",
    iconTone: "neutral",
    eyebrow: "Thực trạng hiện nay",
    eyebrowTone: "muted",
    title: "Khoảng cách trò chuyện gia đình",
    problem:
      "Phụ huynh bận rộn sau ngày dài làm việc, khó mở lời hỏi han sâu sắc hoặc không biết bắt đầu câu chuyện tâm tình cùng con từ đâu.",
    solutionIcon: "family",
    solutionTone: "secondary",
    solution:
      "Gia đình đồng hành: Ba mẹ cá nhân hóa truyện với tên con, nhận gợi ý 3 câu hỏi đối thoại mở sau mỗi chương để gắn kết bền chặt.",
  },
];

export const PRINCIPLES = [
  {
    icon: "check",
    tone: "secondary",
    title: "100% Nội dung kiểm duyệt sư phạm",
    desc: "Mọi kịch bản cốt truyện đều qua bộ lọc an toàn trẻ em và chuyên gia giáo dục sớm thẩm định trước khi hiển thị cho bé.",
  },
  {
    icon: "noCamera",
    tone: "primary",
    title: "Bảo mật danh tính & Không quét khuôn mặt",
    desc: "Hệ thống hoàn toàn không thu thập hình ảnh thật hay dữ liệu sinh trắc học của trẻ. Mọi nhân vật đều là hình vẽ cách điệu nghệ thuật.",
  },
  {
    icon: "lock",
    tone: "neutral",
    title: "Quyền kiểm soát trọn vẹn trong tay phụ huynh",
    desc: "Ba mẹ có thể chỉnh sửa lời thoại, cài đặt giới hạn thời gian đọc hoặc thay đổi ngã rẽ cốt truyện bất cứ lúc nào.",
  },
];

export const WORKFLOW = [
  {
    title: "AI Trợ Lý Đề Xuất Cốt Truyện",
    desc: "Dựa trên tình huống trẻ gặp phải (sợ bóng tối, ghen tị khi có em nhỏ, chia sẻ đồ chơi).",
    tone: "primary",
  },
  {
    title: "Phụ Huynh Tùy Biến & Phê Duyệt",
    desc: "Ba mẹ chỉnh sửa tính cách nhân vật, thêm biệt danh thân thương của con và duyệt bài học cuối.",
    tone: "secondary",
  },
  {
    title: "Hệ Thống Phục Vụ Kid Mode An Toàn",
    desc: "Khóa các đường dẫn ra ngoài, phát âm thanh giọng đọc ấm áp, hiển thị tương tác tối giản dịu mắt.",
    tone: "navy",
  },
];

export const CASEL_SKILLS = [
  {
    icon: "brain",
    tone: "primary",
    title: "Tự nhận thức",
    en: "Self-Awareness",
    desc: "Giúp bé nhận biết nhịp tim đập nhanh khi sợ hãi, nụ cười rạng rỡ khi vui mừng và hiểu được sở thích riêng.",
    stories: 48,
  },
  {
    icon: "calm",
    tone: "secondary",
    title: "Tự quản lý",
    en: "Self-Management",
    desc: "Rèn luyện kỹ thuật thở sâu “bong bóng xà phòng”, kiên nhẫn xếp hàng chờ đến lượt và kiềm chế bốc đồng.",
    stories: 56,
  },
  {
    icon: "heart",
    tone: "navy",
    title: "Đồng cảm",
    en: "Social Awareness",
    desc: "Đặt mình vào góc nhìn của bạn bè, thấu hiểu khi thấy bạn buồn bã và tôn trọng sự khác biệt của những người xung quanh.",
    stories: 42,
  },
  {
    icon: "users",
    tone: "primary",
    title: "Kết nối",
    en: "Relationship Skills",
    desc: "Biết cách nói lời cảm ơn & xin lỗi chân thành, chia sẻ đồ chơi cùng nhóm bạn và giải quyết mâu thuẫn trong hòa bình.",
    stories: 50,
  },
  {
    icon: "scale",
    tone: "secondary",
    title: "Trách nhiệm",
    en: "Responsible Decisions",
    desc: "Tập cân nhắc hậu quả trước khi hành động, giữ lời hứa và tự tin chọn điều đúng đắn dù xung quanh chưa ai làm.",
    stories: 64,
  },
];

export const STEPS = [
  {
    tone: "primary",
    icon: "search",
    scene: ["📱", "🌙", "🧸"],
    gradient: "from-orange-200 via-amber-100 to-rose-100",
    title: "Chọn tình huống hoặc chủ đề cảm xúc",
    desc: "Lựa chọn từ ngân hàng 50+ tình huống thực tế mà bé đang gặp: sợ bóng tối, ghen tị với bạn bè, khó ăn rau, hay chuẩn bị vào lớp 1.",
  },
  {
    tone: "secondary",
    icon: "tune",
    scene: ["🧒", "🌳", "💡"],
    gradient: "from-teal-200 via-emerald-100 to-lime-100",
    title: "Cá nhân hóa nhân vật & ngã rẽ cốt truyện",
    desc: "Nhập tên con, người bạn thân yêu hoặc thú cưng. AI gợi ý các ngã rẽ tình huống đạo đức tương ứng với khung CASEL để rèn luyện tư duy.",
  },
  {
    tone: "navy",
    icon: "book",
    scene: ["👩‍👧", "📖", "✨"],
    gradient: "from-indigo-200 via-violet-100 to-pink-100",
    title: "Cùng con đọc tương tác trong Kid Mode",
    desc: "Bật chế độ đọc an toàn, nghe giọng đọc ấm áp và để con tự tay chạm chọn hành động giải quyết xung đột, sau đó cùng đàm thoại câu hỏi mở.",
  },
];

export const AUDIENCES = [
  {
    icon: "baby",
    tone: "primary",
    title: "Dành cho Cha Mẹ & Bé",
    desc: "Tủ sách tương tác gia đình không giới hạn. Nhận báo cáo tiến trình trưởng thành cảm xúc (EQ Growth Radar) sau mỗi tháng.",
    bullets: [
      "Tùy biến tên & hình mẫu nhân vật",
      "Chế độ đọc ngủ dịu êm không ánh sáng xanh",
      "Gợi ý chủ đề đối thoại mở cha mẹ – con cái",
    ],
    cta: "Bắt đầu tủ sách gia đình",
    to: "signup",
  },
  {
    icon: "pen",
    tone: "secondary",
    title: "Dành cho Tác giả & Giáo viên",
    desc: "Sáng tác truyện phân nhánh dễ dàng trên thư viện mẫu sư phạm chuẩn CASEL. Mở bán truyện trên Chợ truyện văn minh.",
    bullets: [
      "Bộ công cụ biên tập phân nhánh trực quan",
      "Chia sẻ doanh thu 80/20 minh bạch, tức thì",
      "Cộng đồng 500+ nhà giáo dục thẩm định",
    ],
    cta: "Gia nhập Mạng lưới Tác giả",
    to: "signup",
  },
  {
    icon: "school2",
    tone: "navy",
    title: "Dành cho Trường học & Trung tâm",
    desc: "Thư viện câu chuyện tình huống phục vụ giờ sinh hoạt lớp, tiết học kỹ năng sống và các buổi thảo luận nhóm cho học sinh mầm non & tiểu học.",
    bullets: [
      "Giáo án tương tác tích hợp máy chiếu lớp học",
      "Khảo sát đo lường chỉ số đồng cảm tập thể",
      "Hỗ trợ tập huấn giáo viên phương pháp EQ",
    ],
    cta: "Tìm hiểu gói School Solution",
    to: "contact",
  },
];

export const TESTIMONIALS = [
  {
    name: "Chị Hoàng Yến",
    role: "Mẹ bé Bơ (6 tuổi) – Hà Nội",
    avatar: "👩",
    quote:
      "Bé Bơ nhà mình 6 tuổi, trước đây mỗi khi tức giận thường hay ném đồ. Từ ngày cùng mẹ đọc truyện Khủng long Roco, mỗi lần thấy khó chịu bé lại tự giác nói: 'Mẹ ơi con đang như núi lửa, con hít sâu 3 lần đây'. Thực sự rất xúc động!",
  },
  {
    name: "Cô Minh Thư",
    role: "Giáo viên Mầm non Họa Mi – TP.HCM",
    avatar: "👩‍🏫",
    quote:
      "Với tư cách giáo viên mầm non, tôi đánh giá rất cao việc nền tảng bám sát 5 tiêu chí của CASEL. Những ngã rẽ lựa chọn hành vi giúp các con hiểu được nguyên nhân – kết quả tốt hơn nhiều so với việc chỉ nghe giảng giải suông.",
  },
  {
    name: "Anh Tuấn Nam",
    role: "Kỹ sư & Phụ huynh bé Sóc (7 tuổi) – Đà Nẵng",
    avatar: "👨",
    quote:
      "Điều khiến tôi an tâm tuyệt đối là ứng dụng không có bất kỳ quảng cáo linh tinh nào, cũng không đòi hỏi ảnh chụp của con. AI chỉ đóng vai trò gợi ý cốt truyện, còn ba mẹ vẫn là người nắm toàn quyền quyết định.",
  },
];

export const SIGNUP_BONUS_CREDITS = 10;
