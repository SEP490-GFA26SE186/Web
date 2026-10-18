import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkoutListing, getListing, getListings, getPriceTiers } from "../services/marketplaceService";

export const usePriceTiers = () =>
  useQuery({ queryKey: ["marketplace", "price-tiers"], queryFn: getPriceTiers, staleTime: 10 * 60 * 1000 });

export const useListings = (params) =>
  useQuery({
    queryKey: ["marketplace", "listings", params],
    queryFn: () => getListings(params),
    placeholderData: keepPreviousData, // giữ danh sách cũ khi đổi bộ lọc/trang
  });

export const useListing = (listingId) =>
  useQuery({ queryKey: ["marketplace", "listing", listingId], queryFn: () => getListing(listingId), enabled: !!listingId });

export const useCheckoutListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkoutListing,
    onSuccess: ({ checkoutUrl }) => {
      if (!checkoutUrl) queryClient.invalidateQueries({ queryKey: ["marketplace"] }); // nhận miễn phí: có ngay
    },
  });
};
