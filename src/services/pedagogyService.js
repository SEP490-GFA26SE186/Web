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

/** GET /eq-skills/casel-references?skillId → [{ id, skillId, code, textEn, displayOrder }] */
export const getCaselReferences = async (skillId) =>
  (await call(api.get("/eq-skills/casel-references", { params: clean({ skillId }) }))).data;

/**
 * GET /sub-skills?skillId&isActive&search
 * → [{ id, skillId, skill, caselReference:{id,code,textEn}, code, nameVi, descriptionVi, ageMin, ageMax, isActive, displayOrder,
 *      templatesCount, publishedTemplatesCount, topicsCount, checkpointsCount }]
 */
export const getSubSkills = async ({ skillId, isActive, search } = {}) =>
  (await call(api.get("/sub-skills", { params: clean({ skillId, isActive, search: search?.trim() }) }))).data;

/** POST /sub-skills { skillId, caselReferenceId, nameVi, descriptionVi, ageMin, ageMax, displayOrder, isActive } */
export const createSubSkill = async (payload) => (await call(api.post("/sub-skills", payload))).data;

/** PUT /sub-skills/:id — gửi field cần đổi (409/422 khi đã có điểm dừng dùng) */
export const updateSubSkill = async (id, payload) => (await call(api.put(`/sub-skills/${id}`, payload))).data;

/** DELETE /sub-skills/:id — 409 khi đã có mẫu / bài học / điểm dừng dùng */
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
