// Tài khoản demo cho giai đoạn mock — BE sẽ thay bằng xác thực thật.
// Mật khẩu chỉ tồn tại trong mock, không bao giờ lưu mật khẩu ở FE khi có API thật.

export const MOCK_ACCOUNTS = [
  {
    email: "me.lanhuong@storyweaver.vn",
    phone: "0901234567",
    password: "123456",
    user: { id: "p_001", name: "Mẹ Lan Hương", role: "parent", avatar: "https://i.pravatar.cc/100?img=47" },
  },
  {
    email: "kdv@storyweaver.vn",
    phone: "0907654321",
    password: "123456",
    user: { id: "mod_01", name: "Hoàng Minh", role: "moderator", avatar: "https://i.pravatar.cc/100?img=12" },
  },
  {
    email: "admin@storyweaver.vn",
    phone: "0909999999",
    password: "123456",
    user: { id: "admin_01", name: "Hoàng Minh", role: "admin", avatar: "https://i.pravatar.cc/100?img=12" },
  },
];

export const DEMO_ACCOUNT_LABELS = { parent: "Phụ huynh", moderator: "Kiểm duyệt viên", admin: "Admin" };
