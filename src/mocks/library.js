// Mock data cho màn Tủ sách của Parent.
// status: "reading" | "completed" | "not_started"
// audio: "narrated" (ba mẹ tự kể) | "ai" (giọng AI) | null

const gradients = [
  "from-pink-300 via-rose-200 to-amber-100",
  "from-emerald-300 via-teal-200 to-sky-100",
  "from-indigo-400 via-purple-300 to-pink-200",
  "from-sky-300 via-cyan-200 to-emerald-100",
  "from-orange-300 via-amber-200 to-yellow-100",
  "from-violet-300 via-fuchsia-200 to-rose-100",
];

// [id, title, description, topic, emoji, chapter, totalChapters, status, progress, minutes, rating, extra]
const rows = [
  ["s_001", "Vương Quốc Bánh Kẹo & Bài Học Chia Sẻ", "Hoàng tử Kẹo Dẻo học cách phân phát bánh ngọt cho mọi người và nhận lại niềm vui gấp bội lần.", "sharing", "🍭", 4, 4, "completed", 100, 12, 4.9],
  ["s_002", "Bé Khủng Long Học Kiểm Soát Cơn Giận", "Khủng long Roco tìm thấy bí quyết hít thở thật sâu mỗi khi quả bong bóng tức giận trong ngực muốn nổ tung.", "emotion", "🦖", 2, 5, "reading", 45, 15, 5.0, { lastReadAt: "2026-09-22T20:00:00", minutesLeft: 9 }],
  ["s_003", "Đêm Kỳ Diệu Của Đom Đóm Nhỏ", "Khám phá vẻ đẹp ẩn giấu trong bóng đêm ấm áp, giúp bé không còn sợ hãi khi tắt đèn đi ngủ.", "courage", "🌙", 1, 3, "not_started", 0, 10, 4.8, { isBedtime: true }],
  ["s_004", "Chiếc Áo Mới Của Thỏ Trắng", "Dũng cảm thừa nhận việc vô tình làm dơ áo và nhận được sự tha thứ đong đầy thương yêu của mẹ.", "honesty", "🐰", 5, 5, "completed", 100, 14, 4.9, { isFavorite: true }],
  ["s_005", "Gia Đình Chim Sâu Gắn Kết", "Hành trình cùng nhau xây dựng tổ ấm vững chãi trước những cơn gió mùa thay đổi của đầm lầy xanh.", "family", "🐦", 1, 4, "not_started", 0, 16, 5.0, { isNew: true }],
  ["s_006", "Rùa Con Kiên Nhẫn Xây Lâu Đài Cát", "Dù từng đợt sóng xô đổ thành lũy, chú rùa nhỏ vẫn mỉm cười xây lại từng viên gạch cát thật đẹp.", "patience", "🐢", 1, 3, "not_started", 0, 12, 4.7],
  ["s_007", "Gấu Bo và Cây Cầu Cầu Vồng", "Bé cùng Gấu Bo và Chú Sóc nâng cành cây lớn qua dòng suối nhỏ để hoàn thành cầu vồng...", "cooperation", "🐻", 3, 5, "reading", 65, 14, 4.9, { lastReadAt: "2026-09-24T19:30:00", minutesLeft: 5, audio: "narrated" }],
  ["s_008", "Cá Heo Con Học Bơi Ngược Dòng", "Dù dòng nước chảy xiết, chú cá heo Finny đã tự nhủ không bỏ cuộc và tìm cách lướt qua con sóng...", "perseverance", "🐬", 2, 4, "reading", 40, 13, 4.8, { lastReadAt: "2026-09-23T20:15:00", minutesLeft: 8 }],
  ["s_009", "Sóc Nâu Học Cách Nói Lời Xin Lỗi", "Khi chiếc hạt thông của bạn Chim Sâu vô tình bị rơi vỡ, Sóc Nâu dũng cảm nhận lỗi và sửa sai.", "honesty", "🐿️", 3, 3, "completed", 100, 10, 4.9, { isFavorite: true }],
  ["s_010", "Chuyến Bay Của Khinh Khí Cầu Dũng Cảm", "Khinh khí cầu nhỏ sợ độ cao nhưng nhờ sự khích lệ của các chú chim én, cậu đã nhìn thấy cả bầu trời.", "courage", "🎈", 4, 4, "completed", 100, 15, 5.0, { isFavorite: true, isBedtime: true }],
  ["s_011", "Bữa Tiệc Rừng Xanh Biết Ơn", "Các bạn thú cùng chuẩn bị quà cảm ơn mẹ thiên nhiên và gửi gắm những lời tri ân chân thành.", "gratitude", "🦊", 3, 3, "completed", 100, 12, 4.8],
  ["s_012", "Chú Mèo Mướp Biết Chờ Tới Lượt", "Mèo Mướp học cách xếp hàng chờ tới lượt chơi cầu trượt mà không chen lấn các bạn.", "patience", "🐱", 2, 2, "completed", 100, 7, 4.6, { ageGroup: "2-3" }],
  ["s_013", "Voi Con Và Chiếc Vòi Giúp Đỡ", "Voi con dùng chiếc vòi dài của mình để tưới nước cho khu vườn của bà Thỏ đang bị hạn.", "sharing", "🐘", 3, 3, "completed", 100, 11, 4.7, { isBedtime: true }],
  ["s_014", "Hươu Cao Cổ Không Còn Ngại Ngùng", "Hươu Cao Cổ vượt qua nỗi ngại ngùng để hát trong buổi văn nghệ của khu rừng.", "courage", "🦒", 4, 4, "completed", 100, 13, 4.9, { isFavorite: true }],
  ["s_015", "Cún Con Nói Lời Cảm Ơn", "Cún con học cách nói lời cảm ơn thật to với những người đã giúp đỡ mình.", "gratitude", "🐶", 2, 2, "completed", 100, 6, 4.8, { isBedtime: true, ageGroup: "2-3" }],
  ["s_016", "Ong Nhỏ Chăm Chỉ", "Ong nhỏ không ngại vất vả, bay qua từng bông hoa để làm nên hũ mật ngọt đầu tiên.", "perseverance", "🐝", 5, 5, "completed", 100, 18, 4.7, { ageGroup: "7-9" }],
  ["s_017", "Chim Cánh Cụt Tìm Bạn", "Chim cánh cụt lạc đàn cùng các bạn hải cẩu phối hợp tìm đường về nhà.", "cooperation", "🐧", 3, 3, "completed", 100, 12, 4.8, { isBedtime: true }],
  ["s_018", "Nàng Mây Buồn Biết Khóc", "Khi buồn, nàng Mây học cách gọi tên cảm xúc và để những giọt mưa nhẹ nhàng rơi xuống.", "emotion", "☁️", 3, 3, "completed", 100, 9, 5.0, { isFavorite: true, isBedtime: true }],
  ["s_019", "Sư Tử Con Biết Lắng Nghe", "Sư tử con nhận ra rằng lắng nghe bạn bè cũng quan trọng như tiếng gầm thật to.", "emotion", "🦁", 4, 4, "completed", 100, 17, 4.6, { ageGroup: "7-9" }],
  ["s_020", "Ếch Xanh Và Chiếc Lá Sen", "Ếch xanh kiên nhẫn chờ chiếc lá sen trôi lại gần để cùng các bạn qua hồ.", "patience", "🐸", 2, 2, "completed", 100, 8, 4.5, { isBedtime: true, ageGroup: "2-3" }],
  ["s_021", "Công Chúa Trăng Và Những Vì Sao", "Công chúa Trăng kể cho các vì sao nghe về tình yêu thương của gia đình trước khi đi ngủ.", "family", "👸", 3, 3, "completed", 100, 14, 5.0, { isFavorite: true, isBedtime: true }],
  ["s_022", "Chú Khỉ Nhỏ Trả Lại Chuối", "Khỉ nhỏ nhặt được nải chuối của bác Voi và quyết định mang trả dù rất thèm.", "honesty", "🐵", 4, 4, "completed", 100, 16, 4.7, { ageGroup: "7-9" }],
  ["s_023", "Kỳ Lân Cầu Vồng Giúp Bạn", "Kỳ Lân chia sẻ sắc màu cầu vồng của mình để khu rừng xám xịt bừng sáng trở lại.", "sharing", "🦄", 4, 4, "completed", 100, 13, 4.9, { isFavorite: true }],
  ["s_024", "Nhím Con Học Cách Xin Phép", "Nhím con học cách hỏi xin phép trước khi mượn đồ chơi của các bạn.", "honesty", "🦔", 2, 2, "completed", 100, 9, 4.6],
];

export const mockLibrary = rows.map(
  ([id, title, description, topic, coverEmoji, chapter, totalChapters, status, progress, minutes, rating, extra = {}], i) => ({
    id,
    title,
    description,
    topic,
    chapter,
    totalChapters,
    status,
    progress,
    minutes,
    rating,
    cover: null,
    coverEmoji,
    coverGradient: gradients[i % gradients.length],
    audio: "ai",
    isBedtime: false,
    isFavorite: false,
    isNew: false,
    ageGroup: "4-6",
    lastReadAt: null,
    // thứ tự "gần đây": phần tử đầu mảng là mới nhất
    updatedAt: new Date(Date.UTC(2026, 8, 24) - i * 86400000).toISOString(),
    ...extra,
  }),
);
