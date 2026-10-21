import api, { getErrorMessage } from "./api";

// Chương trình sư phạm: kỹ năng con (eq_sub_skills) và mẫu câu hỏi có phiên bản (question_templates).

const call = async (request) => {
  try {
    const { data } = await request;
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

const clean = (params) => Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== "all"));

/**
 * GET /sub-skills?skillId&isActive&source&search — kỹ năng con chính là mục CASEL:
 * source "casel" (40 mục gốc, caselTextEn = nguyên văn tiếng Anh) | "specialist" (chuyên gia bổ sung, caselTextEn tuỳ chọn)
 * → [{ id, skillId, skill, code, nameVi, descriptionVi, caselTextEn, source, ageMin, ageMax, isActive, displayOrder,
 *      templatesCount, publishedTemplatesCount, topicsCount, checkpointsCount }]
 */
export const getSubSkills = async ({ skillId, isActive, source, search } = {}) =>
  (await call(api.get("/sub-skills", { params: clean({ skillId, isActive, source, search: search?.trim() }) }))).data;

/** POST /sub-skills { skillId, nameVi, descriptionVi, caselTextEn?, ageMin, ageMax, displayOrder, isActive } → luôn source "specialist" */
export const createSubSkill = async (payload) => (await call(api.post("/sub-skills", payload))).data;

/** PUT /sub-skills/:id — gửi field cần đổi (422: mục gốc CASEL không đổi năng lực / mã / câu tiếng Anh; đổi năng lực khi đã có điểm dừng dùng) */
export const updateSubSkill = async (id, payload) => (await call(api.put(`/sub-skills/${id}`, payload))).data;

/** DELETE /sub-skills/:id — 409 với mục gốc CASEL (chỉ tắt được) hoặc khi đã có mẫu / bài học / điểm dừng dùng */
export const deleteSubSkill = async (id) => (await call(api.delete(`/sub-skills/${id}`))).data;

/** GET /question-templates?subSkillId&skillId&isActive → [{ id, title, answerFormat, isActive, subSkill, latestPublished, draft }] */
export const getTemplates = async ({ subSkillId, skillId, isActive } = {}) =>
  (await call(api.get("/question-templates", { params: clean({ subSkillId, skillId, isActive }) }))).data;

/** POST /question-templates { subSkillId, title, answerFormat } */
export const createTemplate = async (payload) => (await call(api.post("/question-templates", payload))).data;

/** PUT /question-templates/:id { title?, isActive? } */
export const updateTemplate = async (id, payload) => (await call(api.put(`/question-templates/${id}`, payload))).data;

/** PUT /question-templates/:id/draft — ghi nội dung bản nháp (tạo bản nháp mới từ bản đã ban hành nếu chưa có) */
export const saveTemplateDraft = async (id, payload) => (await call(api.put(`/question-templates/${id}/draft`, payload))).data;

/** POST /question-templates/:id/publish — 422 liệt kê trường thiếu */
export const publishTemplate = async (id) => (await call(api.post(`/question-templates/${id}/publish`))).data;

/** DELETE /question-templates/:id — 409 khi đã có điểm dừng dùng */
export const deleteTemplate = async (id) => (await call(api.delete(`/question-templates/${id}`))).data;

// ── Soát câu hỏi AI (checkpoint-review): chỉ điểm dừng chấm điểm của truyện AI, tên nhân vật đã đổi thành "Bạn A/B…"

/**
 * GET /checkpoint-review?status&skillId&subSkillId&templateId&cursor&limit
 * → { items: [{ checkpointId, createdAt, type, skill, subSkill, template:{ id, title, version }, pageBefore, question,
 *      options:[{ text, role?, isCorrect? }], answerEmotion?, status: "pending"|"ok"|"flagged", excludedReason? }], nextCursor }
 */
export const getCheckpointQueue = async ({ status, skillId, subSkillId, templateId, cursor, limit = 20 } = {}) => {
  const body = await call(api.get("/checkpoint-review", { params: clean({ status, skillId, subSkillId, templateId, cursor, limit }) }));
  return { items: body.data, nextCursor: body.nextCursor ?? null };
};

/** GET /checkpoint-review/stats → [{ templateId, title, reviewed, flagged }] */
export const getCheckpointReviewStats = async () => (await call(api.get("/checkpoint-review/stats"))).data;

/** POST /checkpoint-review/:id/ok → { checkpointId, status } ("Ổn" cũng gỡ cờ nếu đang bị gắn) */
export const markCheckpointOk = async (checkpointId) => (await call(api.post(`/checkpoint-review/${checkpointId}/ok`))).data;

/** POST /checkpoint-review/:id/flag { reason 5–500 } → { checkpointId, status: "flagged" } — loại khỏi điểm và báo cáo */
export const flagCheckpoint = async (checkpointId, reason) =>
  (await call(api.post(`/checkpoint-review/${checkpointId}/flag`, { reason }))).data;

/** DELETE /checkpoint-review/:id/flag → { checkpointId, status: "pending" } */
export const unflagCheckpoint = async (checkpointId) => (await call(api.delete(`/checkpoint-review/${checkpointId}/flag`))).data;

// ── Tham số báo cáo EQ

/** GET /pedagogy/report-settings → { window, minItems, developingFrom, secureFrom } */
export const getReportSettings = async () => (await call(api.get("/pedagogy/report-settings"))).data;

/** PUT /pedagogy/report-settings — gửi đủ 4 trường; 1 ≤ minItems ≤ window ≤ 20; 0 < developingFrom < secureFrom ≤ 1 */
export const updateReportSettings = async (payload) => (await call(api.put("/pedagogy/report-settings", payload))).data;
