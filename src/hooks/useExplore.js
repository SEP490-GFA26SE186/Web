import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getExploreOverview, getPersonalizedStories, getPopularStories } from "../services/parentService";

export const useExploreOverview = () =>
  useQuery({ queryKey: ["explore", "overview"], queryFn: getExploreOverview, staleTime: 5 * 60 * 1000 });

export const usePopularStories = (category) =>
  useQuery({
    queryKey: ["explore", "popular", category],
    queryFn: () => getPopularStories({ category }),
    placeholderData: keepPreviousData,
  });

export const usePersonalizedStories = (childId) =>
  useQuery({
    queryKey: ["explore", "personalized", childId],
    queryFn: () => getPersonalizedStories(childId),
    enabled: !!childId,
  });
