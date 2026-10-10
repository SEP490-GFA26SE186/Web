import api, { getErrorMessage } from "./api";
import { mockBookshelf, mockChildren, mockEqStats, mockUsageByChild } from "../mocks/children";

// API hồ sơ bé — BE: /api/v1/children (yêu cầu đăng nhập phụ huynh).
// TODO: BE đang cập nhật module children theo schema rev8 → tạm dùng mock có cùng hình dạng dữ liệu.
//       Khi BE xong: đặt USE_MOCK = false và đối chiếu lại response.
const USE_MOCK = true;
const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

// Theo schema rev8: Free tối đa 2 bé (plans.max_children)
const MOCK_MAX_CHILDREN = 2;
// eq_competency_stats: điểm = score_sum / items * 100; dưới 5 lượt trả lời → "chưa đủ dữ liệu"
export const EQ_MIN_ITEMS = 5;

const toChildError = (error) => {
  const message = getErrorMessage(error);
  const quota = message.match(/maximum limit of (\d+) child profiles/);
  if (quota) return new Error(`Gói hiện tại chỉ tạo được tối đa ${quota[1]} hồ sơ bé. Ba mẹ nâng cấp gói để thêm bé nhé`);
  if (/not found/i.test(message)) return new Error("Không tìm thấy hồ sơ bé");
  return new Error(message);
};

const call = async (request) => {
  try {
    const { data } = await request;
    return data.data;
  } catch (error) {
    throw toChildError(error);
  }
};

// Field optional → bỏ chuỗi rỗng để không dính lỗi validate (VD birthDate "")
const clean = (payload) => Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined && v !== ""));

// ===== Mock helpers =====

const calcAge = (birthDate) => {
  if (!birthDate) return null;
  const birth = new Date(`${birthDate}T00:00:00`);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) age -= 1;
  return Math.max(age, 0);
};

const findMockChild = (childId) => {
  const child = mockChildren.find((c) => c.id === childId);
  if (!child) throw new Error("Không tìm thấy hồ sơ bé");
  return child;
};

const withAge = (child) => structuredClone({ ...child, age: calcAge(child.birthDate) });

// characters: mỗi bé tối đa 1 nhân vật đại diện; appearance bắt buộc khi có nhân vật
const applyAppearance = (child, appearance) => {
  if (appearance === undefined) return;
  if (!appearance) {
    child.character = null;
    return;
  }
  child.character = child.character
    ? { ...child.character, name: child.name, appearance }
    : { id: `char_${Date.now()}`, name: child.name, appearance, portraitImageKey: null, portraitStatus: "none" };
};

const todayVn = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });

const usageOf = (child, date = todayVn()) => {
  const sessions = (mockUsageByChild[child.id] ?? []).filter((s) => s.usageDate === date);
  const usedSeconds = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
  const usedMinutes = Math.round(usedSeconds / 60);
  return {
    childId: child.id,
    date,
    dailyLimitMinutes: child.dailyScreenTimeMinutes,
    usedMinutes,
    usedSeconds,
    remainingMinutes: Math.max(0, child.dailyScreenTimeMinutes - usedMinutes),
    isLimitReached: usedMinutes >= child.dailyScreenTimeMinutes,
    sessionsCount: sessions.length,
  };
};

const eqReportOf = (child) => {
  const skills = mockEqStats(child.id).map((s) => ({
    ...s,
    score: s.items >= EQ_MIN_ITEMS ? Math.round((s.scoreSum / s.items) * 100) : null,
  }));
  return { childId: child.id, childName: child.name, skills };
};

// ===== API =====

/** GET /children → child[] */
export const getChildren = async () => {
  if (USE_MOCK) {
    await delay();
    return mockChildren.map(withAge);
  }
  return (await call(api.get("/children"))).children;
};

/** GET /children/:id → child */
export const getChild = async (childId) => {
  if (USE_MOCK) {
    await delay();
    return withAge(findMockChild(childId));
  }
  return (await call(api.get(`/children/${childId}`))).child;
};

/**
 * POST /children
 * payload: { name, birthDate?: "YYYY-MM-DD", dailyScreenTimeMinutes?: 5–300, preferredVoice?, appearance? }
 * appearance có → tạo kèm nhân vật đại diện của bé
 */
export const createChild = async (payload) => {
  if (USE_MOCK) {
    await delay(500);
    if (mockChildren.length >= MOCK_MAX_CHILDREN) {
      throw new Error(`Gói hiện tại chỉ tạo được tối đa ${MOCK_MAX_CHILDREN} hồ sơ bé. Ba mẹ nâng cấp gói để thêm bé nhé`);
    }
    const child = {
      id: `c_${Date.now()}`,
      name: payload.name,
      birthDate: payload.birthDate ?? null,
      dailyScreenTimeMinutes: payload.dailyScreenTimeMinutes ?? 30,
      preferredVoice: payload.preferredVoice ?? null,
      character: null,
      booksCount: 0,
      completedSessionsCount: 0,
      createdAt: new Date().toISOString(),
    };
    applyAppearance(child, payload.appearance);
    mockChildren.push(child);
    return withAge(child);
  }
  return (await call(api.post("/children", clean(payload)))).child;
};

/** PUT /children/:id — cùng field như tạo mới; preferredVoice, appearance nhận null để xóa */
export const updateChild = async (childId, payload) => {
  if (USE_MOCK) {
    await delay(400);
    const child = findMockChild(childId);
    const { appearance, ...fields } = payload;
    Object.assign(child, Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined)));
    if (child.character) child.character.name = child.name;
    applyAppearance(child, appearance);
    return withAge(child);
  }
  return (await call(api.put(`/children/${childId}`, clean(payload)))).child;
};

/** DELETE /children/:id (BE xóa mềm, đồng thời hủy phiên Kid Mode của bé) */
export const deleteChild = async (childId) => {
  if (USE_MOCK) {
    await delay(400);
    const index = mockChildren.findIndex((c) => c.id === childId);
    if (index < 0) throw new Error("Không tìm thấy hồ sơ bé");
    mockChildren.splice(index, 1);
    return { message: "Xóa hồ sơ bé thành công" };
  }
  return call(api.delete(`/children/${childId}`));
};

/** GET /children/:id/overview → { profile, todayUsage, readingStats, eqReport } */
export const getChildOverview = async (childId) => {
  if (USE_MOCK) {
    await delay(450);
    const child = findMockChild(childId);
    return {
      profile: withAge(child),
      todayUsage: usageOf(child),
      readingStats: { booksInBookshelf: child.booksCount, completedStories: child.completedSessionsCount },
      eqReport: eqReportOf(child),
    };
  }
  return call(api.get(`/children/${childId}/overview`));
};

/** GET /children/:id/eq-report → { skills: [{ caselCode, nameVi, items, scoreSum, score|null }] } */
export const getChildEqReport = async (childId, { startDate, endDate } = {}) => {
  if (USE_MOCK) {
    await delay();
    return eqReportOf(findMockChild(childId));
  }
  return call(api.get(`/children/${childId}/eq-report`, { params: clean({ startDate, endDate }) }));
};

const readingStatusOf = (item) =>
  !item.readingProgress ? "not_started" : item.readingProgress.isCompleted ? "completed" : "reading";

/**
 * GET /children/:id/bookshelf?page&limit&search → { items, pagination, counts }
 * status ("reading" | "completed" | "not_started") và competency hiện chỉ mock lọc;
 * TODO: khi nối API cần BE hỗ trợ 2 tham số này (hiện BE chỉ có page/limit/search).
 */
export const getChildBookshelf = async (childId, { page = 1, limit = 10, search, status = "all", competency = "all" } = {}) => {
  if (USE_MOCK) {
    await delay();
    const keyword = search?.trim().toLowerCase() ?? "";
    const all = mockBookshelf(childId);
    const matched = all.filter(
      (i) =>
        (!keyword || `${i.title} ${i.topic.title}`.toLowerCase().includes(keyword)) &&
        (competency === "all" || i.topic.competency === competency),
    );
    const items = matched.filter((i) => status === "all" || readingStatusOf(i) === status);
    const countBy = (s) => matched.filter((i) => readingStatusOf(i) === s).length;
    return {
      items: items.slice((page - 1) * limit, page * limit),
      pagination: { page, limit, total: items.length, totalPages: Math.max(1, Math.ceil(items.length / limit)) },
      counts: { all: matched.length, reading: countBy("reading"), completed: countBy("completed"), not_started: countBy("not_started") },
      // Truyện đang đọc dở để hiện mục "Tiếp tục đọc" (không phụ thuộc tab đang chọn)
      continueReading: all
        .filter((i) => readingStatusOf(i) === "reading")
        .sort((a, b) => b.readingProgress.lastActivityAt.localeCompare(a.readingProgress.lastActivityAt)),
    };
  }
  return call(api.get(`/children/${childId}/bookshelf`, { params: clean({ page, limit, search: search?.trim() }) }));
};

/** GET /children/:id/usage?date=YYYY-MM-DD (mặc định hôm nay, giờ VN) */
export const getChildUsage = async (childId, date) => {
  if (USE_MOCK) {
    await delay(300);
    return usageOf(findMockChild(childId), date);
  }
  return call(api.get(`/children/${childId}/usage`, { params: clean({ date }) }));
};

/**
 * POST /children/:id/usage — ghi một phiên sử dụng.
 * Schema rev8: duration_seconds và usage_date do DB tự tính từ started_at/ended_at → chỉ gửi 2 mốc thời gian.
 */
export const logUsageSession = async (childId, { startedAt, endedAt }) => {
  if (USE_MOCK) {
    const session = {
      startedAt,
      endedAt,
      durationSeconds: Math.round((new Date(endedAt) - new Date(startedAt)) / 1000),
      usageDate: new Date(startedAt).toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }),
    };
    (mockUsageByChild[childId] ??= []).push(session);
    return session;
  }
  return (await call(api.post(`/children/${childId}/usage`, { startedAt, endedAt }))).session;
};
