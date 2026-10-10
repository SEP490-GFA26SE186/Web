// Mock hồ sơ bé, thời lượng dùng, điểm EQ và tủ sách — theo schema rev8:
// child_profiles, characters (1 nhân vật đại diện / bé), child_usage_sessions, eq_competency_stats, bookshelf_items.

const dayVn = (offset = 0) =>
  new Date(Date.now() + offset * 86400000).toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });

export const mockChildren = [
  {
    id: "c_001",
    name: "Bé Bo",
    birthDate: "2019-06-15",
    dailyScreenTimeMinutes: 30,
    preferredVoice: "vi-north-female",
    character: {
      id: "char_001",
      name: "Bé Bo",
      appearance: "Bé trai tóc ngắn xoăn, má phúng phính, hay mặc áo khủng long xanh",
      portraitImageKey: "portraits/char_001.png",
      portraitStatus: "ready",
    },
    booksCount: 8,
    completedSessionsCount: 14,
    createdAt: "2026-09-10T08:00:00Z",
  },
  {
    id: "c_002",
    name: "Bé Bông",
    birthDate: "2021-02-20",
    dailyScreenTimeMinutes: 20,
    preferredVoice: "vi-south-female",
    character: null,
    booksCount: 3,
    completedSessionsCount: 2,
    createdAt: "2026-09-12T08:00:00Z",
  },
];

// child_usage_sessions (duration_seconds, usage_date do DB tự tính)
export const mockUsageByChild = {
  c_001: [
    { startedAt: null, endedAt: null, durationSeconds: 11 * 60, usageDate: dayVn(0) },
    { startedAt: null, endedAt: null, durationSeconds: 7 * 60, usageDate: dayVn(0) },
    { startedAt: null, endedAt: null, durationSeconds: 12 * 60, usageDate: dayVn(-1) },
  ],
  c_002: [{ startedAt: null, endedAt: null, durationSeconds: 9 * 60, usageDate: dayVn(-1) }],
};

// eq_skills: 5 năng lực CASEL cố định
export const EQ_SKILLS = [
  { caselCode: "self_awareness", nameVi: "Tự nhận thức" },
  { caselCode: "self_management", nameVi: "Tự quản lý" },
  { caselCode: "social_awareness", nameVi: "Nhận thức xã hội" },
  { caselCode: "relationship_skills", nameVi: "Kỹ năng quan hệ" },
  { caselCode: "responsible_decision_making", nameVi: "Ra quyết định có trách nhiệm" },
];

// eq_competency_stats: items = số câu trả lời được chấm, scoreSum = tổng điểm (mỗi câu 0 / 0.5 / 1)
const EQ_STATS = {
  c_001: { self_awareness: [12, 10.5], self_management: [6, 4], social_awareness: [9, 7.5], relationship_skills: [5, 4.5], responsible_decision_making: [3, 2] },
  c_002: { self_awareness: [2, 2], social_awareness: [1, 0.5] },
};

export const mockEqStats = (childId) =>
  EQ_SKILLS.map((skill) => {
    const [items, scoreSum] = EQ_STATS[childId]?.[skill.caselCode] ?? [0, 0];
    return { ...skill, items, scoreSum };
  });

// bookshelf_items + stories + topics + play_sessions (tiến độ lần chơi gần nhất)
const STORIES = [
  ["s_101", "Bé Khủng Long Học Kiểm Soát Cơn Giận", "Con hay nổi giận", "self_management", "medium", 8, "private", 5],
  ["s_102", "Vương Quốc Bánh Kẹo & Bài Học Chia Sẻ", "Chia sẻ với bạn bè", "relationship_skills", "short", 6, "published", 6],
  ["s_103", "Đêm Kỳ Diệu Của Đom Đóm Nhỏ", "Con sợ bóng tối", "self_awareness", "long", 10, "private", 0],
  ["s_104", "Chiếc Áo Mới Của Thỏ Trắng", "Dũng cảm nhận lỗi", "responsible_decision_making", "medium", 8, "published", 8],
  ["s_105", "Gấu Bo và Cây Cầu Cầu Vồng", "Hợp tác cùng nhau", "relationship_skills", "custom", 12, "private", 8],
  ["s_106", "Cá Heo Con Không Bỏ Cuộc", "Kiên trì khi gặp khó", "self_management", "short", 6, "published", 0],
  ["s_107", "Sóc Nâu Hiểu Lòng Bạn", "Hiểu cảm xúc của bạn", "social_awareness", "medium", 8, "private", 8],
  ["s_108", "Chú Mèo Biết Chờ Tới Lượt", "Kiên nhẫn chờ đến lượt", "self_management", "short", 6, "published", 3],
];

const COVERS = ["🦖", "🍭", "🌙", "🐰", "🐻", "🐬", "🐿️", "🐱"];

export const mockBookshelf = (childId) =>
  (childId === "c_002" ? STORIES.slice(0, 3) : STORIES).map(
    ([storyId, title, topicTitle, competency, length, totalPages, kind, currentPage], i) => ({
      storyId,
      title,
      kind, // private: truyện ba mẹ tự tạo · published: truyện mua trên chợ
      length,
      totalPages,
      useTts: true,
      useAiImage: kind === "published" || i % 2 === 0,
      topic: { title: topicTitle, competency },
      coverEmoji: COVERS[i],
      addedAt: `2026-09-${String(10 + i).padStart(2, "0")}T09:00:00Z`,
      readingProgress:
        currentPage === 0
          ? null
          : {
              isCompleted: currentPage >= totalPages,
              currentPageOrder: currentPage,
              progressPercentage: Math.round((currentPage / totalPages) * 100),
              lastActivityAt: `2026-09-${String(20 + i).padStart(2, "0")}T19:30:00Z`,
            },
    }),
  );
