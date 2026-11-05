import { describe, expect, it } from "vitest";
import { translateErrorMessage } from "../../src/services/errorMessages";

describe("translateErrorMessage", () => {
  it("message lạ hoặc đã là tiếng Việt → giữ nguyên", () => {
    expect(translateErrorMessage("Ba mẹ không đủ credit để vẽ tranh.")).toBe("Ba mẹ không đủ credit để vẽ tranh.");
    expect(translateErrorMessage("Something brand new")).toBe("Something brand new");
  });

  it("không phải chuỗi → trả lại nguyên giá trị", () => {
    expect(translateErrorMessage(undefined)).toBeUndefined();
    expect(translateErrorMessage(null)).toBeNull();
  });
});
