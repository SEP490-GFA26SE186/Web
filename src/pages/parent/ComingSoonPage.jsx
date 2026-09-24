import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { ROUTES } from "../../constants/routes";

function ComingSoonPage({ title }) {
  return (
    <div className="card mx-auto mt-10 flex max-w-lg flex-col items-center p-10 text-center">
      <img src={logo} alt="" className="h-28 w-28 rounded-full shadow-glow" />
      <h1 className="mt-6 text-2xl">{title}</h1>
      <p className="mt-2 text-navy/60">Cú Weaver đang dệt nốt trang này, ba mẹ quay lại sau nhé! ✨</p>
      <Link to={ROUTES.PARENT.DASHBOARD} className="btn-primary mt-6">
        Về trang Tổng quan
      </Link>
    </div>
  );
}

export default ComingSoonPage;
