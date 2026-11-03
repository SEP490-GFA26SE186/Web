import axios, { AxiosError } from "axios";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

// Adapter giả thay cho mạng: route(config) trả { status, data }; 4xx/5xx bị reject như axios thật.
// axios.create() chép adapter từ axios.defaults lúc tạo instance → gán trước khi import api.js.
let route;
const calls = [];
const originalAdapter = axios.defaults.adapter;
axios.defaults.adapter = async (config) => {
  calls.push({ url: config.url, auth: config.headers.Authorization, data: config.data });
  const { status, data } = await route(config);
  const response = { status, data, headers: {}, config, statusText: String(status) };
  if (status >= 400) throw new AxiosError(`HTTP ${status}`, "ERR_BAD_REQUEST", config, null, response);
  return response;
};
afterAll(() => {
  axios.defaults.adapter = originalAdapter;
});

let api, getErrorMessage, useAuthStore;

beforeEach(async () => {
  calls.length = 0;
  vi.resetModules();
  ({ default: api, getErrorMessage } = await import("../../src/services/api"));
  ({ default: useAuthStore } = await import("../../src/stores/authStore"));
  useAuthStore.getState().login({ user: { id: "u1", role: "parent" }, tokens: { accessToken: "old", refreshToken: "r1" } });
});

const refreshOk = { status: 200, data: { data: { tokens: { accessToken: "new", refreshToken: "r2" } } } };
const refreshCalls = () => calls.filter((c) => c.url === "/auth/refresh-tokens");

describe("gắn access token", () => {
  it("mọi request có Authorization: Bearer <token>", async () => {
    route = () => ({ status: 200, data: { ok: true } });
    await api.get("/stories");
    expect(calls[0]).toMatchObject({ url: "/stories", auth: "Bearer old" });
  });

  it("chưa đăng nhập → không gửi Authorization", async () => {
    useAuthStore.getState().logout();
    route = () => ({ status: 200, data: {} });
    await api.get("/topics");
    expect(calls[0].auth).toBeUndefined();
  });
});

describe("401 → refresh token rồi gửi lại", () => {
  it("refresh thành công: lưu token mới, gửi lại request với token mới", async () => {
    route = (c) => {
      if (c.url === "/auth/refresh-tokens") return refreshOk;
      return c.headers.Authorization === "Bearer new" ? { status: 200, data: { ok: true } } : { status: 401, data: {} };
    };

    const res = await api.get("/stories");

    expect(res.data).toEqual({ ok: true });
    expect(JSON.parse(refreshCalls()[0].data)).toEqual({ refreshToken: "r1" });
    expect(useAuthStore.getState()).toMatchObject({ accessToken: "new", refreshToken: "r2" });
    expect(calls.map((c) => c.url)).toEqual(["/stories", "/auth/refresh-tokens", "/stories"]);
  });

  it("nhiều request cùng 401 chỉ refresh một lần (BE xoay vòng refresh token)", async () => {
    route = (c) => {
      if (c.url === "/auth/refresh-tokens") return refreshOk;
      return c.headers.Authorization === "Bearer new" ? { status: 200, data: {} } : { status: 401, data: {} };
    };

    await Promise.all([api.get("/a"), api.get("/b"), api.get("/c")]);

    expect(refreshCalls()).toHaveLength(1);
  });

  it("refresh thất bại → đăng xuất, trả lại lỗi 401 gốc", async () => {
    route = (c) => (c.url === "/auth/refresh-tokens" ? { status: 401, data: {} } : { status: 401, data: { message: "hết hạn" } });

    await expect(api.get("/stories")).rejects.toMatchObject({ response: { status: 401, data: { message: "hết hạn" } } });
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("vẫn 401 sau khi đã refresh → không lặp vô hạn", async () => {
    route = (c) => (c.url === "/auth/refresh-tokens" ? refreshOk : { status: 401, data: {} });

    await expect(api.get("/stories")).rejects.toMatchObject({ response: { status: 401 } });
    expect(refreshCalls()).toHaveLength(1);
    expect(calls.filter((c) => c.url === "/stories")).toHaveLength(2);
  });

  it("401 của /auth/login (sai mật khẩu) không kích hoạt refresh", async () => {
    route = () => ({ status: 401, data: { message: "Sai mật khẩu" } });

    await expect(api.post("/auth/login", {})).rejects.toMatchObject({ response: { status: 401 } });
    expect(refreshCalls()).toHaveLength(0);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it("lỗi khác 401 trả thẳng, không refresh", async () => {
    route = () => ({ status: 403, data: {} });
    await expect(api.get("/admin")).rejects.toMatchObject({ response: { status: 403 } });
    expect(refreshCalls()).toHaveLength(0);
  });
});

describe("getErrorMessage", () => {
  const withResponse = (status, data) => Object.assign(new Error("x"), { response: { status, data } });

  it("ưu tiên lỗi theo field, rồi message của BE", () => {
    expect(getErrorMessage(withResponse(422, { message: "Dữ liệu sai", errors: [{ path: "name", message: "Thiếu tên" }] }))).toBe("Thiếu tên");
    expect(getErrorMessage(withResponse(409, { message: "Đã tồn tại" }))).toBe("Đã tồn tại");
  });

  it("5xx không lộ chi tiết kỹ thuật", () => {
    expect(getErrorMessage(withResponse(500, { message: "PrismaClientKnownRequestError" }), "Thử lại sau")).toBe("Thử lại sau");
  });

  it("mất mạng → thông báo kiểm tra mạng", () => {
    expect(getErrorMessage(new Error("Network Error"))).toBe("Không kết nối được máy chủ, ba mẹ kiểm tra mạng nhé");
  });

  it("không có gì để hiện → câu mặc định", () => {
    expect(getErrorMessage(withResponse(400, null), "Mặc định")).toBe("Mặc định");
  });
});
