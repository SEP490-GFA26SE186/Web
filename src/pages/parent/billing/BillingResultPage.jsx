import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { ROUTES } from "../../../constants/routes";
import { useOrder } from "../../../hooks/useBilling";
import { formatNumber } from "../../../utils/format";

const VIEWS = {
  paid: {
    icon: <CheckCircle2 size={48} className="text-secondary" />,
    title: "Thanh toán thành công",
    text: "Gói mới đã được kích hoạt và credit đã được cộng vào ví.",
  },
  pending: {
    icon: <Clock size={48} className="text-primary" />,
    title: "Đang chờ xác nhận thanh toán",
    text: "Nếu ba mẹ đã chuyển khoản, hệ thống sẽ xác nhận trong ít phút. Có thể để trang này mở.",
  },
  cancelled: {
    icon: <XCircle size={48} className="text-danger" />,
    title: "Đã huỷ thanh toán",
    text: "Gói hiện tại không thay đổi. Ba mẹ có thể thử lại bất cứ lúc nào.",
  },
  closed: {
    icon: <XCircle size={48} className="text-danger" />,
    title: "Đơn đã hết hạn",
    text: "Gói hiện tại không thay đổi. Ba mẹ có thể thử lại bất cứ lúc nào.",
  },
};

// payOS trả người dùng về đây (returnUrl / cancelUrl). Trạng thái thật lấy từ BE (BE tự hỏi payOS),
// không tin tham số trên URL.
function BillingResultPage() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const { data: order, isLoading, error } = useOrder(orderId);
  const view = order ? VIEWS[order.status] ?? VIEWS.closed : null;

  return (
    <div className="card mx-auto mt-10 max-w-md space-y-4 p-8 text-center">
      {isLoading && <Loader2 size={40} className="mx-auto animate-spin text-primary" />}
      {error && <p className="text-danger">{error.message}</p>}
      {view && (
        <>
          <div className="flex justify-center">{view.icon}</div>
          <h1 className="text-2xl">{view.title}</h1>
          <p className="text-navy/65">{view.text}</p>
          <p className="text-sm text-navy/50">
            {order.items?.[0]?.plan?.name} • {formatNumber(order.totalVnd)}đ
          </p>
        </>
      )}
      <Link to={ROUTES.PARENT.BILLING} className="btn-primary justify-center">
        Về trang Gói dịch vụ
      </Link>
    </div>
  );
}

export default BillingResultPage;
