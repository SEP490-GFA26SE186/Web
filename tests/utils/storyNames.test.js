import { describe, expect, it } from "vitest";
import { fillNames, nameOfToken } from "../../src/utils/storyNames";

const characters = [
  { token: "{NV1}", name: "Bin" },
  { token: "{NV2}", name: "Mít" },
  { token: "{NV3}", name: "" }, // alias chưa đặt tên
];

describe("fillNames", () => {
  it("đổi token thành tên theo nhân vật của truyện", () => {
    expect(fillNames("{NV1} chia bánh cho {NV2}. {NV1} vui.", characters)).toBe("Bin chia bánh cho Mít. Bin vui.");
  });

  it("token không có tên giữ nguyên", () => {
    expect(fillNames("{NV3} và {NV9}", characters)).toBe("{NV3} và {NV9}");
  });

  it("null / không có nhân vật", () => {
    expect(fillNames(null, characters)).toBe("");
    expect(fillNames("{NV1} ngủ")).toBe("{NV1} ngủ");
  });
});

describe("nameOfToken", () => {
  it("trả tên, không có thì trả lại token", () => {
    expect(nameOfToken("{NV2}", characters)).toBe("Mít");
    expect(nameOfToken("{NV7}", characters)).toBe("{NV7}");
  });
});
