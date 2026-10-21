// Trạng thái giọng đọc của truyện (story.narration từ GET /stories/:id) — dùng chung cho panel đầu trang
// và thanh Hoàn tất ở đáy trang. null = không cần hiện (chưa hoàn tất / tắt giọng đọc).
export function narrationState(story) {
  const n = story?.narration;
  if (!story?.reviewedAt || !n?.enabled) return null;
  const percent = n.total ? Math.round((n.ready / n.total) * 100) : 100;
  if (n.complete) return { phase: "ready", percent: 100, n };
  if (n.pending > 0) return { phase: "working", percent, n };
  // Hết đoạn đang chờ mà vẫn thiếu: lỗi (thử lại được) hoặc chữ đã sửa sau lần hoàn tất (bấm hoàn tất lại)
  return { phase: n.failed > 0 ? "failed" : "stale", percent, n };
}
