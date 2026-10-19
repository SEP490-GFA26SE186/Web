// Một trình phát dùng chung cho Kid Mode: phát đoạn mới thì dừng đoạn cũ (không chồng tiếng).
// `gen` tăng mỗi lần bắt đầu phát / dừng: chuỗi đang đọc dở (playSequence) thấy gen đổi thì dừng luôn,
// không đọc tiếp các đoạn sau.
let current = null;
let gen = 0;

function stopCurrent() {
  if (current) {
    const a = current;
    current = null;
    a.pause();
  }
}

export function stopAudio() {
  gen += 1;
  stopCurrent();
}

/** Phát một file; Promise xong khi đọc hết / bị dừng / lỗi; không ném lỗi. */
function playOne(url) {
  stopCurrent();
  const audio = new Audio(url);
  current = audio;
  return new Promise((resolve) => {
    const done = () => {
      if (current === audio) current = null;
      resolve();
    };
    audio.addEventListener("ended", done);
    audio.addEventListener("error", done);
    audio.addEventListener("pause", done);
    // Trình duyệt chặn tự phát khi bé chưa chạm vào trang: bỏ qua, bé bấm nút nghe.
    audio.play().catch(done);
  });
}

/**
 * Đọc lần lượt các đoạn (bỏ đoạn không có url). items: url hoặc { url, onStart }.
 * Trả true nếu đọc hết, false nếu bị đoạn khác / stopAudio cắt ngang.
 */
export async function playSequence(items) {
  stopAudio();
  const mine = gen;
  for (const item of items) {
    const { url, onStart } = typeof item === "string" || item == null ? { url: item } : item;
    if (!url) continue;
    if (mine !== gen) return false;
    onStart?.();
    await playOne(url);
  }
  return mine === gen;
}

/** Phát `url` (MP3 giọng đọc), dừng mọi thứ đang đọc. */
export const playAudio = (url) => playSequence([url]);
