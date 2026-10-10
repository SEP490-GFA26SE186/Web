// import api from "./api";
import { mockListings, PRICE_TIERS } from "../mocks/marketplace";

// TODO: BE chưa có API chợ truyện → dùng mock theo schema listings / price_tiers.
const USE_MOCK = true;
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const SORTERS = {
  best_selling: (a, b) => b.purchaseCount - a.purchaseCount,
  rating: (a, b) => b.ratingAvg - a.ratingAvg,
  newest: (a, b) => b.publishedAt.localeCompare(a.publishedAt),
  price_asc: (a, b) => a.priceTier.priceVnd - b.priceTier.priceVnd,
};

export const getPriceTiers = async () => {
  if (USE_MOCK) {
    await delay(150);
    return PRICE_TIERS;
  }
  // const { data } = await api.get("/price-tiers");
  // return data.data;
};

/**
 * Tìm và lọc truyện đang bán.
 * params: { search, competency, age, priceTierId, sort: best_selling | rating | newest | price_asc, page, limit }
 * trả về: { items, pagination }
 */
export const getListings = async ({ search = "", competency = "all", age = "all", priceTierId = "all", sort = "best_selling", page = 1, limit = 8 } = {}) => {
  if (USE_MOCK) {
    await delay();
    const keyword = search.trim().toLowerCase();
    const items = mockListings
      .filter(
        (l) =>
          (!keyword || `${l.title} ${l.description} ${l.topic.title} ${l.seller.displayName}`.toLowerCase().includes(keyword)) &&
          (competency === "all" || l.topic.competency === competency) &&
          (age === "all" || (l.topic.ageMin <= Number(age) && Number(age) <= l.topic.ageMax)) &&
          (priceTierId === "all" || l.priceTier.id === priceTierId),
      )
      .sort(SORTERS[sort] ?? SORTERS.best_selling);
    return {
      items: items.slice((page - 1) * limit, page * limit),
      pagination: { page, limit, total: items.length, totalPages: Math.max(1, Math.ceil(items.length / limit)) },
    };
  }
  // const { data } = await api.get("/listings", { params });
  // return data.data;
};
