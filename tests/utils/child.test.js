import { afterEach, describe, expect, it, vi } from "vitest";
import { ageLabel, childEmoji, vnDateOffset } from "../../src/utils/child";

afterEach(() => vi.useRealTimers());

describe("childEmoji", () => {
  it("cùng id luôn cùng emoji", () => {
    const child = { id: "8f6c2a1e-0000-4000-8000-000000000001" };
    expect(childEmoji(child)).toBe(childEmoji({ ...child }));
  });

  it("không có id → emoji mặc định", () => {
    expect(childEmoji(null)).toBe("🧒");
    expect(childEmoji({})).toBe("🧒");
  });
});

describe("ageLabel", () => {
  it("chưa nhập ngày sinh", () => {
    expect(ageLabel({ age: null })).toBe("Chưa có ngày sinh");
    expect(ageLabel(undefined)).toBe("Chưa có ngày sinh");
  });

  it("có tuổi, kể cả 0 tuổi", () => {
    expect(ageLabel({ age: 6 })).toBe("6 tuổi");
    expect(ageLabel({ age: 0 })).toBe("0 tuổi");
  });
});

describe("vnDateOffset", () => {
  it("tính theo giờ Việt Nam, không theo UTC", () => {
    // 18:00 UTC ngày 02/11 = 01:00 ngày 03/11 ở Việt Nam
    vi.useFakeTimers({ now: new Date("2026-11-02T18:00:00Z") });
    expect(vnDateOffset(0)).toBe("2026-11-03");
    expect(vnDateOffset(-1)).toBe("2026-11-02");
    expect(vnDateOffset(1)).toBe("2026-11-04");
  });
});
