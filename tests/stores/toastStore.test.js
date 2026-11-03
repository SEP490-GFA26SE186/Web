import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let useToastStore, toast, TOAST_DURATION;

beforeEach(async () => {
  vi.useFakeTimers();
  vi.resetModules();
  ({ default: useToastStore, toast, TOAST_DURATION } = await import("../../src/stores/toastStore"));
});

afterEach(() => vi.useRealTimers());

const toasts = () => useToastStore.getState().toasts;

describe("toastStore", () => {
  it("toast.success / error / info đặt đúng loại", () => {
    toast.success("Đã lưu");
    toast.error("Lỗi");
    toast.info("Lưu ý");
    expect(toasts().map((t) => [t.message, t.type])).toEqual([
      ["Đã lưu", "success"],
      ["Lỗi", "error"],
      ["Lưu ý", "info"],
    ]);
  });

  it("chỉ giữ 3 thông báo mới nhất", () => {
    ["1", "2", "3", "4"].forEach((m) => toast.info(m));
    expect(toasts().map((t) => t.message)).toEqual(["2", "3", "4"]);
  });

  it("tự ẩn: đánh dấu leaving sau TOAST_DURATION, gỡ hẳn sau animation", () => {
    toast.success("Đã lưu");
    vi.advanceTimersByTime(TOAST_DURATION - 1);
    expect(toasts()[0].leaving).toBe(false);

    vi.advanceTimersByTime(1);
    expect(toasts()[0].leaving).toBe(true);

    vi.advanceTimersByTime(200);
    expect(toasts()).toHaveLength(0);
  });

  it("rê chuột vào thì dừng đếm, rời ra đếm tiếp phần còn lại (tối thiểu 400ms)", () => {
    toast.success("Đã lưu");
    const { id } = toasts()[0];

    useToastStore.getState().pause(id);
    vi.advanceTimersByTime(TOAST_DURATION * 3);
    expect(toasts()[0].leaving).toBe(false);

    useToastStore.getState().resume(id, 100); // còn 100ms nhưng tối thiểu 400ms
    vi.advanceTimersByTime(399);
    expect(toasts()[0].leaving).toBe(false);
    vi.advanceTimersByTime(1);
    expect(toasts()[0].leaving).toBe(true);
  });

  it("bấm đóng: ẩn ngay, không bị hẹn giờ cũ gọi lại", () => {
    toast.error("Lỗi");
    const { id } = toasts()[0];

    useToastStore.getState().dismiss(id);
    vi.advanceTimersByTime(200);
    expect(toasts()).toHaveLength(0);
    vi.advanceTimersByTime(TOAST_DURATION);
    expect(toasts()).toHaveLength(0);
  });
});
