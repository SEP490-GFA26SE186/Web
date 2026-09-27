import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

// Trang tạm cho các mục chưa làm — dùng chung cho cả cổng Phụ huynh, Kiểm duyệt và Admin
function ComingSoonPage({ title }) {
  const { pathname } = useLocation();
  const segment = `/${pathname.split("/")[1]}`;
  // Trong cổng (parent/moderator/admin/kid) → về trang Tổng quan của cổng; trang công khai → về trang chủ
  const portalRoot = ["/parent", "/moderator", "/admin", "/kid"].includes(segment) ? segment : "/";
  const isParent = segment === "/parent";

  return (
    <div className="card mx-auto mt-10 flex max-w-lg flex-col items-center p-10 text-center">
      <img src={logo} alt="" className="h-28 w-28 rounded-full shadow-glow" />
      <h1 className="mt-6 text-2xl">{title}</h1>
      <p className="mt-2 text-navy/60">
        {isParent
          ? "Cú Weaver đang dệt nốt trang này, ba mẹ quay lại sau nhé! ✨"
          : "Màn hình này đang được phát triển và sẽ sớm ra mắt."}
      </p>
      <Link to={portalRoot} className="btn-primary mt-6">
        {portalRoot === "/" ? "Về trang chủ" : "Về trang Tổng quan"}
      </Link>
    </div>
  );
}

export default ComingSoonPage;
