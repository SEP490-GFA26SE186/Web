// Mock data cho Chế độ Trẻ Em — trình đọc truyện tương tác.
// segments: đoạn văn cho karaoke. style: "normal" | "sfx" (từ tượng thanh) | "quote" (lời thoại)
// hotspots: điểm chạm trên tranh (x, y tính theo % khung tranh)
// variants: nội dung thay đổi theo lựa chọn của bé ở điểm rẽ trước đó (key = id lựa chọn)

export const MOCK_PARENT_PIN = "1234"; // chỉ dùng cho mock — BE sẽ xác thực PIN thật

export const mockKidStory = {
  id: "s_101",
  title: "Tập 1: Bạn Khủng Long Roco",
  caselFocus: "CASEL: Làm dịu cơn nóng giận",
  narrator: "Chị Hướng Dương ấm áp",
  badge: { emoji: "🫧", name: "Huy hiệu Bình Tĩnh" },
  pages: [
    {
      number: 1,
      scene: ["🦖", "🏰", "🌳"],
      gradient: "from-emerald-300 via-lime-200 to-amber-100",
      segments: [{ text: "Ở khu rừng Xanh Mướt có một chú khủng long nhỏ tên là Roco. Roco rất thích xây lâu đài cát bên bờ suối." }],
      tip: "Con có thích xây lâu đài cát giống Roco không?",
      hotspots: [
        { id: "castle", emoji: "🏰", label: "Lâu đài cát", x: 62, y: 45, tone: "primary", message: "Lâu đài của Roco có ba tòa tháp thật cao đó!" },
      ],
    },
    {
      number: 2,
      scene: ["🐿️", "💥", "🏰"],
      gradient: "from-amber-300 via-orange-200 to-rose-100",
      segments: [
        { text: "Bỗng nhiên, bạn Sóc chạy vội qua và..." },
        { text: "Rầm! 💥", style: "sfx" },
        { text: "Tòa tháp cát cao nhất đổ sập mất rồi." },
      ],
      tip: "Khi đồ chơi bị hỏng, mình thấy buồn là chuyện bình thường nhé.",
      hotspots: [
        { id: "squirrel", emoji: "🐿️", label: "Bạn Sóc", x: 40, y: 50, tone: "primary", message: "Sóc nhỏ không cố ý đâu, bạn ấy đang vội đi tìm mẹ." },
      ],
    },
    {
      number: 3,
      scene: ["🦖", "🔥"],
      gradient: "from-orange-300 via-red-200 to-amber-100",
      segments: [{ text: "Roco thấy trong ngực nóng bừng lên như có một đốm lửa nhỏ. Đó là cơn giận đang lớn dần." }],
      tip: "Khi giận, cơ thể mình thường nóng lên. Con đã từng thấy vậy chưa?",
      hotspots: [
        { id: "fire", emoji: "🔥", label: "Đốm lửa", x: 58, y: 38, tone: "primary", message: "Đốm lửa này là cơn giận. Mình sẽ cùng Roco làm nó dịu lại nhé!" },
      ],
    },
    {
      number: 4,
      scene: ["🦖", "💨"],
      gradient: "from-slate-300 via-sky-200 to-indigo-100",
      segments: [
        { text: "Roco muốn hét thật to và giậm chân thật mạnh." },
        { text: "Grừ! Grừ!", style: "sfx" },
        { text: "Nhưng rồi Roco nhớ ra một điều..." },
      ],
      tip: "Giậm chân có thể làm bạn khác sợ đấy.",
      hotspots: [],
    },
    {
      number: 5,
      scene: ["🦖", "💭", "🤱"],
      gradient: "from-teal-300 via-cyan-200 to-sky-100",
      segments: [
        { text: "Mẹ Roco thường dặn:" },
        { text: "“Khi giận, con hãy dừng lại và đếm một, hai, ba nhé.”", style: "quote" },
        { text: "Roco nhắm mắt lại và bắt đầu đếm." },
      ],
      tip: "Con thử đếm một, hai, ba cùng Roco nào!",
      hotspots: [
        { id: "mom", emoji: "🤱", label: "Lời mẹ dặn", x: 66, y: 40, tone: "secondary", message: "Một... hai... ba... Giỏi lắm!" },
      ],
    },
    {
      number: 6,
      scene: ["🦖", "🐿️", "🍃"],
      gradient: "from-lime-300 via-emerald-200 to-teal-100",
      segments: [
        { text: "Roco hít một hơi thật sâu..." },
        { text: "Phùuu! 💨", style: "sfx" },
        { text: "Cơn nóng trong bụng dần tan biến như bong bóng xà phòng. Chú Sóc nhỏ mỉm cười đưa cho Roco một chiếc lá thần kỳ và thì thầm:" },
        { text: "“Cậu làm tốt lắm! Bây giờ, cậu muốn làm gì tiếp theo?”", style: "quote" },
      ],
      tip: "Hít thở chậm giúp nhịp tim đập êm và đầu óc sáng suốt hơn đó!",
      hotspots: [
        { id: "squirrel", emoji: "🐿️", label: "Chạm vào chú Sóc", x: 58, y: 50, tone: "primary", bounce: true, message: "🐿️ Sóc nhỏ vẫy đuôi: “Cố lên Roco, cậu là chú khủng long dũng cảm nhất!”" },
        { id: "leaf", emoji: "✨", label: "Chiếc lá phát sáng!", x: 22, y: 82, tone: "secondary", message: "✨ Chiếc lá phát ra ánh sáng lung linh xua tan mọi âu lo!" },
      ],
      decision: {
        question: "Bé {name} ơi, con sẽ khuyên bạn Roco làm gì nào?",
        hint: "Con hãy chọn 1 cách giải quyết thật thông minh nhé:",
        choices: [
          {
            id: "a", emoji: "🌰", tone: "secondary", skill: "Kỹ năng quan hệ", skillIcon: "groups", stars: 1,
            title: "Cùng Sóc nhặt hạt dẻ và xây lại tháp cát mới",
            desc: "Roco rủ bạn chơi lại từ đầu trong vui vẻ và sẻ chia.",
            feedback: "Roco và Sóc đã nhặt hạt dẻ cùng nhau! Hai bạn đang rất vui và xây được một ngọn tháp cát còn to hơn trước!",
          },
          {
            id: "b", emoji: "🎨", tone: "primary", skill: "Tự quản lý cảm xúc", skillIcon: "spa", stars: 1,
            title: "Ngồi dưới bóng cây hít thở sâu và vẽ tranh cảm xúc",
            desc: "Roco dành thêm thời gian yên tĩnh để tâm trạng hoàn toàn thư thái.",
            feedback: "Roco hít thở sâu và vẽ một bức tranh cầu vồng rực rỡ! Cơn tức giận đã tan biến hoàn toàn rồi!",
          },
        ],
      },
    },
    {
      number: 7,
      scene: ["🦖", "🐿️", "🏖️"],
      gradient: "from-amber-300 via-yellow-200 to-orange-100",
      segments: [{ text: "Roco cảm thấy nhẹ nhõm hơn rất nhiều." }],
      tip: "Mỗi cách bình tĩnh đều rất tuyệt vời!",
      hotspots: [],
      variants: {
        a: {
          scene: ["🦖", "🐿️", "🏰"],
          segments: [
            { text: "Roco và Sóc cùng nhau nhặt thật nhiều hạt dẻ và vỏ sò." },
            { text: "Hì hục! Hì hục!", style: "sfx" },
            { text: "Chẳng mấy chốc, một tòa lâu đài mới còn to và đẹp hơn trước đã hiện ra." },
          ],
          tip: "Cùng nhau làm việc giúp mọi thứ trở nên vui hơn!",
          hotspots: [{ id: "castle2", emoji: "🏰", label: "Lâu đài mới", x: 64, y: 42, tone: "secondary", message: "Lâu đài mới có cửa sổ bằng vỏ sò lấp lánh!" }],
        },
        b: {
          scene: ["🦖", "🎨", "🌈"],
          segments: [
            { text: "Roco ngồi dưới gốc cây, hít thở thật chậm rồi vẽ một cầu vồng thật to." },
            { text: "Xoẹt! Xoẹt!", style: "sfx" },
            { text: "Mỗi màu sắc là một cảm xúc, và giờ Roco thấy thật bình yên." },
          ],
          tip: "Vẽ tranh cũng là một cách tuyệt vời để kể về cảm xúc của mình.",
          hotspots: [{ id: "rainbow", emoji: "🌈", label: "Cầu vồng", x: 60, y: 35, tone: "primary", message: "Màu đỏ là lúc giận, màu xanh là lúc bình tĩnh đó!" }],
        },
      },
    },
    {
      number: 8,
      isEnding: true,
      scene: ["🦖", "🌙", "⭐"],
      gradient: "from-indigo-300 via-violet-200 to-pink-100",
      segments: [
        { text: "Tối hôm đó, Roco kể cho mẹ nghe mọi chuyện. Mẹ ôm Roco thật chặt và thì thầm:" },
        { text: "“Mẹ tự hào vì con đã biết dừng lại và nói ra cảm xúc.”", style: "quote" },
        { text: "Chúc bé ngủ ngon nhé!" },
      ],
      tip: "Hôm nay con đã học cách làm dịu cơn giận giống Roco. Giỏi quá!",
      hotspots: [{ id: "moon", emoji: "🌙", label: "Ông Trăng", x: 70, y: 25, tone: "secondary", message: "Ông Trăng chúc bé có giấc mơ thật đẹp!" }],
    },
  ],
};

// Tiến độ đọc đã lưu của bé (bé đang ở trang 6, chưa chọn ở điểm rẽ)
export const mockKidProgress = {
  s_101: { currentPage: 6, choices: {}, starsEarned: 0, completed: false },
};
