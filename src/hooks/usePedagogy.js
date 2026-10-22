import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTemplate,
  deleteTemplate,
  duplicateTemplate,
  flagCheckpoint,
  getCheckpointQueue,
  getCheckpointReviewStats,
  getReportSettings,
  getSubSkills,
  getTemplates,
  markCheckpointOk,
  publishTemplate,
  saveTemplateDraft,
  unflagCheckpoint,
  updateReportSettings,
  updateSubSkill,
  updateTemplate,
} from "../services/pedagogyService";

export const pedagogyKeys = {
  subSkills: ["sub-skills"],
  subSkillList: (filters) => ["sub-skills", "list", filters],
  templates: ["question-templates"],
  templateList: (filters) => ["question-templates", "list", filters],
  checkpointReview: ["checkpoint-review"],
  checkpointQueue: (filters) => ["checkpoint-review", "queue", filters],
  checkpointStats: ["checkpoint-review", "stats"],
  reportSettings: ["pedagogy", "report-settings"],
};

export const useSubSkills = (filters, options = {}) =>
  useQuery({ queryKey: pedagogyKeys.subSkillList(filters), queryFn: () => getSubSkills(filters), placeholderData: keepPreviousData, ...options });

export const useTemplates = (filters) =>
  useQuery({ queryKey: pedagogyKeys.templateList(filters), queryFn: () => getTemplates(filters), placeholderData: keepPreviousData });

const useMutate = (mutationFn, keys) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => keys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey })),
  });
};

// Đổi kỹ năng con → số mẫu đếm trong bảng kỹ năng con đổi; đổi mẫu → số mẫu ban hành đổi; bài học đếm theo kỹ năng con
const SUB = pedagogyKeys.subSkills;
const TPL = pedagogyKeys.templates;
const TOPICS = ["topics"];

export const useUpdateSubSkill = () => useMutate(({ id, ...payload }) => updateSubSkill(id, payload), [SUB, TPL, TOPICS]);

export const useCreateTemplate = () => useMutate(createTemplate, [TPL, SUB]);
export const useUpdateTemplate = () => useMutate(({ id, ...payload }) => updateTemplate(id, payload), [TPL, SUB]);
export const useSaveTemplateDraft = () => useMutate(({ id, ...payload }) => saveTemplateDraft(id, payload), [TPL]);
export const usePublishTemplate = () => useMutate(publishTemplate, [TPL, SUB]);
export const useDuplicateTemplate = () => useMutate(duplicateTemplate, [TPL, SUB]);
export const useDeleteTemplate = () => useMutate(deleteTemplate, [TPL, SUB]);

// ── Soát câu hỏi AI: phân trang con trỏ (nextCursor); đổi trạng thái → tải lại hàng đợi + thống kê,
// và báo cáo EQ của phụ huynh (nếu cùng phiên trình duyệt) vì câu bị gắn cờ không còn tính điểm.
export const useCheckpointQueue = (filters) =>
  useInfiniteQuery({
    queryKey: pedagogyKeys.checkpointQueue(filters),
    queryFn: ({ pageParam }) => getCheckpointQueue({ ...filters, cursor: pageParam ?? undefined }),
    initialPageParam: null,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    placeholderData: keepPreviousData,
  });

export const useCheckpointReviewStats = () => useQuery({ queryKey: pedagogyKeys.checkpointStats, queryFn: getCheckpointReviewStats });

const REVIEW = [pedagogyKeys.checkpointReview, ["children"]];
export const useMarkCheckpointOk = () => useMutate(markCheckpointOk, REVIEW);
export const useFlagCheckpoint = () => useMutate(({ id, reason }) => flagCheckpoint(id, reason), REVIEW);
export const useUnflagCheckpoint = () => useMutate(unflagCheckpoint, REVIEW);

// ── Tham số báo cáo EQ
export const useReportSettings = () => useQuery({ queryKey: pedagogyKeys.reportSettings, queryFn: getReportSettings });
export const useUpdateReportSettings = () => useMutate(updateReportSettings, [pedagogyKeys.reportSettings, ["children"]]);
