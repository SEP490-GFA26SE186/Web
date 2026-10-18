import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { ROUTES } from "../../../constants/routes";
import { useOrder } from "../../../hooks/useBilling";
import { formatNumber } from "../../../utils/format";

// payOS trả người dùng về đây sau khi mua truyện. Trạng thái thật lấy từ BE (BE tự hỏi payOS).
function PurchaseResultPage() {
  const [params] = useSearchParams();
  const { data: order, isLoading, error } = useOrder(params.get("orderId"));
  const queryClient = useQueryClient();
  const listing = order?.items?.[0]?.listing;

  useEffect(() => {
    if (order?.status === "paid") queryClient.invalidateQueries({ queryKey: ["marketplace"] });
  }, [order?.status, queryClient]);

  const view = !order
    ? null
    : order.status === "paid"
      ? { icon: <CheckCircle2 size={48} className="text-secondary" />, title: "Mua truyện thành công", text: "Truyện đã thuộc về ba mẹ. Đưa lên giá sách để bé đọc nhé." }
      : order.status === "pending"
        ? { icon: <Clock size={48} className="text-primary" />, title: "Đang chờ xác nhận thanh toán", text: "Nếu ba mẹ đã chuyển khoản, hệ thống sẽ xác nhận trong ít phút." }
        : { icon: <XCircle size={48} className="text-danger" />, title: order.status === "cancelled" ? "Đã huỷ thanh toán" : "Đơn đã hết hạn", text: "Ba mẹ có thể mua lại bất cứ lúc nào." };

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
            {listing?.title} • {formatNumber(order.totalVnd)}đ
          </p>
        </>
      )}
      <Link to={listing ? ROUTES.PARENT.marketplaceListing(listing.id) : ROUTES.PARENT.MARKETPLACE} className="btn-primary justify-center">
        {order?.status === "paid" ? "Đưa lên giá sách cho bé" : "Về Chợ truyện"}
      </Link>
    </div>
  );
}

export default PurchaseResultPage;
