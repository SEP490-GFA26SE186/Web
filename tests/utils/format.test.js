import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadCsv, formatListingPrice, formatRelativeDay, formatVND } from "../../src/utils/format";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("formatVND", () => {
  it("dùng dấu chấm ngăn nghìn và làm tròn", () => {
    expect(formatVND(29000)).toBe("29.000 đ");
    expect(formatVND(1999.6)).toBe("2.000 đ");
    expect(formatVND(0)).toBe("0 đ");
  });
});

describe("formatListingPrice", () => {
  it("giá 0 / rỗng → Miễn phí", () => {
    expect(formatListingPrice(0)).toBe("Miễn phí");
    expect(formatListingPrice("0")).toBe("Miễn phí");
    expect(formatListingPrice(null)).toBe("Miễn phí");
  });

  it("giá > 0 → số có dấu chấm + đ", () => {
    expect(formatListingPrice(29000)).toBe("29.000đ");
    expect(formatListingPrice("15000")).toBe("15.000đ");
  });
});

describe("formatRelativeDay", () => {
  const now = new Date(2026, 10, 3, 9, 0, 0); // 03/11/2026 9:00 giờ máy

  it("cùng ngày hoặc tương lai → hôm nay", () => {
    vi.useFakeTimers({ now });
    expect(formatRelativeDay(new Date(2026, 10, 3, 0, 5).toISOString())).toBe("hôm nay");
    expect(formatRelativeDay(new Date(2026, 10, 5).toISOString())).toBe("hôm nay");
  });

  it("tính theo ngày lịch, không theo 24 giờ", () => {
    vi.useFakeTimers({ now });
    expect(formatRelativeDay(new Date(2026, 10, 2, 23, 59).toISOString())).toBe("hôm qua");
    expect(formatRelativeDay(new Date(2026, 9, 31, 8, 0).toISOString())).toBe("3 ngày trước");
  });

  it("từ 7 ngày trở lên → ngày cụ thể", () => {
    vi.useFakeTimers({ now });
    const old = new Date(2026, 9, 20);
    expect(formatRelativeDay(old.toISOString())).toBe(old.toLocaleDateString("vi-VN"));
  });
});

describe("downloadCsv", () => {
  it("tạo file CSV có BOM, bọc ngoặc kép và thoát dấu ngoặc kép", async () => {
    let blob;
    URL.createObjectURL = vi.fn((b) => {
      blob = b;
      return "blob:test";
    });
    URL.revokeObjectURL = vi.fn();
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    downloadCsv("bao-cao.csv", [
      ["Tên", "Ghi chú"],
      ['Bin "nhỏ"', null],
    ]);

    expect(click).toHaveBeenCalledOnce();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test");
    const bytes = new Uint8Array(await blob.arrayBuffer());
    expect([...bytes.slice(0, 3)]).toEqual([0xef, 0xbb, 0xbf]); // BOM UTF-8 để Excel đọc đúng tiếng Việt
    expect(new TextDecoder().decode(bytes.slice(3))).toBe('"Tên","Ghi chú"\r\n"Bin ""nhỏ""",""');
  });
});
