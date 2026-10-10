import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getListings, getPriceTiers } from "../services/marketplaceService";

export const usePriceTiers = () =>
  useQuery({ queryKey: ["marketplace", "price-tiers"], queryFn: getPriceTiers, staleTime: 10 * 60 * 1000 });

export const useListings = (params) =>
  useQuery({
    queryKey: ["marketplace", "listings", params],
    queryFn: () => getListings(params),
    placeholderData: keepPreviousData, // giữ danh sách cũ khi đổi bộ lọc/trang
  });
