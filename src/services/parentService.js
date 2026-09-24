// import api from "./api";
import { mockChildren, mockDashboard, mockParent } from "../mocks/parentDashboard";
import { mockLibrary } from "../mocks/library";
import {
  mockExploreCategories,
  mockExploreStats,
  mockPersonalized,
  mockPopularStories,
} from "../mocks/explore";
import { DEFAULT_SETTINGS, mockChildSettings } from "../mocks/childProfiles";

// TODO: bỏ mock khi BE hoàn thiện API — thay bằng các lời gọi api.get/post đã comment bên dưới.
const USE_MOCK = true;
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const getParentProfile = async () => {
  if (USE_MOCK) {
    await delay();
    return mockParent;
  }
  // const { data } = await api.get("/parents/me");
  // return data;
};

export const getChildren = async () => {
  if (USE_MOCK) {
    await delay();
    return structuredClone(mockChildren);
  }
  // const { data } = await api.get("/parents/me/children");
  // return data;
};

export const getParentDashboard = async (childId) => {
  if (USE_MOCK) {
    await delay(600);
    // Bé mới tạo chưa có dữ liệu riêng → dùng tạm dữ liệu mẫu
    return structuredClone(mockDashboard[childId] ?? mockDashboard.c_001);
  }
  // const { data } = await api.get(`/children/${childId}/dashboard`);
  // return data;
};

export const updateBedtimeMode = async (childId, enabled) => {
  if (USE_MOCK) {
    await delay(300);
    return { childId, enabled };
  }
  // const { data } = await api.patch(`/children/${childId}/bedtime`, { enabled });
  // return data;
};

// ===== Tủ sách =====
// Mock giữ state theo từng bé để thao tác "Yêu thích" có hiệu lực trong phiên làm việc.
const libraryByChild = {};
const getMockLibrary = (childId) => (libraryByChild[childId] ??= structuredClone(mockLibrary));

const matchDuration = (minutes, duration) => {
  if (duration === "lt10") return minutes < 10;
  if (duration === "10to15") return minutes >= 10 && minutes <= 15;
  if (duration === "gt15") return minutes > 15;
  return true;
};

const matchTab = (story, tab) => {
  if (tab === "reading") return story.status === "reading";
  if (tab === "completed") return story.status === "completed";
  if (tab === "favorite") return story.isFavorite;
  if (tab === "bedtime") return story.isBedtime;
  return true;
};

const sorters = {
  recent: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  rating: (a, b) => b.rating - a.rating,
  shortest: (a, b) => a.minutes - b.minutes,
};

export const getLibrarySummary = async (childId) => {
  if (USE_MOCK) {
    await delay(400);
    const stories = getMockLibrary(childId);
    return {
      counts: {
        all: stories.length,
        reading: stories.filter((s) => matchTab(s, "reading")).length,
        completed: stories.filter((s) => matchTab(s, "completed")).length,
        favorite: stories.filter((s) => matchTab(s, "favorite")).length,
        bedtime: stories.filter((s) => matchTab(s, "bedtime")).length,
      },
      continueReading: stories
        .filter((s) => s.status === "reading")
        .sort((a, b) => b.lastReadAt.localeCompare(a.lastReadAt)),
    };
  }
  // const { data } = await api.get(`/children/${childId}/library/summary`);
  // return data;
};

/**
 * params: { search, age, duration, topic, sort, tab, page, pageSize }
 * trả về: { items, total, page, pageSize, totalPages }
 */
export const getLibraryStories = async (childId, params) => {
  if (USE_MOCK) {
    await delay(500);
    const { search = "", age = "all", duration = "all", topic = "all", sort = "recent", tab = "all" } = params;
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 6;
    const keyword = search.trim().toLowerCase();

    const filtered = getMockLibrary(childId)
      .filter(
        (s) =>
          (!keyword || `${s.title} ${s.description}`.toLowerCase().includes(keyword)) &&
          (age === "all" || s.ageGroup === age) &&
          (topic === "all" || s.topic === topic) &&
          matchDuration(s.minutes, duration) &&
          matchTab(s, tab),
      )
      .sort(sorters[sort] ?? sorters.recent);

    return {
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    };
  }
  // const { data } = await api.get(`/children/${childId}/library`, { params });
  // return data;
};

export const toggleFavoriteStory = async (childId, storyId, isFavorite) => {
  if (USE_MOCK) {
    await delay(250);
    const story = getMockLibrary(childId).find((s) => s.id === storyId);
    if (story) story.isFavorite = isFavorite;
    return { storyId, isFavorite };
  }
  // const { data } = await api.put(`/children/${childId}/favorites/${storyId}`, { isFavorite });
  // return data;
};

// ===== Khám phá =====
export const getExploreOverview = async () => {
  if (USE_MOCK) {
    await delay(300);
    return { categories: mockExploreCategories, stats: mockExploreStats };
  }
  // const { data } = await api.get("/explore/overview");
  // return data;
};

/** Truyện được yêu thích nhất tháng, lọc theo chủ đề. Trả về { items, total } */
export const getPopularStories = async ({ category = "all", limit = 4 } = {}) => {
  if (USE_MOCK) {
    await delay(450);
    const filtered = mockPopularStories.filter((s) => category === "all" || s.categories.includes(category));
    // "Xem tất cả" hiển thị tổng số truyện của chủ đề (mock nhân lên cho giống dữ liệu thật)
    return { items: filtered.slice(0, limit), total: category === "all" ? 28 : filtered.length };
  }
  // const { data } = await api.get("/explore/popular", { params: { category, limit } });
  // return data;
};

export const getPersonalizedStories = async (childId) => {
  if (USE_MOCK) {
    await delay(500);
    return structuredClone(mockPersonalized[childId] ?? mockPersonalized.c_001);
  }
  // const { data } = await api.get(`/children/${childId}/recommendations`);
  // return data;
};

// ===== Bé nhà mình =====
const calcAge = (birthday) => {
  const b = new Date(birthday);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  if (now < new Date(now.getFullYear(), b.getMonth(), b.getDate())) age -= 1;
  return Math.max(age, 0);
};

/** payload: { name, birthday, gender, avatarEmoji } */
export const createChild = async (payload) => {
  if (USE_MOCK) {
    await delay(500);
    const child = {
      id: `c_${Date.now()}`,
      ...payload,
      age: calcAge(payload.birthday),
      loveStars: 0,
      levelTitle: "Hạt Mầm Cổ Tích",
      level: 1,
      xp: 0,
      xpNext: 200,
      storiesHeard: 0,
      synced: true,
    };
    mockChildren.push(child);
    return child;
  }
  // const { data } = await api.post("/parents/me/children", payload);
  // return data;
};

export const updateChild = async (childId, payload) => {
  if (USE_MOCK) {
    await delay(400);
    const child = mockChildren.find((c) => c.id === childId);
    Object.assign(child, payload, { age: calcAge(payload.birthday ?? child.birthday) });
    return { ...child };
  }
  // const { data } = await api.patch(`/children/${childId}`, payload);
  // return data;
};

export const getChildSettings = async (childId) => {
  if (USE_MOCK) {
    await delay(450);
    return structuredClone(mockChildSettings[childId] ?? DEFAULT_SETTINGS);
  }
  // const { data } = await api.get(`/children/${childId}/settings`);
  // return data;
};

export const updateChildSettings = async (childId, settings) => {
  if (USE_MOCK) {
    await delay(600);
    mockChildSettings[childId] = structuredClone(settings);
    return structuredClone(settings);
  }
  // const { data } = await api.put(`/children/${childId}/settings`, settings);
  // return data;
};

/** Không bao giờ lưu PIN ở FE — chỉ gửi lên server để hash. */
export const updateParentPin = async (childId, pin) => {
  if (USE_MOCK) {
    await delay(400);
    if (!/^\d{4}$/.test(pin)) throw new Error("Mã PIN phải gồm 4 chữ số");
    return { pinSet: true };
  }
  // const { data } = await api.put(`/children/${childId}/pin`, { pin });
  // return data;
};
