import { describe, expect, it } from "vitest";
import { translateErrorMessage } from "../../src/services/errorMessages";

describe("translateErrorMessage", () => {
  it("message lạ hoặc đã là tiếng Việt → giữ nguyên", () => {
    expect(translateErrorMessage("Ba mẹ không đủ credit để vẽ tranh.")).toBe("Ba mẹ không đủ credit để vẽ tranh.");
    expect(translateErrorMessage("Something brand new")).toBe("Something brand new");
  });

  it("lỗi chung của BE", () => {
    expect(translateErrorMessage("Route not found")).toBe("Không tìm thấy chức năng này, thử tải lại trang nhé");
    expect(translateErrorMessage("Validation failed")).toBe("Thông tin gửi lên chưa hợp lệ, kiểm tra lại giúp mình nhé");
    expect(translateErrorMessage("  Resource not found ")).toBe("Không tìm thấy dữ liệu, có thể đã bị xoá");
  });

  it("không phải chuỗi → trả lại nguyên giá trị", () => {
    expect(translateErrorMessage(undefined)).toBeUndefined();
    expect(translateErrorMessage(null)).toBeNull();
  });
});
