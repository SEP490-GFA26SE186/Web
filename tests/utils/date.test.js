import { describe, expect, it } from "vitest";
import { isoToViDate, maskViDate, parseViDate, toIsoDate } from "../../src/utils/date";

describe("toIsoDate", () => {
  it("lấy ngày theo giờ máy, có số 0 đầu", () => {
    expect(toIsoDate(new Date(2020, 4, 1))).toBe("2020-05-01");
  });
});

describe("isoToViDate", () => {
  it("YYYY-MM-DD → dd/mm/yyyy", () => {
    expect(isoToViDate("2020-05-10")).toBe("10/05/2020");
  });

  it("rỗng → chuỗi rỗng", () => {
    expect(isoToViDate("")).toBe("");
    expect(isoToViDate(null)).toBe("");
  });
});

describe("maskViDate", () => {
  it("tự chèn dấu / khi gõ đủ số", () => {
    expect(maskViDate("10052020")).toBe("10/05/2020");
  });

  it("đang gõ dở thì không thêm / ở cuối", () => {
    expect(maskViDate("10")).toBe("10");
    expect(maskViDate("1005")).toBe("10/05");
    expect(maskViDate("10/")).toBe("10");
  });

  it("bỏ ký tự không phải số và cắt ở 8 chữ số", () => {
    expect(maskViDate("1a0-05x2020999")).toBe("10/05/2020");
  });
});

describe("parseViDate", () => {
  it("dd/mm/yyyy hợp lệ → YYYY-MM-DD", () => {
    expect(parseViDate("10/05/2020")).toBe("2020-05-10");
    expect(parseViDate(" 1/5/2020 ")).toBe("2020-05-01");
  });

  it("ngày không tồn tại → null", () => {
    expect(parseViDate("31/02/2020")).toBeNull();
    expect(parseViDate("29/02/2023")).toBeNull();
    expect(parseViDate("00/05/2020")).toBeNull();
    expect(parseViDate("10/13/2020")).toBeNull();
  });

  it("năm nhuận 29/02 hợp lệ", () => {
    expect(parseViDate("29/02/2024")).toBe("2024-02-29");
  });

  it("sai định dạng → null", () => {
    expect(parseViDate("2020-05-10")).toBeNull();
    expect(parseViDate("10/05/20")).toBeNull();
    expect(parseViDate("")).toBeNull();
  });
});
