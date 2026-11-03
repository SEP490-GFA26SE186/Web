import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Audio giả: play() thành công (hoặc bị chặn tự phát), test tự bắn "ended" khi muốn đoạn đó đọc xong
let played;
class FakeAudio extends EventTarget {
  static blockAutoplay = false;
  constructor(url) {
    super();
    this.url = url;
    played.push(this);
  }
  play() {
    return FakeAudio.blockAutoplay ? Promise.reject(new Error("NotAllowedError")) : Promise.resolve();
  }
  pause() {
    this.paused = true;
    this.dispatchEvent(new Event("pause"));
  }
  end() {
    this.dispatchEvent(new Event("ended"));
  }
}

let kidAudio;

beforeEach(async () => {
  played = [];
  FakeAudio.blockAutoplay = false;
  vi.stubGlobal("Audio", FakeAudio);
  vi.resetModules(); // module giữ trạng thái "đoạn đang phát"
  kidAudio = await import("../../src/utils/kidAudio");
});

afterEach(() => vi.unstubAllGlobals());

const waitForPlayed = (n) => vi.waitFor(() => expect(played).toHaveLength(n));

describe("playSequence", () => {
  it("đọc lần lượt từng đoạn, gọi onStart, bỏ đoạn không có url, trả true khi đọc hết", async () => {
    const onStart = vi.fn();
    const done = kidAudio.playSequence(["a.mp3", null, "", { url: "b.mp3", onStart }]);

    await waitForPlayed(1);
    expect(played[0].url).toBe("a.mp3");
    expect(onStart).not.toHaveBeenCalled();
    played[0].end();

    await waitForPlayed(2);
    expect(played[1].url).toBe("b.mp3");
    expect(onStart).toHaveBeenCalledOnce();
    played[1].end();

    await expect(done).resolves.toBe(true);
  });

  it("stopAudio cắt ngang: dừng đoạn đang đọc, không đọc các đoạn sau, trả false", async () => {
    const done = kidAudio.playSequence(["a.mp3", "b.mp3"]);
    await waitForPlayed(1);

    kidAudio.stopAudio();

    await expect(done).resolves.toBe(false);
    expect(played[0].paused).toBe(true);
    expect(played).toHaveLength(1);
  });

  it("phát đoạn mới thì dừng chuỗi cũ (không chồng tiếng)", async () => {
    const first = kidAudio.playSequence(["a.mp3", "b.mp3"]);
    await waitForPlayed(1);

    const second = kidAudio.playAudio("c.mp3");

    await expect(first).resolves.toBe(false);
    expect(played[0].paused).toBe(true);
    await waitForPlayed(2);
    expect(played[1].url).toBe("c.mp3");
    played[1].end();
    await expect(second).resolves.toBe(true);
  });

  it("trình duyệt chặn tự phát: không ném lỗi, chuyển sang đoạn sau", async () => {
    FakeAudio.blockAutoplay = true;
    await expect(kidAudio.playSequence(["a.mp3", "b.mp3"])).resolves.toBe(true);
    expect(played.map((a) => a.url)).toEqual(["a.mp3", "b.mp3"]);
  });
});
