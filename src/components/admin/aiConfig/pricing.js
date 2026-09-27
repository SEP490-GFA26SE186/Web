import { CREDIT_RATE_VND, USD_TO_VND } from "../../../mocks/admin";

// Chi phí API gốc quy ra VND
export const apiCostVnd = (action) => action.apiCostUsd * USD_TO_VND;

// Giá trừ phụ huynh (VND)
export const priceVnd = (credits) => credits * CREDIT_RATE_VND;

// Biên lãi gộp (%) = (giá bán - chi phí) / giá bán
export const grossMargin = (action, credits = action.credits) => {
  const price = priceVnd(credits);
  return price > 0 ? ((price - apiCostVnd(action)) / price) * 100 : -Infinity;
};

export const averageMargin = (actions) => {
  const enabled = actions.filter((a) => a.enabled);
  if (!enabled.length) return 0;
  return enabled.reduce((s, a) => s + grossMargin(a), 0) / enabled.length;
};
