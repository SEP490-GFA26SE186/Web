// Một trình phát dùng chung cho Kid Mode: phát đoạn mới thì dừng đoạn cũ (không chồng tiếng).
let current = null;

export function stopAudio() {
  if (current) {
    current.pause();
    current = null;
  }
}

/** Phát `url` (MP3 giọng đọc). Trả Promise kết thúc khi đọc xong / bị dừng / lỗi; không ném lỗi. */
export function playAudio(url) {
  stopAudio();
  if (!url) return Promise.resolve();
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
