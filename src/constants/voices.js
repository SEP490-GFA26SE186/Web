// Giọng đọc VieNeu-TTS cho truyện của bé (child_profiles.preferred_voice, tối đa 50 ký tự).
// TODO: đối chiếu voice_id thật khi AI service chốt danh sách giọng.
export const VOICES = [
  { value: "vi-north-female", label: "Giọng nữ miền Bắc" },
  { value: "vi-north-male", label: "Giọng nam miền Bắc" },
  { value: "vi-south-female", label: "Giọng nữ miền Nam" },
  { value: "vi-south-male", label: "Giọng nam miền Nam" },
];

export const voiceLabel = (value) => VOICES.find((v) => v.value === value)?.label ?? "Giọng mặc định";
