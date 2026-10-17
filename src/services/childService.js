import api, { getErrorMessage } from "./api";

// API hồ sơ bé — BE: /api/v1/children (yêu cầu đăng nhập phụ huynh), schema rev8.

// eq_competency_stats: điểm = score_sum / items * 100; dưới 5 lượt trả lời BE trả score = null ("chưa đủ dữ liệu")
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

/** GET /children → child[] */
export const getChildren = async () => (await call(api.get("/children"))).children;

/** GET /children/:id → child */
export const getChild = async (childId) => (await call(api.get(`/children/${childId}`))).child;

/**
 * POST /children
 * payload: { name, birthDate?: "YYYY-MM-DD", dailyScreenTimeMinutes?: 5–300, preferredVoice?, appearance? }
 * appearance có → tạo kèm nhân vật đại diện của bé
 */
export const createChild = async (payload) => (await call(api.post("/children", clean(payload)))).child;

/** PUT /children/:id — cùng field như tạo mới; preferredVoice, appearance nhận null để xóa (appearance null → gỡ nhân vật đại diện) */
export const updateChild = async (childId, payload) =>
  (await call(api.put(`/children/${childId}`, clean(payload)))).child;

/** DELETE /children/:id (BE xóa mềm, đồng thời hủy phiên Kid Mode của bé) */
export const deleteChild = (childId) => call(api.delete(`/children/${childId}`));

/** GET /children/:id/overview → { profile, todayUsage, readingStats, eqReport } */
export const getChildOverview = (childId) => call(api.get(`/children/${childId}/overview`));

/** GET /children/:id/eq-report → { childId, childName, skills: [{ caselCode, nameVi, items, scoreSum, score|null }] } (cộng dồn toàn bộ lịch sử) */
export const getChildEqReport = (childId) => call(api.get(`/children/${childId}/eq-report`));

/**
 * GET /children/:id/bookshelf?page&limit&search&status&competency
 * → { items, pagination, counts, continueReading }
 * status: "all" | "reading" | "completed" | "not_started"; competency: "all" | mã CASEL
 */
export const getChildBookshelf = (childId, { page = 1, limit = 10, search, status = "all", competency = "all" } = {}) =>
  call(api.get(`/children/${childId}/bookshelf`, { params: clean({ page, limit, search: search?.trim(), status, competency }) }));

/** GET /children/:id/usage?date=YYYY-MM-DD (mặc định hôm nay theo giờ Việt Nam, BE tự tính) */
export const getChildUsage = (childId, date) => call(api.get(`/children/${childId}/usage`, { params: clean({ date }) }));

/**
 * POST /children/:id/usage — ghi một phiên sử dụng.
 * Schema rev8: duration_seconds và usage_date do DB tự tính từ started_at/ended_at → chỉ gửi 2 mốc thời gian.
 */
export const logUsageSession = async (childId, { startedAt, endedAt }) =>
  (await call(api.post(`/children/${childId}/usage`, { startedAt, endedAt }))).session;
