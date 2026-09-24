// Mock data cho màn Khám phá của Parent.
// access: { type: "pro" } | { type: "stars", cost } | { type: "included" } (miễn phí trong gói Pro)

export const mockExploreCategories = [
  { id: "all", label: "Tất cả", emoji: null },
  { id: "sharing", label: "Học cách chia sẻ", emoji: "🤝" },
  { id: "confidence", label: "Tự tin & Bản lĩnh", emoji: "🦁" },
  { id: "anger", label: "Kiểm soát cơn giận", emoji: "🧘" },
  { id: "responsibility", label: "Tinh thần trách nhiệm", emoji: "🌱" },
  { id: "habits", label: "Thói quen tốt & Tự lập", emoji: "⏰" },
  { id: "empathy", label: "Yêu thương & Đồng cảm", emoji: "❤️" },
  { id: "bedtime", label: "5 phút trước giờ ngủ", emoji: "🌙" },
];

export const mockExploreStats = [
  { id: "stories", value: "120+", label: "Tập truyện tâm lý", icon: "book", tone: "orange" },
  { id: "pillars", value: "7 Trụ cột", label: "Khung năng lực cảm xúc", icon: "brain", tone: "teal" },
  { id: "practice", value: "100% Thực hành", label: "Nhiệm vụ đời thực gắn kết", icon: "check", tone: "neutral" },
  { id: "rating", value: "4.9 / 5.0", label: "Đánh giá từ chuyên gia", icon: "award", tone: "navy" },
];

// eqIcon: heart | checklist | hourglass | smile | handshake | users | gift | sparkles | moon
export const mockPopularStories = [
  {
    id: "e_101", title: "Bí Mật Của Cây Cổ Thụ Biết Lắng Nghe",
    description: "Giúp bé hiểu cảm xúc người khác khi bạn bè buồn và cách chăm chú lắng nghe mà không ngắt lời.",
    categories: ["empathy"], ageRange: "4-6 tuổi", minutes: 15, rating: 4.95, readers: 1400,
    eqLabel: "Đồng cảm & Thấu hiểu bạn bè", eqIcon: "heart", hasMission: true, access: { type: "pro" },
    coverEmoji: "🌳", coverGradient: "from-emerald-300 via-teal-200 to-amber-100", cover: null,
  },
  {
    id: "e_102", title: "Biệt Đội Đồ Chơi Tự Về Nhà",
    description: "Biến việc dọn dẹp đồ chơi sau khi chơi thành một cuộc phiêu lưu hồi hộp thay vì trận cãi vã.",
    categories: ["responsibility", "habits"], ageRange: "3-5 tuổi", minutes: 10, rating: 4.98, readers: 2100,
    eqLabel: "Trách nhiệm & Tự giác gọn gàng", eqIcon: "checklist", hasMission: true, access: { type: "pro" },
    coverEmoji: "🧸", coverGradient: "from-orange-300 via-amber-200 to-yellow-100", cover: null,
  },
  {
    id: "e_103", title: "Chú Cáo Học Cách Chờ Đến Lượt",
    description: "Dạy bé kỹ năng tự làm dịu cảm giác bồn chồn nôn nóng khi xếp hàng ở sân chơi hoặc chờ bố mẹ.",
    categories: ["anger", "habits"], ageRange: "4-7 tuổi", minutes: 12, rating: 4.91, readers: 890,
    eqLabel: "Kiên nhẫn & Chờ đến lượt", eqIcon: "hourglass", hasMission: true, access: { type: "stars", cost: 15 },
    coverEmoji: "🦊", coverGradient: "from-pink-300 via-rose-200 to-amber-100", cover: null,
  },
  {
    id: "e_104", title: "Cá Voi Nhỏ Tìm Lại Nụ Cười",
    description: "Hành trình giúp trẻ gọi tên nỗi buồn, chấp nhận cảm xúc tiêu cực và tìm lại sự tươi vui tự nhiên.",
    categories: ["empathy", "bedtime"], ageRange: "5-8 tuổi", minutes: 14, rating: 4.97, readers: 1800,
    eqLabel: "Vượt qua nỗi buồn & Tự chữa lành", eqIcon: "smile", hasMission: true, access: { type: "pro" },
    coverEmoji: "🐋", coverGradient: "from-sky-400 via-cyan-300 to-teal-100", cover: null,
  },
  {
    id: "e_105", title: "Gấu Nhỏ Chia Nửa Hũ Mật",
    description: "Gấu nhỏ phát hiện niềm vui khi chia sẻ hũ mật ong yêu thích với người bạn mới chuyển đến khu rừng.",
    categories: ["sharing"], ageRange: "3-5 tuổi", minutes: 9, rating: 4.9, readers: 1250,
    eqLabel: "Chia sẻ & Kết bạn", eqIcon: "handshake", hasMission: true, access: { type: "included" },
    coverEmoji: "🍯", coverGradient: "from-amber-300 via-yellow-200 to-orange-100", cover: null,
  },
  {
    id: "e_106", title: "Sư Tử Con Dám Phát Biểu",
    description: "Sư tử con run run khi phải nói trước cả lớp, nhưng từng bước tập hít thở và tự tin cất tiếng.",
    categories: ["confidence"], ageRange: "5-7 tuổi", minutes: 13, rating: 4.93, readers: 1100,
    eqLabel: "Tự tin nói trước đám đông", eqIcon: "sparkles", hasMission: true, access: { type: "pro" },
    coverEmoji: "🦁", coverGradient: "from-yellow-300 via-orange-200 to-rose-100", cover: null,
  },
  {
    id: "e_107", title: "Ngọn Núi Lửa Trong Bụng Tí",
    description: "Tí học cách nhận biết khi ngọn núi lửa tức giận sắp phun trào và bí quyết đếm đến mười.",
    categories: ["anger"], ageRange: "4-7 tuổi", minutes: 11, rating: 4.89, readers: 970,
    eqLabel: "Nhận diện & Làm dịu cơn giận", eqIcon: "smile", hasMission: true, access: { type: "stars", cost: 10 },
    coverEmoji: "🌋", coverGradient: "from-red-300 via-orange-200 to-amber-100", cover: null,
  },
  {
    id: "e_108", title: "Chú Gà Trống Dậy Sớm",
    description: "Gà trống nhỏ tự lập thời gian biểu buổi sáng: đánh răng, gấp chăn và ăn sáng không cần nhắc.",
    categories: ["habits", "responsibility"], ageRange: "4-6 tuổi", minutes: 8, rating: 4.86, readers: 760,
    eqLabel: "Tự lập & Thói quen buổi sáng", eqIcon: "checklist", hasMission: true, access: { type: "included" },
    coverEmoji: "🐓", coverGradient: "from-lime-300 via-yellow-200 to-orange-100", cover: null,
  },
  {
    id: "e_109", title: "Ru Ngủ Cùng Ánh Trăng",
    description: "Câu chuyện thở chậm theo nhịp sóng biển giúp bé thư giãn cơ thể và chìm vào giấc ngủ êm.",
    categories: ["bedtime"], ageRange: "2-6 tuổi", minutes: 5, rating: 4.96, readers: 2600,
    eqLabel: "Thư giãn & Tự trấn an", eqIcon: "moon", hasMission: false, access: { type: "included" },
    coverEmoji: "🌙", coverGradient: "from-indigo-400 via-purple-300 to-pink-200", cover: null,
  },
  {
    id: "e_110", title: "Chiếc Ô Của Bạn Nhím",
    description: "Trời đổ mưa, bạn Nhím che chung chiếc ô nhỏ với Thỏ dù người mình bị ướt một nửa.",
    categories: ["sharing", "empathy"], ageRange: "3-6 tuổi", minutes: 10, rating: 4.92, readers: 1320,
    eqLabel: "Cho đi & Quan tâm bạn bè", eqIcon: "gift", hasMission: true, access: { type: "stars", cost: 12 },
    coverEmoji: "☂️", coverGradient: "from-sky-300 via-indigo-200 to-violet-100", cover: null,
  },
  {
    id: "e_111", title: "Đom Đóm Không Sợ Bóng Tối",
    description: "Đom đóm nhỏ học cách tự thắp sáng lòng can đảm của mình khi phải bay một mình trong đêm.",
    categories: ["confidence", "bedtime"], ageRange: "4-6 tuổi", minutes: 7, rating: 4.94, readers: 1540,
    eqLabel: "Can đảm vượt nỗi sợ", eqIcon: "sparkles", hasMission: false, access: { type: "pro" },
    coverEmoji: "✨", coverGradient: "from-violet-400 via-indigo-300 to-sky-200", cover: null,
  },
];

export const mockPersonalized = {
  c_001: {
    goal: "Chia sẻ đồ chơi & Hợp tác nhóm",
    weeklyProgress: 65,
    stories: [
      {
        id: "p_201", title: "Hai Chú Sóc Cùng Chia Quả Dẻ",
        description: "Tình huống Bo và bạn bè gặp mâu thuẫn khi chỉ có một món đồ chơi yêu thích duy nhất, giúp bé tự nguyện nhường nhịn.",
        ageRange: "3-5 tuổi", minutes: 12, badge: { label: "Khuyên dùng hôm nay", highlight: true },
        eqGoal: "Chia sẻ & Đồng điệu", eqIcon: "handshake", mission: "Mời bạn chơi chung ô tô 10 phút",
        featured: true, coverEmoji: "🐿️", coverGradient: "from-orange-300 via-amber-200 to-yellow-100", cover: null,
      },
      {
        id: "p_202", title: "Cùng Nhau Vượt Mê Cung Rừng Rậm",
        description: "Khuyến khích bé lắng nghe ý kiến của bạn, cùng phân công vai trò thay vì muốn tự quyết định một mình.",
        ageRange: "5-7 tuổi", minutes: 15, badge: { label: "Miễn phí trong Pro", highlight: false },
        eqGoal: "Hợp tác nhóm & Lắng nghe", eqIcon: "users", mission: "Cùng mẹ xếp bộ lego lâu đài",
        featured: false, coverEmoji: "🦉", coverGradient: "from-emerald-400 via-lime-200 to-yellow-100", cover: null,
      },
      {
        id: "p_203", title: "Nồi Súp Tình Bạn Rừng Xanh",
        description: "Bài học cổ tích chuyển thể hiện đại về niềm vui khi cùng góp sức, giúp bé nhận ra sự cho đi luôn mang lại quả ngọt.",
        ageRange: "4-6 tuổi", minutes: 10, badge: { label: "Miễn phí trong Pro", highlight: false },
        eqGoal: "Cho đi & Biết ơn", eqIcon: "gift", mission: "Cùng chuẩn bị bữa cơm tối",
        featured: false, coverEmoji: "🍲", coverGradient: "from-amber-300 via-orange-200 to-rose-100", cover: null,
      },
    ],
  },
};

mockPersonalized.c_002 = {
  goal: "Tự tin & Kiểm soát cảm xúc",
  weeklyProgress: 40,
  stories: [
    { ...mockPersonalized.c_001.stories[1], featured: true, badge: { label: "Khuyên dùng hôm nay", highlight: true } },
    { ...mockPersonalized.c_001.stories[2] },
    { ...mockPersonalized.c_001.stories[0], featured: false, badge: { label: "Miễn phí trong Pro", highlight: false } },
  ],
};
