import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { completeStory, getKidStory, saveReadingProgress, submitStoryChoice, verifyParentPin } from "../services/kidService";

export const kidKeys = { story: (id) => ["kid", "story", id] };

export const useKidStory = (storyId) =>
  useQuery({ queryKey: kidKeys.story(storyId), queryFn: () => getKidStory(storyId), enabled: !!storyId, staleTime: Infinity });

export const useSaveProgress = (storyId) => useMutation({ mutationFn: (page) => saveReadingProgress(storyId, page) });

export const useSubmitChoice = (storyId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pageNumber, choice }) => submitStoryChoice(storyId, pageNumber, choice),
    onSuccess: (_, { pageNumber, choice }) =>
      queryClient.setQueryData(kidKeys.story(storyId), (old) =>
        old
          ? {
              ...old,
              progress: {
                ...old.progress,
                choices: { ...old.progress.choices, [pageNumber]: choice.id },
                starsEarned: old.progress.starsEarned + choice.stars,
              },
            }
          : old,
      ),
  });
};

export const useCompleteStory = (storyId) => useMutation({ mutationFn: () => completeStory(storyId) });

export const useVerifyParentPin = () => useMutation({ mutationFn: verifyParentPin });
