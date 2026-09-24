// Mock data cho màn "Bé nhà mình" (cài đặt hồ sơ từng bé).

export const COMPANIONS = [
  { id: "bear", name: "Gấu Bo Thông Thái", emoji: "🐻", description: "Dịu dàng, ham học hỏi và luôn khuyến khích bé đặt câu hỏi tò mò." },
  { id: "owl", name: "Cú Weaver", emoji: "🦉", description: "Người kể chuyện phép thuật, giỏi gợi mở cảm xúc bằng câu hỏi nhẹ nhàng." },
  { id: "bunny", name: "Thỏ Mây", emoji: "🐰", description: "Nhút nhát nhưng ấm áp, cùng bé tập gọi tên nỗi sợ và vượt qua." },
  { id: "dragon", name: "Rồng Nhí Lửa Hồng", emoji: "🐲", description: "Năng động, hài hước, truyền cảm hứng dũng cảm và tự tin." },
];

export const VOICES = [
  { value: "mom-north", label: "Giọng Mẹ hiền ấm áp (Miền Bắc)" },
  { value: "mom-south", label: "Giọng Mẹ ngọt ngào (Miền Nam)" },
  { value: "dad-north", label: "Giọng Bố trầm ấm (Miền Bắc)" },
  { value: "grandma", label: "Giọng Bà kể chuyện cổ tích" },
  { value: "family-recorded", label: "Giọng ba mẹ đã thu âm" },
];

export const SPEEDS = [
  { value: 0.8, label: "0.8x (Rất chậm)" },
  { value: 0.9, label: "0.9x (Chậm rãi, dễ ru ngủ)" },
  { value: 1, label: "1.0x (Bình thường)" },
  { value: 1.1, label: "1.1x (Hơi nhanh)" },
];

export const TONES = [
  { value: "expressive", label: "Kể chuyện truyền cảm ✨" },
  { value: "calm", label: "Nhẹ nhàng thư giãn 🌙" },
  { value: "playful", label: "Vui nhộn tinh nghịch 🎈" },
];

// Mẫu mục tiêu EQ để phụ huynh chọn thêm
export const EQ_GOAL_TEMPLATES = [
  { id: "g_share", title: "Học cách chia sẻ đồ chơi với anh chị em", description: "Rèn sự nhường nhịn qua các tình huống chia sẻ trong truyện." },
  { id: "g_tidy", title: "Tự giác cất dọn đồ chơi sau khi chơi xong", description: "Tạo thói quen thông qua các truyện về chú sóc nhỏ chăm chỉ sắp xếp tổ ấm." },
  { id: "g_wait", title: "Biết kiên nhẫn chờ đến lượt mình", description: "Giảm bớt sự nôn nóng khi xếp hàng hoặc khi cha mẹ bận rộn trong thời gian ngắn." },
  { id: "g_anger", title: "Bình tĩnh khi tức giận", description: "Tập hít thở sâu và gọi tên cảm xúc thay vì la hét." },
  { id: "g_brave", title: "Tự tin chào hỏi người lạ", description: "Vượt qua sự ngại ngùng qua các cuộc phiêu lưu kết bạn." },
  { id: "g_thanks", title: "Nói lời cảm ơn và xin lỗi", description: "Hình thành phép lịch sự cơ bản trong gia đình và lớp học." },
];

export const INTEREST_SUGGESTIONS = {
  "2-3": [
    { emoji: "🐶", label: "Thú cưng đáng yêu" },
    { emoji: "🎈", label: "Bóng bay sắc màu" },
    { emoji: "🚗", label: "Xe ô tô nhỏ" },
  ],
  "4-6": [
    { emoji: "💃", label: "Nhảy múa âm nhạc" },
    { emoji: "🧭", label: "Đội thám hiểm nhí" },
    { emoji: "🏗️", label: "Xe cẩu & Máy bay" },
  ],
  "7-9": [
    { emoji: "🤖", label: "Robot biến hình" },
    { emoji: "🧪", label: "Nhà khoa học nhí" },
    { emoji: "🏰", label: "Lâu đài mây" },
  ],
};

export const DEFAULT_SETTINGS = {
  interests: [],
  eqFocus: "Chưa đặt trọng tâm",
  eqGoals: [],
  realWorldMissions: true,
  companion: { id: "owl", voice: "mom-north", speed: 1, tone: "expressive" },
  limits: { dailyMinutes: 30, bedtimeEnabled: true, bedtime: "20:30", pinSet: false },
};

export const mockChildSettings = {
  c_001: {
    interests: [
      { id: "i1", emoji: "🦖", label: "Khủng long" },
      { id: "i2", emoji: "🚒", label: "Xe cứu hỏa" },
      { id: "i3", emoji: "🌳", label: "Rừng rậm cổ tích" },
      { id: "i4", emoji: "🚀", label: "Vũ trụ bao la" },
      { id: "i5", emoji: "🐬", label: "Động vật biển" },
    ],
    eqFocus: "Tháng này: Tập trung rèn luyện tính kiên nhẫn & sẻ chia",
    eqGoals: [
      { id: "g_share", title: "Học cách chia sẻ đồ chơi với em Bông", description: "Bé đã vượt qua 6/8 tình huống nhường nhịn và đồng cảm trong truyện tuần này.", progress: 75 },
      { id: "g_tidy", title: "Tự giác cất dọn đồ chơi sau khi chơi xong", description: "Tạo thói quen thông qua các truyện về chú sóc nhỏ chăm chỉ sắp xếp tổ ấm.", progress: 60 },
      { id: "g_wait", title: "Biết kiên nhẫn chờ đến lượt mình", description: "Giảm bớt sự nôn nóng khi xếp hàng hoặc khi cha mẹ bận rộn trong thời gian ngắn.", progress: 45 },
    ],
    realWorldMissions: true,
    companion: { id: "bear", voice: "mom-north", speed: 0.9, tone: "expressive" },
    limits: { dailyMinutes: 30, bedtimeEnabled: true, bedtime: "20:45", pinSet: true },
  },
  c_002: {
    interests: [
      { id: "i6", emoji: "🐰", label: "Thỏ bông" },
      { id: "i7", emoji: "🌈", label: "Cầu vồng" },
      { id: "i8", emoji: "🎵", label: "Bài hát thiếu nhi" },
    ],
    eqFocus: "Tháng này: Làm quen gọi tên cảm xúc",
    eqGoals: [
      { id: "g_thanks", title: "Nói lời cảm ơn và xin lỗi", description: "Bé đã chủ động nói cảm ơn 4 lần trong tuần.", progress: 50 },
    ],
    realWorldMissions: false,
    companion: { id: "bunny", voice: "mom-south", speed: 0.8, tone: "calm" },
    limits: { dailyMinutes: 20, bedtimeEnabled: true, bedtime: "20:00", pinSet: true },
  },
};
