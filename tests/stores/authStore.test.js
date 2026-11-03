import { beforeEach, describe, expect, it, vi } from "vitest";

const KEY = "sw_auth";
const user = { id: "u1", role: "parent", fullName: "Ba mẹ Bin" };
const tokens = { accessToken: "a1", refreshToken: "r1" };

// Store đọc phiên đã lưu lúc import → mỗi test import lại module mới
const load = async () => {
  vi.resetModules();
  return (await import("../../src/stores/authStore")).default;
};

let useAuthStore;
beforeEach(async () => {
  useAuthStore = await load();
});

describe("login", () => {
  it("ghi nhớ → lưu localStorage, giữ sau khi đóng trình duyệt", () => {
    useAuthStore.getState().login({ user, tokens }, true);

    expect(JSON.parse(localStorage.getItem(KEY))).toEqual({ user, ...tokens });
    expect(sessionStorage.getItem(KEY)).toBeNull();
    expect(useAuthStore.getState()).toMatchObject({ user, ...tokens, isAuthenticated: true, remember: true });
  });

  it("không ghi nhớ → chỉ lưu sessionStorage", () => {
    useAuthStore.getState().login({ user, tokens }, false);

    expect(localStorage.getItem(KEY)).toBeNull();
    expect(JSON.parse(sessionStorage.getItem(KEY))).toEqual({ user, ...tokens });
  });
});

describe("setTokens / setUser", () => {
  it("xoay vòng token giữ nguyên nơi lưu (sessionStorage)", () => {
    useAuthStore.getState().login({ user, tokens }, false);
    useAuthStore.getState().setTokens({ accessToken: "a2", refreshToken: "r2" });

    expect(localStorage.getItem(KEY)).toBeNull();
    expect(JSON.parse(sessionStorage.getItem(KEY))).toMatchObject({ accessToken: "a2", refreshToken: "r2", user });
    expect(useAuthStore.getState()).toMatchObject({ accessToken: "a2", refreshToken: "r2" });
  });

  it("cập nhật user không làm mất token", () => {
    useAuthStore.getState().login({ user, tokens });
    useAuthStore.getState().setUser({ ...user, fullName: "Mẹ Bin" });

    expect(JSON.parse(localStorage.getItem(KEY))).toMatchObject({ ...tokens, user: { fullName: "Mẹ Bin" } });
  });
});

describe("logout", () => {
  it("xoá phiên ở cả hai nơi lưu và trạng thái", () => {
    useAuthStore.getState().login({ user, tokens });
    useAuthStore.getState().logout();

    expect(localStorage.getItem(KEY)).toBeNull();
    expect(sessionStorage.getItem(KEY)).toBeNull();
    expect(useAuthStore.getState()).toMatchObject({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  });
});

describe("khôi phục phiên khi tải lại trang", () => {
  it("từ localStorage → đã đăng nhập, remember = true", async () => {
    localStorage.setItem(KEY, JSON.stringify({ user, ...tokens }));
    const store = await load();
    expect(store.getState()).toMatchObject({ user, isAuthenticated: true, remember: true });
  });

  it("từ sessionStorage → đã đăng nhập, remember = false", async () => {
    sessionStorage.setItem(KEY, JSON.stringify({ user, ...tokens }));
    const store = await load();
    expect(store.getState()).toMatchObject({ isAuthenticated: true, remember: false });
  });

  it("dữ liệu hỏng → coi như chưa đăng nhập, không ném lỗi", async () => {
    localStorage.setItem(KEY, "{khong-phai-json");
    const store = await load();
    expect(store.getState()).toMatchObject({ user: null, isAuthenticated: false });
  });
});
