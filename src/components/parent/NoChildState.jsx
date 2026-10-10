import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { ROUTES } from "../../constants/routes";

// Phụ huynh chưa tạo hồ sơ bé nào → các màn phụ thuộc bé hiện lời mời tạo hồ sơ thay vì skeleton mãi
function NoChildState() {
  return (
    <div className="card mx-auto mt-12 max-w-lg p-8 text-center">
      <p className="text-5xl">🌱</p>
      <h2 className="mt-3 text-2xl">Chưa có hồ sơ bé nào</h2>
      <p className="mt-2 text-navy/70">
        Ba mẹ tạo hồ sơ cho bé để StoryWeaver gợi ý truyện, theo dõi thời gian đọc và hành trình EQ riêng cho bé nhé.
      </p>
      <Link to={ROUTES.PARENT.CHILDREN} className="btn-primary mt-5 inline-flex">
        <PlusCircle size={20} /> Tạo hồ sơ bé
      </Link>
    </div>
  );
}

export default NoChildState;
