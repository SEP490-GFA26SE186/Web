import axios from "axios";
import api from "./api";
import useKidSessionStore from "../stores/kidSessionStore";

const baseURL = import.meta.env.VITE_API_URL || "/api/v1";

// Client riêng cho Kid Mode: gắn token của bé, KHÔNG refresh bằng token phụ huynh.
// Phiên bé hết hạn / bị đóng (401) → bỏ phiên, Kid Mode hiện hướng dẫn nhờ ba mẹ mở lại.
const kidApi = axios.create({ baseURL, headers: { "Content-Type": "application/json" } });
kidApi.interceptors.request.use((config) => {
  const { token } = useKidSessionStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
kidApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) useKidSessionStore.getState().end();
    return Promise.reject(error);
  },
);

const data = async (promise) => (await promise).data.data;

// ---- Phía ba mẹ (token phụ huynh) ----

/** POST /auth/kid-mode/enter { childId } → { child, session: { kidSessionToken } }. Cần đặt PIN trước. */
export const enterKidMode = (childId) => data(api.post("/auth/kid-mode/enter", { childId }));

/** POST /auth/kid-mode/exit { pin, kidSessionToken } → { tokens } (token phụ huynh mới). Sai PIN → 401. */
export const exitKidMode = async (pin) => {
  const { token } = useKidSessionStore.getState();
  return data(axios.post(`${baseURL}/auth/kid-mode/exit`, { pin, kidSessionToken: token }));
};

// ---- Phía bé (token Kid Mode) ----

export const getKidShelf = async () => (await data(kidApi.get("/kid/bookshelf"))).items;
export const getUiAudio = async () => (await data(kidApi.get("/kid/ui-audio"))).assets;

/** POST /kid/sessions { storyId } → { session, story }. 422: truyện chưa sẵn sàng (chưa đủ giọng đọc). */
export const startReading = (storyId) => data(kidApi.post("/kid/sessions", { storyId }));

export const saveProgress = (sessionId, pageId) => data(kidApi.put(`/kid/sessions/${sessionId}/progress`, { pageId }));

/** → { result: { checkpointId, done, correct, attempts, hint?, hintAudioUrl?, answer?, feedback?, feedbackAudioUrl? } } */
export const answerCheckpoint = async (sessionId, body) =>
  (await data(kidApi.post(`/kid/sessions/${sessionId}/answers`, body))).result;

export const completeReading = (sessionId) => data(kidApi.post(`/kid/sessions/${sessionId}/complete`));
