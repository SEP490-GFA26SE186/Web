// Mock data cho màn hình Tổng quan của Parent.
// Khi BE xong API, xóa file này và cập nhật parentService.js.

export const mockParent = {
  id: "p_001",
  name: "Mẹ Lan Hương",
  plan: "Gói Gia Đình",
  avatar: "https://i.pravatar.cc/100?img=47",
};

export const mockChildren = [
  {
    id: "c_001", name: "Bé Bo", age: 5, birthday: "2019-06-15", gender: "boy", loveStars: 12, avatarEmoji: "🧒",
    levelTitle: "Nhà Thám Hiểm Rừng Xanh", level: 4, xp: 780, xpNext: 1000, storiesHeard: 28, synced: true,
  },
  {
    id: "c_002", name: "Bé Bông", age: 3, birthday: "2021-11-20", gender: "girl", loveStars: 6, avatarEmoji: "👧",
    levelTitle: "Hạt Mầm Cổ Tích", level: 2, xp: 240, xpNext: 500, storiesHeard: 9, synced: true,
  },
];

export const mockDashboard = {
  c_001: {
    todaySummary: {
      completedStories: 1,
      topic: "sự chia sẻ",
      earnedStars: 5,
    },
    continueReading: {
      storyId: "s_101",
      title: "Gấu Bo và Cây Cầu Cầu Vồng",
      chapter: 3,
      totalChapters: 5,
      chapterTitle: "Bí mật dòng suối lấp lánh",
      description:
        "Bo và Thỏ Trắng đang học cách lắng nghe tín hiệu của dòng suối thần để tìm viên đá điều ước.",
      skillTag: "Học cách hợp tác & kiên nhẫn",
      lastReadAt: "19:30 tối nay",
      progress: 65,
      minutesLeft: 8,
      cover: null,
      coverEmoji: "🐻",
      coverGradient: "from-indigo-300 via-fuchsia-200 to-amber-200",
    },
    stats: {
      readingMinutesToday: 28,
      readingDeltaMinutes: 12,
      completedBooks: 14,
      pendingDrafts: 1,
      loveStars: 12,
    },
    // 5 năng lực cốt lõi theo khung CASEL
    eqRadar: {
      updatedLabel: "Cập nhật hôm nay",
      basedOnChoices: 8,
      framework: "Khung chuẩn CASEL",
      skills: [
        { key: "self_awareness", label: "Tự nhận thức", value: 88 },
        { key: "relationship", label: "Kỹ năng quan hệ", value: 92 },
        { key: "decision_making", label: "Ra quyết định", value: 75 },
        { key: "self_management", label: "Tự quản lý", value: 80 },
        { key: "social_awareness", label: "Nhận thức XH", value: 85 },
      ],
      coachInsight:
        "Bé Bo thể hiện sự tiến bộ rõ nét trong kỹ năng lắng nghe và chia sẻ đồ chơi khi gặp bạn nhỏ.",
      disclaimer:
        "Lưu ý: Đây là tín hiệu quan sát hành vi qua tương tác truyện, không mang tính chẩn đoán tâm lý hay y khoa.",
    },
    // Bản thảo truyện do AI tạo, cần phụ huynh duyệt trước khi bé đọc (null nếu không có)
    draftReview: {
      id: "d_501",
      title: "Chuyến phiêu lưu của Bạn Thỏ Trắng",
      template: "CASEL",
      skill: "Tự quản lý cảm xúc",
      description: "Giúp bé học cách hít thở sâu khi gặp tình huống bối rối.",
      moderationPassed: true,
      reviewedPages: 8,
      totalPages: 10,
    },
    bedtime: {
      time: "20:30",
      enabled: false,
      description: "Tự động giảm ánh sáng xanh & mở nhạc êm dịu",
    },
    recommendations: [
      {
        id: "s_301",
        title: "Sóc Nâu Học Cách Nói Lời Xin Lỗi",
        description:
          "Khi chiếc hạt thông của bạn Chim Sâu vô tình bị rơi vỡ, Sóc Nâu dũng cảm nhận lỗi và học cách sửa sai.",
        tag: "Trách nhiệm & Đồng cảm",
        tagType: "eq",
        minutes: 10,
        rating: 4.9,
        hasAudio: true,
        isNew: false,
        cover: null,
        coverEmoji: "🐿️",
        coverGradient: "from-orange-300 via-amber-200 to-yellow-100",
      },
      {
        id: "s_302",
        title: "Chuyến Bay Của Khinh Khí Cầu Dũng Cảm",
        description:
          "Khinh khí cầu nhỏ sợ độ cao nhưng nhờ sự khích lệ của các chú chim én, cậu đã nhìn thấy cả bầu trời.",
        tag: "Tự tin vượt sợ hãi",
        tagType: "theme",
        minutes: 15,
        rating: 5.0,
        hasAudio: true,
        isNew: false,
        cover: null,
        coverEmoji: "🎈",
        coverGradient: "from-indigo-400 via-purple-300 to-pink-200",
      },
      {
        id: "s_303",
        title: "Bữa Tiệc Rừng Xanh Biết Ơn",
        description:
          "Các bạn thú cùng chuẩn bị quà cảm ơn mẹ thiên nhiên và gửi gắm những lời tri ân chân thành.",
        tag: "Lòng biết ơn",
        tagType: "eq",
        minutes: 12,
        rating: 4.8,
        hasAudio: false,
        isNew: true,
        cover: null,
        coverEmoji: "🦊",
        coverGradient: "from-emerald-300 via-lime-200 to-amber-100",
      },
    ],
  },
};

// Bé Bông dùng lại dữ liệu của Bé Bo (chỉ để demo chuyển đổi hồ sơ)
mockDashboard.c_002 = {
  ...mockDashboard.c_001,
  todaySummary: { completedStories: 1, topic: "lòng dũng cảm", earnedStars: 2 },
  stats: { ...mockDashboard.c_001.stats, readingMinutesToday: 15, completedBooks: 9, loveStars: 6 },
};
