// Checklist sư phạm khi duyệt truyện đăng bán — 7 nguyên tắc nội dung (BE/ai/docs/07-content-principles.md).
// Chỉ nằm ở web: chuyên gia tick đủ mới bấm Duyệt được; không gửi lên API.
export const REVIEW_CHECKLIST = [
  { code: "no_answer_label", description: 'Lời kể không dán nhãn đáp án đúng ("đã chọn cách đúng đắn").' },
  { code: "natural_consequence", description: 'Hệ quả tự nhiên, không trừng phạt (không "bị phạt đứng góc").' },
  { code: "repair_path", description: "Luôn có đường sửa sai; truyện không kết bằng việc hỏng không sửa được." },
  { code: "named_emotions", description: "Cảm xúc được gọi tên rõ ràng (trừ trang ngay trước câu hỏi cảm xúc)." },
  { code: "no_preaching", description: 'Tuyệt đối không giảng đạo lý ("Bài học hôm nay là…", "Con phải nhớ rằng…").' },
  { code: "no_comparison", description: 'Không so sánh, không thi đua giữa các bé ("ngoan hơn").' },
  { code: "age_appropriate", description: "Hệ quả vừa tầm tuổi 5–8 (không chết chóc, mất mát vĩnh viễn, bố mẹ thất vọng làm hình phạt)." },
];
