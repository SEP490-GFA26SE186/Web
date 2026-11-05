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

  it("lỗi database, kể cả khi BE gắn tên cột / constraint", () => {
    expect(translateErrorMessage("Write conflict, please retry")).toBe("Hệ thống đang bận xử lý dữ liệu này, thử lại sau giây lát nhé");
    expect(translateErrorMessage("Resource already exists: email")).toBe("Dữ liệu này đã tồn tại");
    expect(translateErrorMessage("Data violates constraint wallets_balance_check")).toBe("Dữ liệu chưa hợp lệ");
  });

  it("lỗi phiên đăng nhập", () => {
    expect(translateErrorMessage("Refresh token has expired")).toBe("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
    expect(translateErrorMessage("User not found or deactivated")).toBe("Tài khoản không tồn tại hoặc đã bị khoá");
  });

  it("không phải chuỗi → trả lại nguyên giá trị", () => {
    expect(translateErrorMessage(undefined)).toBeUndefined();
    expect(translateErrorMessage(null)).toBeNull();
  });
});
