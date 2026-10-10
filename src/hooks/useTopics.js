import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTopic, deleteTopic, getEqSkills, getTopics, updateTopic } from "../services/topicService";

export const topicKeys = {
  all: ["topics"],
  list: (filters) => ["topics", "list", filters],
  eqSkills: ["eq-skills"],
};

export const useEqSkills = () => useQuery({ queryKey: topicKeys.eqSkills, queryFn: getEqSkills, staleTime: 30 * 60 * 1000 });

export const useTopics = (filters) =>
  useQuery({ queryKey: topicKeys.list(filters), queryFn: () => getTopics(filters), placeholderData: keepPreviousData });

const useTopicMutation = (mutationFn) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.all });
      queryClient.invalidateQueries({ queryKey: topicKeys.eqSkills }); // activeTopicsCount thay đổi
    },
  });
};

export const useCreateTopic = () => useTopicMutation(createTopic);
export const useUpdateTopic = () => useTopicMutation(({ id, ...payload }) => updateTopic(id, payload));
export const useDeleteTopic = () => useTopicMutation(deleteTopic);
