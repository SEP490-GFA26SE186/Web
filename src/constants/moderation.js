// Nhãn tiếng Việt cho kiểm duyệt + giám sát (khớp enum rev8 của BE).

export const REVIEW_TYPES = {
  submission: { label: "Nộp bán", tone: "bg-navy-tint text-navy" },
  report_followup: { label: "Hậu kiểm báo cáo", tone: "bg-danger-tint text-danger" },
  random_audit: { label: "Kiểm tra ngẫu nhiên", tone: "bg-primary-tint text-primary-dark" },
};

export const DECISION_LABELS = {
  approved: "Đã duyệt / giữ",
  changes_requested: "Yêu cầu sửa",
  rejected: "Từ chối",
  taken_down: "Gỡ hẳn",
};

export const REPORT_CATEGORIES = {
  scary: "Gây sợ hãi",
  violent: "Bạo lực",
  inappropriate_lesson: "Bài học không phù hợp",
  personal_info: "Lộ thông tin cá nhân",
  technical_error: "Lỗi kỹ thuật",
  other: "Khác",
};

export const REPORT_STATUS = {
  open: { label: "Đang mở", tone: "bg-danger-tint text-danger" },
  resolved: { label: "Vi phạm — đã xử lý", tone: "bg-secondary-tint text-secondary-dark" },
  dismissed: { label: "Đã bác", tone: "bg-navy-tint text-navy" },
};

export const STRIKE_SOURCES = {
  report: "Báo cáo vi phạm",
  rejection: "Bị từ chối khi duyệt",
  takedown: "Truyện bị gỡ",
};

export const APPEAL_STATUS = {
  pending: { label: "Đang chờ xét", tone: "bg-primary-tint text-primary-dark" },
  approved: { label: "Được chấp thuận — đã gỡ cảnh cáo", tone: "bg-secondary-tint text-secondary-dark" },
  rejected: { label: "Bị từ chối", tone: "bg-danger-tint text-danger" },
  cancelled: { label: "Đã huỷ", tone: "bg-navy-tint text-navy" },
};

export const LISTING_STATUS = {
  submitted: { label: "Chờ duyệt", tone: "bg-navy-tint text-navy" },
  in_review: { label: "Đang duyệt", tone: "bg-primary-tint text-primary-dark" },
  changes_requested: { label: "Cần sửa", tone: "bg-danger-tint text-danger" },
  rejected: { label: "Bị từ chối", tone: "bg-danger-tint text-danger" },
  published: { label: "Đang bán", tone: "bg-secondary-tint text-secondary-dark" },
  suspended: { label: "Tạm gỡ", tone: "bg-danger-tint text-danger" },
  archived: { label: "Đã gỡ hẳn", tone: "bg-navy-tint text-navy" },
};

export const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString("vi-VN") : "");
export const formatDateTime = (iso) => (iso ? new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "");
