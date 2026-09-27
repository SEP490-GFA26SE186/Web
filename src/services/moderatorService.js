// import api from "./api";
import {
  aiPrefilled,
  mockAiFlags,
  mockModerator,
  mockNavBadges,
  mockQueue,
  mockReports,
  mockReviewStory,
  mockShift,
  mockSummary,
  mockWeeklyAudit,
} from "../mocks/moderator";

// TODO: bỏ mock khi BE hoàn thiện API — thay bằng các lời gọi api đã comment bên dưới.
const USE_MOCK = true;
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// State mock trong phiên làm việc (để các thao tác xử lý có hiệu lực)
const db = {
  queue: structuredClone(mockQueue),
  reports: structuredClone(mockReports),
  audit: structuredClone(mockWeeklyAudit),
  reviews: {},
};

export const getModeratorOverview = async () => {
  if (USE_MOCK) {
    await delay(300);
    return {
      moderator: mockModerator,
      shift: mockShift,
      navBadges: { ...mockNavBadges, reports: db.reports.length },
    };
  }
  // const { data } = await api.get("/moderator/overview");
  // return data;
};

export const getModeratorDashboard = async () => {
  if (USE_MOCK) {
    await delay(500);
    return structuredClone({
      summary: {
        ...mockSummary,
        storyQueue: { ...mockSummary.storyQueue, count: mockSummary.storyQueue.count - (mockQueue.length - db.queue.length) },
        reports: { count: db.reports.length, urgent: db.reports.filter((r) => r.severity === "urgent").length },
        audits: { ...mockSummary.audits, done: db.audit.done },
      },
      reports: db.reports,
      weeklyAudit: db.audit,
      aiFlags: mockAiFlags,
    });
  }
  // const { data } = await api.get("/moderator/dashboard");
  // return data;
};

/** params: { age: "all" | "3-5" | "4-6" | "5-7" | "6-8" | "7-9", caselTaggedOnly: boolean } */
export const getReviewQueue = async ({ age = "all", caselTaggedOnly = false } = {}) => {
  if (USE_MOCK) {
    await delay(400);
    const items = db.queue.filter(
      (q) => (age === "all" || q.ageRange.startsWith(age.split("-")[0])) && (!caselTaggedOnly || q.caselSkill),
    );
    return structuredClone({ items, total: mockSummary.storyQueue.count - (mockQueue.length - db.queue.length) });
  }
  // const { data } = await api.get("/moderator/queue", { params });
  // return data;
};

/** action: "hide_page" | "request_fix" | "dismiss" */
export const resolveReport = async (reportId, action) => {
  if (USE_MOCK) {
    await delay(500);
    db.reports = db.reports.filter((r) => r.id !== reportId);
    return { reportId, action };
  }
  // const { data } = await api.post(`/moderator/reports/${reportId}/resolve`, { action });
  // return data;
};

export const sampleRandomAudits = async (count = 5) => {
  if (USE_MOCK) {
    await delay(600);
    db.audit.done = Math.min(db.audit.target, db.audit.done + count);
    return { done: db.audit.done };
  }
  // const { data } = await api.post("/moderator/audits/sample", { count });
  // return data;
};

// ===== Không gian kiểm duyệt =====
export const getReviewStory = async (storyId) => {
  if (USE_MOCK) {
    await delay(500);
    if (!db.reviews[storyId]) {
      if (storyId === mockReviewStory.id) {
        db.reviews[storyId] = structuredClone(mockReviewStory);
      } else {
        // Truyện khác trong hàng chờ: dùng cùng nội dung mẫu, chưa duyệt trang nào
        const q = mockQueue.find((item) => item.id === storyId);
        if (!q) throw new Error("Không tìm thấy truyện trong hàng chờ");
        db.reviews[storyId] = {
          ...structuredClone(mockReviewStory),
          id: storyId,
          title: q.title,
          author: q.author,
          authorBadge: q.authorStat,
          ageRange: q.ageRange,
          history: [{ id: "h1", time: "08:05", author: "AI Guard", type: "ai", text: "Quét tự động: 0 vi phạm." }],
          pages: mockReviewStory.pages.map((p) => ({ ...p, status: "pending", checks: aiPrefilled(), note: "", flagged: false })),
        };
      }
    }
    return structuredClone(db.reviews[storyId]);
  }
  // const { data } = await api.get(`/moderator/reviews/${storyId}`);
  // return data;
};

/** Lưu kết quả duyệt 1 trang. payload: { status: "approved" | "needs_fix", checks, note } */
export const savePageReview = async (storyId, pageNumber, payload) => {
  if (USE_MOCK) {
    await delay(400);
    const story = db.reviews[storyId];
    const p = story.pages.find((x) => x.number === pageNumber);
    Object.assign(p, payload, { flagged: payload.status === "needs_fix" });
    return structuredClone(p);
  }
  // const { data } = await api.put(`/moderator/reviews/${storyId}/pages/${pageNumber}`, payload);
  // return data;
};

/** decision: "publish" | "revise" | "reject" */
export const submitReviewDecision = async (storyId, decision, note) => {
  if (USE_MOCK) {
    await delay(700);
    const story = db.reviews[storyId];
    if (decision === "publish" && story.pages.some((p) => p.status !== "approved")) {
      throw new Error("Chưa thể xuất bản: còn trang chưa được duyệt đạt");
    }
    db.queue = db.queue.filter((q) => q.id !== storyId);
    return { storyId, decision, note };
  }
  // const { data } = await api.post(`/moderator/reviews/${storyId}/decision`, { decision, note });
  // return data;
};
