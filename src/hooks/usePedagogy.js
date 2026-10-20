import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSubSkill,
  createTemplate,
  deleteSubSkill,
  deleteTemplate,
  getCaselReferences,
  getSubSkills,
  getTemplates,
  publishTemplate,
  saveTemplateDraft,
  updateSubSkill,
  updateTemplate,
} from "../services/pedagogyService";

export const pedagogyKeys = {
  subSkills: ["sub-skills"],
  subSkillList: (filters) => ["sub-skills", "list", filters],
  templates: ["question-templates"],
  templateList: (filters) => ["question-templates", "list", filters],
  casel: (skillId) => ["casel-references", skillId],
};

export const useCaselReferences = (skillId) =>
  useQuery({ queryKey: pedagogyKeys.casel(skillId), queryFn: () => getCaselReferences(skillId), enabled: !!skillId, staleTime: 30 * 60 * 1000 });

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

export const useCreateSubSkill = () => useMutate(createSubSkill, [SUB]);
export const useUpdateSubSkill = () => useMutate(({ id, ...payload }) => updateSubSkill(id, payload), [SUB, TPL, TOPICS]);
export const useDeleteSubSkill = () => useMutate(deleteSubSkill, [SUB, TPL]);

export const useCreateTemplate = () => useMutate(createTemplate, [TPL, SUB]);
export const useUpdateTemplate = () => useMutate(({ id, ...payload }) => updateTemplate(id, payload), [TPL, SUB]);
export const useSaveTemplateDraft = () => useMutate(({ id, ...payload }) => saveTemplateDraft(id, payload), [TPL]);
export const usePublishTemplate = () => useMutate(publishTemplate, [TPL, SUB]);
export const useDeleteTemplate = () => useMutate(deleteTemplate, [TPL, SUB]);
