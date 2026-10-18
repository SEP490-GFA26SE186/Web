import api, { getErrorMessage } from "./api";

const call = async (request) => {
  try {
    const { data } = await request;
    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

/** GET /plans → [{ id, code, name, durationMonths, priceVnd, creditsPerMonth, maxChildren, maxCharacters, canSell }] */
export const getPlans = async () => {
  const data = await call(api.get("/plans"));
  return Array.isArray(data) ? data : data.plans;
};

/** POST /payments/plans/checkout { planId } → { order, checkoutUrl } (checkoutUrl null với gói 0đ). */
export const checkoutPlan = (planId) => call(api.post("/payments/plans/checkout", { planId }));

/** GET /payments/orders/:id → order. BE tự hỏi lại payOS khi đơn còn chờ. */
export const getOrder = async (orderId) => (await call(api.get(`/payments/orders/${orderId}`))).order;
