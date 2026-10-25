import LegalPage from "../../components/legal/LegalPage";

// Chính sách bảo mật — mô tả đúng cách hệ thống xử lý dữ liệu (rev8). Đổi luồng dữ liệu thì sửa ở đây.
const SECTIONS = [
  {
    title: "Ai dùng StoryWeaver và chúng tôi xử lý dữ liệu của ai",
    body: [
      "Tài khoản chỉ dành cho người lớn (phụ huynh, người giám hộ). Trẻ không tự tạo tài khoản; bé dùng Chế độ Trẻ Em (Kid Mode) bên trong tài khoản của ba mẹ và chỉ thoát ra được bằng mã PIN của ba mẹ.",
      "Vì vậy dữ liệu về bé luôn do ba mẹ cung cấp và quản lý. Ba mẹ đồng ý với chính sách này thay cho bé.",
    ],
  },
  {
    title: "Dữ liệu chúng tôi thu thập",
    body: [
      [
        "Tài khoản phụ huynh: email, tên đăng nhập, họ tên, số điện thoại (không bắt buộc). Mật khẩu và mã PIN chỉ lưu dạng băm (bcrypt), không ai đọc được.",
        "Hồ sơ bé: tên gọi, ngày sinh (để gợi ý nội dung theo độ tuổi), giọng đọc ưa thích.",
        "Nhân vật gia đình: tên gọi và mô tả bằng chữ (ngoại hình, tính cách). Chúng tôi không yêu cầu và không lưu ảnh, giọng nói hay dữ liệu khuôn mặt của bé.",
        "Nội dung truyện: tình huống ba mẹ kể, các trang truyện, câu hỏi và các chỉnh sửa.",
        "Hoạt động đọc của bé: lượt đọc, trang đang đọc, câu trả lời ở các điểm dừng — dùng để tính Báo cáo EQ.",
        "Giao dịch: gói đã mua, đơn hàng, trạng thái thanh toán do đối tác thanh toán gửi về (kể cả thông tin tài khoản người chuyển khoản, chỉ dùng khi cần hoàn tiền).",
        "Người bán: biệt danh công khai, giới thiệu, tài khoản ngân hàng nhận tiền — số tài khoản được mã hoá (AES-256-GCM) khi lưu và chỉ hiện dạng che.",
        "Báo cáo vi phạm, đánh giá truyện, và nhật ký thao tác của kiểm duyệt viên / quản trị viên.",
      ],
    ],
  },
  {
    title: "Chúng tôi dùng dữ liệu để làm gì",
    body: [
      [
        "Tạo và hiển thị truyện cho gia đình, đọc giọng kể truyện, chạy Chế độ Trẻ Em.",
        "Tính Báo cáo EQ (chỉ từ câu trả lời ở lượt đọc đầu tiên của mỗi truyện) và gợi ý hoạt động cho ba mẹ.",
        "Cấp credit theo gói, xử lý thanh toán, hoàn tiền và chi trả doanh thu cho người bán.",
        "Kiểm duyệt nội dung, xử lý báo cáo vi phạm và giữ an toàn cho trẻ.",
      ],
      "Chúng tôi không bán dữ liệu, không hiển thị quảng cáo và không dùng dữ liệu của bé để quảng cáo.",
    ],
  },
  {
    title: "AI và tên thật của bé",
    body: [
      "Khi ba mẹ nhờ AI viết truyện, tên của bé và người thân được thay bằng mã (ví dụ {NV1}) trước khi gửi đi; mô tả nhân vật cũng được lọc tên. Hệ thống kiểm tra lại và từ chối gửi nếu còn sót tên thật.",
      "Tên thật chỉ được ghép lại trên máy chủ của chúng tôi: khi hiển thị cho gia đình và khi đọc giọng kể truyện. Giọng đọc được tạo trên máy chủ của hệ thống, không gửi cho dịch vụ giọng đọc bên ngoài.",
      "Chữ do AI viết đi qua bộ lọc từ khoá do kiểm duyệt viên quản lý, và chỉ đến với bé sau khi ba mẹ xem lại và bấm hoàn tất.",
    ],
  },
  {
    title: "Khi ba mẹ đăng bán truyện",
    body: [
      "Bản đăng bán là một bản sao riêng: tên thật của gia đình được thay bằng tên chung do ba mẹ đặt, tình huống thật ba mẹ kể không đi theo bản bán, và hệ thống kiểm tra tên còn sót trước khi gửi duyệt. Nếu truyện có giọng đọc, giọng đọc được tạo lại bằng tên chung.",
      "Người mua chỉ thấy biệt danh người bán, không thấy tên thật hay email của ba mẹ.",
    ],
  },
  {
    title: "Dịch vụ bên thứ ba",
    body: [
      [
        "Anthropic (Claude): viết chữ truyện — chỉ nhận nội dung đã thay tên bằng mã.",
        "Cloudinary: lưu file giọng đọc ở chế độ có xác thực; đường dẫn được ký, không công khai.",
        "Đối tác thanh toán (payOS): xử lý thanh toán bằng chuyển khoản / VietQR.",
        "Brevo: gửi email xác thực tài khoản và mã khôi phục mật khẩu.",
      ],
      "Các dịch vụ này chỉ nhận phần dữ liệu cần cho việc của họ.",
    ],
  },
  {
    title: "Lưu trữ và bảo mật",
    body: [
      "Dữ liệu được truyền qua kết nối mã hoá. Mật khẩu, mã PIN lưu dạng băm; số tài khoản ngân hàng lưu dạng mã hoá. Sổ cái credit và doanh thu chỉ ghi thêm, không sửa xoá, để đối soát được.",
      "Truyện, nhân vật, hồ sơ bé bị xoá sẽ không còn hiển thị; một số bản ghi giao dịch được giữ lại theo yêu cầu kế toán và đối soát.",
    ],
  },
  {
    title: "Quyền của ba mẹ",
    body: [
      [
        "Xem, sửa hoặc xoá hồ sơ bé, nhân vật gia đình và truyện bất cứ lúc nào trong ứng dụng.",
        "Bật / tắt giọng đọc cho từng truyện; quyết định truyện nào được đưa lên giá sách của bé.",
        "Yêu cầu xoá tài khoản hoặc xuất dữ liệu bằng cách liên hệ nhóm phát triển.",
      ],
    ],
  },
  {
    title: "Thay đổi chính sách",
    body: ["Khi chính sách thay đổi, chúng tôi cập nhật phiên bản và ngày hiệu lực ở đầu trang, và thông báo trong ứng dụng nếu thay đổi ảnh hưởng đến cách dùng dữ liệu của bé."],
  },
];

function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Chính sách bảo mật"
      intro="StoryWeaver AI làm truyện cho trẻ nhỏ, nên chúng tôi thu thập ít nhất có thể và giữ tên thật của gia đình ở lại trong hệ thống. Trang này nói rõ chúng tôi lưu gì, dùng vào việc gì và chia sẻ với ai."
      sections={SECTIONS}
    />
  );
}

export default PrivacyPolicyPage;
