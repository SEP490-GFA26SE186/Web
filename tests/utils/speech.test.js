import { describe, expect, it } from "vitest";
import { buildWords } from "../../src/utils/speech";

describe("buildWords", () => {
  it("nối các đoạn bằng một dấu cách và giữ vị trí ký tự của từng từ", () => {
    const { text, words } = buildWords([{ text: "Bin  vui" }, { text: "Mít buồn." }]);
    expect(text).toBe("Bin  vui Mít buồn.");
    expect(words).toEqual([
      { text: "Bin", segIndex: 0, start: 0 },
      { text: "vui", segIndex: 0, start: 5 },
      { text: "Mít", segIndex: 1, start: 9 },
      { text: "buồn.", segIndex: 1, start: 13 },
    ]);
    for (const w of words) expect(text.slice(w.start, w.start + w.text.length)).toBe(w.text);
  });

  it("không có đoạn nào", () => {
    expect(buildWords([])).toEqual({ text: "", words: [] });
  });
});
