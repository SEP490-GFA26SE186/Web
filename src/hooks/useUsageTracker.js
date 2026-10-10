import { useEffect, useRef } from "react";
import { useLogUsage } from "./useChildProfile";

// Phiên quá ngắn (lỡ bấm vào rồi thoát) không tính vào thời lượng
const MIN_SECONDS = 10;

/**
 * Đo thời gian bé ở màn đọc truyện và ghi lên BE (POST /children/:id/usage) để tính giới hạn phút/ngày.
 * Ghi khi rời màn hoặc khi ẩn tab; quay lại tab thì bắt đầu phiên mới.
 * childId rỗng (chưa đăng nhập phụ huynh — bản demo Kid Mode) → không ghi gì.
 */
function useUsageTracker(childId) {
  const { mutate } = useLogUsage(childId);
  const startRef = useRef(null);

  useEffect(() => {
    if (!childId) return;
    startRef.current = new Date();

    const flush = () => {
      const startedAt = startRef.current;
      startRef.current = null;
      if (!startedAt) return;
      const endedAt = new Date();
      const durationSeconds = Math.round((endedAt - startedAt) / 1000);
      if (durationSeconds < MIN_SECONDS) return;
      mutate({ durationSeconds, startedAt: startedAt.toISOString(), endedAt: endedAt.toISOString() });
    };

    const onVisibility = () => {
      if (document.hidden) flush();
      else startRef.current = new Date();
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      flush();
    };
  }, [childId, mutate]);
}

export default useUsageTracker;
