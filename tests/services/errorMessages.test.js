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

  it("lỗi phân quyền", () => {
    expect(translateErrorMessage("Forbidden")).toBe("Bạn không có quyền thực hiện thao tác này");
    expect(translateErrorMessage("You do not have permission to access this resource")).toBe("Tài khoản của bạn không có quyền vào mục này");
  });

  describe("message mặc định của zod v4", () => {
    it.each([
      ["Invalid input: expected string, received undefined", "Còn thiếu thông tin bắt buộc"],
      ["Invalid input: expected number, received string", "Thông tin nhập vào chưa đúng định dạng"],
      ['Invalid option: expected one of "short"|"medium"|"long"', "Lựa chọn chưa hợp lệ"],
      ["Too big: expected string to have <=500 characters", "Nội dung dài quá, tối đa 500 ký tự"],
      ["Too small: expected string to have >=1 characters", "Không được để trống"],
      ["Too small: expected string to have >=20 characters", "Cần ít nhất 20 ký tự"],
      ["Too big: expected array to have <=2 items", "Chọn tối đa 2 mục"],
      ["Too small: expected number to be >=1", "Giá trị tối thiểu là 1"],
      ["Too big: expected number to be <=100", "Giá trị tối đa là 100"],
      ["Too small: expected number to be >0", "Giá trị phải lớn hơn 0"],
      ["Invalid UUID", "Mã định danh không hợp lệ"],
      ["Invalid string: must match pattern /^\\d{4,6}$/", "Thông tin chưa đúng định dạng"],
      ["Unrecognized keys: foo, bar", "Có thông tin không được hỗ trợ"],
    ])("%s", (message, expected) => {
      expect(translateErrorMessage(message)).toBe(expected);
    });
  });

  it("lỗi đăng nhập / đăng ký", () => {
    expect(translateErrorMessage("Invalid email/username or password")).toBe("Email/Tên đăng nhập hoặc mật khẩu chưa đúng");
    expect(translateErrorMessage("Username is already taken")).toBe("Tên đăng nhập đã có người dùng");
  });

  it("lỗi validate form đăng ký / mật khẩu", () => {
    expect(translateErrorMessage("Username must be at least 3 characters")).toBe("Tên đăng nhập có ít nhất 3 ký tự");
    expect(translateErrorMessage("Email or username is required")).toBe("Ba mẹ nhập email hoặc tên đăng nhập nhé");
    expect(translateErrorMessage("Account password is incorrect")).toBe("Mật khẩu tài khoản chưa đúng");
  });

  it("lỗi xác thực email: chỉnh giọng câu tiếng Việt của BE", () => {
    expect(translateErrorMessage("Mã xác thực đã hết hạn. Vui lòng yêu cầu gửi lại mã.")).toBe("Mã xác thực đã hết hạn, ba mẹ bấm gửi lại mã nhé");
  });

  it("lỗi mã PIN Kid Mode", () => {
    expect(translateErrorMessage("Current PIN is incorrect")).toBe("Mã PIN hiện tại chưa đúng");
    expect(translateErrorMessage("PIN must be between 4 and 6 numeric digits")).toBe("Mã PIN gồm 4 đến 6 chữ số");
    expect(translateErrorMessage("Kid Exit PIN has not been set yet. Please set it first.")).toBe("Tài khoản chưa có mã PIN, ba mẹ đặt PIN trước nhé");
  });

  it("lỗi vào / thoát Kid Mode và phiên của bé", () => {
    expect(translateErrorMessage("You must set a Kid Exit PIN before entering Kid Mode")).toBe("Ba mẹ cần đặt mã PIN thoát Kid Mode trước nhé");
    expect(translateErrorMessage("Kid session has expired")).toBe("Phiên của bé đã kết thúc, nhờ ba mẹ mở lại Kid Mode nhé");
  });

  it("không phải chuỗi → trả lại nguyên giá trị", () => {
    expect(translateErrorMessage(undefined)).toBeUndefined();
    expect(translateErrorMessage(null)).toBeNull();
  });
});
