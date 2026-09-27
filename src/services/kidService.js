// import api from "./api";
import { MOCK_PARENT_PIN, mockKidProgress, mockKidStory } from "../mocks/kidStory";

// TODO: bỏ mock khi BE hoàn thiện API — thay bằng các lời gọi api đã comment bên dưới.
const USE_MOCK = true;
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const progressDb = structuredClone(mockKidProgress);
const getProgress = (storyId) =>
  (progressDb[storyId] ??= { currentPage: 1, choices: {}, starsEarned: 0, completed: false });

export const getKidStory = async (storyId) => {
  if (USE_MOCK) {
    await delay(500);
    // Mock chỉ có 1 truyện mẫu — các id khác dùng chung nội dung này
    return structuredClone({ story: { ...mockKidStory, id: storyId }, progress: getProgress(storyId) });
  }
  // const { data } = await api.get(`/kid/stories/${storyId}`);
  // return data;
};

export const saveReadingProgress = async (storyId, currentPage) => {
  if (USE_MOCK) {
    await delay(150);
    getProgress(storyId).currentPage = currentPage;
    return { storyId, currentPage };
  }
  // const { data } = await api.put(`/kid/stories/${storyId}/progress`, { currentPage });
  // return data;
};

/** Ghi nhận lựa chọn EQ của bé ở điểm rẽ — BE dùng để tính biểu đồ CASEL cho phụ huynh */
export const submitStoryChoice = async (storyId, pageNumber, choice) => {
  if (USE_MOCK) {
    await delay(350);
    const p = getProgress(storyId);
    if (!p.choices[pageNumber]) {
      p.choices[pageNumber] = choice.id;
      p.starsEarned += choice.stars;
    }
    return { starsAwarded: choice.stars, skill: choice.skill };
  }
  // const { data } = await api.post(`/kid/stories/${storyId}/choices`, { pageNumber, choiceId: choice.id });
  // return data;
};

export const completeStory = async (storyId) => {
  if (USE_MOCK) {
    await delay(400);
    const p = getProgress(storyId);
    p.completed = true;
    return { storyId, starsEarned: p.starsEarned };
  }
  // const { data } = await api.post(`/kid/stories/${storyId}/complete`);
  // return data;
};

/** Xác thực PIN phụ huynh để thoát chế độ trẻ em. PIN không được lưu ở FE. */
export const verifyParentPin = async (pin) => {
  if (USE_MOCK) {
    await delay(400);
    return { ok: pin === MOCK_PARENT_PIN };
  }
  // const { data } = await api.post("/parents/me/verify-pin", { pin });
  // return data;
};
