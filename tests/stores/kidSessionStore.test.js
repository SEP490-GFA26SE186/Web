import { describe, expect, it, vi } from "vitest";

const KEY = "sw_kid_session";
const child = { id: "c1", name: "Bin" };

const load = async () => {
  vi.resetModules();
  return import("../../src/stores/kidSessionStore");
};

describe("kidSessionStore", () => {
  it("vào Kid Mode: lưu token + bé, isInKidMode = true", async () => {
    const { default: store, isInKidMode } = await load();
    expect(isInKidMode()).toBe(false);

    store.getState().start("kid-token", child);

    expect(isInKidMode()).toBe(true);
    expect(JSON.parse(localStorage.getItem(KEY))).toEqual({ token: "kid-token", child });
  });

  it("thoát Kid Mode: xoá khỏi localStorage", async () => {
    const { default: store, isInKidMode } = await load();
    store.getState().start("kid-token", child);
    store.getState().end();

    expect(isInKidMode()).toBe(false);
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(store.getState()).toMatchObject({ token: null, child: null });
  });

  it("tải lại trang vẫn ở Kid Mode", async () => {
    localStorage.setItem(KEY, JSON.stringify({ token: "kid-token", child }));
    const { default: store, isInKidMode } = await load();
    expect(isInKidMode()).toBe(true);
    expect(store.getState().child).toEqual(child);
  });
});
