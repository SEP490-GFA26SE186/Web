import { useMutation, useQuery } from "@tanstack/react-query";
import {
  answerCheckpoint,
  completeReading,
  enterKidMode,
  exitKidMode,
  getKidShelf,
  getUiAudio,
  saveProgress,
  startReading,
} from "../services/kidService";

export const kidKeys = {
  shelf: ["kid", "shelf"],
  uiAudio: ["kid", "ui-audio"],
  reading: (storyId) => ["kid", "reading", storyId],
};

export const useKidShelf = () => useQuery({ queryKey: kidKeys.shelf, queryFn: getKidShelf });

export const useUiAudio = () => useQuery({ queryKey: kidKeys.uiAudio, queryFn: getUiAudio, staleTime: Infinity });

/** Bắt đầu / tiếp tục lượt đọc — một lần mỗi lần mở truyện (không tự gọi lại). */
export const useReading = (storyId) =>
  useQuery({
    queryKey: kidKeys.reading(storyId),
    queryFn: () => startReading(storyId),
    enabled: !!storyId,
    staleTime: Infinity,
    gcTime: 0,
    retry: false,
  });

export const useSaveProgress = (sessionId) => useMutation({ mutationFn: (pageId) => saveProgress(sessionId, pageId) });
export const useAnswer = (sessionId) => useMutation({ mutationFn: (body) => answerCheckpoint(sessionId, body) });
export const useCompleteReading = (sessionId) => useMutation({ mutationFn: () => completeReading(sessionId) });

export const useEnterKidMode = () => useMutation({ mutationFn: enterKidMode });
export const useExitKidMode = () => useMutation({ mutationFn: exitKidMode });
