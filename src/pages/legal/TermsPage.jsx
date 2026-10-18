import LegalPage from "../../components/legal/LegalPage";
import { POLICY_NUMBERS as N } from "../../constants/legal";

const vnd = (n) => `${n.toLocaleString("vi-VN")}đ`;

// Điều khoản dịch vụ — các con số lấy từ cấu hình mặc định (constants/legal.js).
const SECTIONS = [
  {
    title: "Tài khoản",
    body: [
      "Người tạo tài khoản phải là người lớn và chịu trách nhiệm cho việc trẻ sử dụng Chế độ Trẻ Em. Ba mẹ giữ bí mật mật khẩu và mã PIN thoát Chế độ Trẻ Em.",
      "Tài khoản vi phạm điều khoản có thể bị tạm khoá. Quyền dùng AI có thể bị tạm khoá riêng nếu nhiều lần yêu cầu nội dung bị chặn; khi đó ba mẹ vẫn đọc và tự viết truyện được.",
    ],
  },
  {
    title: "Gói dịch vụ và credit",
    body: [
      [
        "Credit dùng cho các lần AI viết truyện; số credit cho mỗi lần do hệ thống công bố trước khi bắt đầu. Lần viết lỗi được hoàn credit.",
        "Mỗi gói cấp credit theo từng tháng. Credit chưa dùng hết hạn khi sang tháng mới, không quy đổi thành tiền và không mua lẻ.",
        "Gói trả trước, gia hạn thủ công; đổi gói giữa kỳ thì kỳ mới bắt đầu ngay và credit còn lại được giữ một lần.",
        "Thanh toán qua payOS (chuyển khoản / VietQR). Truyện tự viết không tốn credit.",
      ],
    ],
  },
  {
    title: "Nội dung do AI hỗ trợ",
    body: [
      "AI có thể viết chưa đúng ý hoặc chưa phù hợp với từng bé. Ba mẹ có trách nhiệm đọc lại và chỉnh sửa trước khi bấm hoàn tất; chỉ truyện đã hoàn tất mới lên giá sách của bé.",
      "Không yêu cầu AI viết nội dung bạo lực, đáng sợ, phân biệt đối xử hoặc chứa thông tin cá nhân của người khác. Hệ thống tự chặn các từ khoá không phù hợp.",
    ],
  },
  {
    title: "Quyền đối với truyện",
    body: [
      "Truyện ba mẹ viết (kể cả có AI hỗ trợ) thuộc về ba mẹ. Ba mẹ cho phép StoryWeaver lưu trữ, hiển thị và đọc giọng truyện để cung cấp dịch vụ cho gia đình.",
      "Khi đăng bán, ba mẹ cho phép StoryWeaver hiển thị bản đăng bán trên Chợ truyện và cung cấp cho người mua đọc trong gia đình họ.",
    ],
  },
  {
    title: "Đăng bán trên Chợ truyện",
    body: [
      [
        "Cần gói có quyền bán (gói Gia đình) và hồ sơ người bán được kiểm duyệt viên duyệt.",
        "Bản đăng bán dùng tên chung thay cho tên thật của gia đình. Kiểm duyệt viên đọc 100% số trang theo checklist sư phạm trước khi truyện lên Chợ; truyện có giọng đọc chỉ được duyệt khi giọng đọc đã tạo xong.",
        `Người bán nhận ${N.sellerSharePercent}% giá niêm yết của mỗi lượt bán. Doanh thu được giữ ${N.earningHoldDays} ngày (để xử lý hoàn tiền) rồi mới rút được; mức rút tối thiểu ${vnd(N.minWithdrawalVnd)}. Tiền được chi về tài khoản ngân hàng của người bán qua payOS sau khi quản trị viên duyệt.`,
        "Giá chọn theo các bậc giá do nền tảng quy định.",
      ],
    ],
  },
  {
    title: "Mua truyện và hoàn tiền",
    body: [
      "Mua truyện là mua quyền đọc trong gia đình: truyện được đưa lên giá sách của các bé trong tài khoản. Không sao chép, phát tán lại nội dung truyện.",
      `Ba mẹ có thể yêu cầu hoàn tiền trong ${N.refundWindowDays} ngày kể từ lúc thanh toán, ở mục Lịch sử thanh toán. Khi được duyệt, tiền được chuyển trả vào tài khoản đã thanh toán và quyền đọc truyện (hoặc gói) bị thu hồi.`,
      "Truyện bị tạm gỡ để kiểm tra lại sẽ tạm không đọc được cho đến khi có quyết định.",
    ],
  },
  {
    title: "Đánh giá và báo cáo",
    body: [
      "Chỉ ba mẹ đã mua truyện và có bé đã đọc hết truyện mới đánh giá được. Đánh giá vi phạm quy định cộng đồng có thể bị ẩn.",
      `Ba mẹ có thể báo cáo truyện hoặc đánh giá không phù hợp. Khi đủ ${N.reportThreshold} phụ huynh khác nhau báo cáo một truyện trong 24 giờ, truyện tự tạm gỡ để kiểm duyệt viên xem lại.`,
    ],
  },
  {
    title: "Cảnh cáo người bán và kháng nghị",
    body: [
      `Vi phạm (truyện bị gỡ hẳn, vi phạm nghiêm trọng khi duyệt, báo cáo đúng) có thể bị cảnh cáo. Mỗi cảnh cáo có hiệu lực ${N.strikeValidDays} ngày; đủ ${N.strikeLimit} cảnh cáo còn hiệu lực thì tài khoản bán bị khoá và truyện tạm ẩn khỏi Chợ. Doanh thu đã có vẫn rút được.`,
      "Người bán được kháng nghị mỗi cảnh cáo một lần; quản trị viên (không phải người ra cảnh cáo) xem xét. Kháng nghị được chấp thuận thì cảnh cáo được gỡ.",
    ],
  },
  {
    title: "Giới hạn trách nhiệm",
    body: [
      "StoryWeaver là sản phẩm của đồ án SEP490 đang ở giai đoạn thử nghiệm. Dịch vụ được cung cấp theo hiện trạng; chúng tôi cố gắng giữ dịch vụ ổn định nhưng có thể gián đoạn khi bảo trì hoặc khi dịch vụ bên thứ ba gặp sự cố.",
      "Báo cáo EQ là công cụ tham khảo giúp ba mẹ đồng hành cùng con, không thay thế đánh giá của chuyên gia tâm lý hay giáo dục.",
    ],
  },
  {
    title: "Thay đổi điều khoản",
    body: ["Khi điều khoản thay đổi, chúng tôi cập nhật phiên bản và ngày hiệu lực ở đầu trang. Tiếp tục sử dụng dịch vụ sau ngày hiệu lực nghĩa là ba mẹ đồng ý với điều khoản mới."],
  },
];

function TermsPage() {
  return (
    <LegalPage
      title="Điều khoản dịch vụ"
      intro="Các điều khoản dưới đây áp dụng khi ba mẹ dùng StoryWeaver AI để tạo truyện cho con, mua hoặc đăng bán truyện trên Chợ truyện."
      sections={SECTIONS}
    />
  );
}

export default TermsPage;
