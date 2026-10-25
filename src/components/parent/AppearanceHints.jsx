import { AlertTriangle, Lightbulb } from "lucide-react";

/**
 * Chi tiết hay làm bộ lọc ảnh của nhà cung cấp chặn chân dung (credit hoàn lại nhưng phụ huynh mất công chờ).
 * Chỉ nhắc, không chặn: bộ lọc là của nhà cung cấp, danh sách này không đầy đủ.
 */
const RISKS = [
  {
    terms: ["siêu nhân", "siêu anh hùng", "người nhện", "spider", "spiderman", "batman", "superman", "ultraman", "elsa", "anna", "doraemon", "nobita", "pikachu", "pokemon", "mickey", "naruto", "sonic", "mario", "barbie", "hello kitty", "công chúa disney"],
    tip: "Nhân vật hoạt hình / siêu anh hùng có bản quyền dễ bị chặn — tả trang phục thay vì gọi tên, ví dụ “áo choàng đỏ, bộ đồ xanh có ngôi sao”.",
  },
  {
    terms: ["súng", "kiếm", "dao", "gươm", "bom", "máu", "đánh nhau", "chiến đấu"],
    tip: "Vũ khí, máu, đánh nhau thường bị chặn — bỏ khỏi mô tả ngoại hình.",
  },
  {
    terms: ["cởi trần", "đồ bơi", "áo tắm", "bikini", "đồ lót", "khỏa thân", "hở"],
    tip: "Trang phục hở dễ bị chặn với ảnh trẻ em — chọn trang phục kín như áo thun, váy, đồ ngủ.",
  },
  {
    terms: ["ốm", "gầy", "gầy gò", "béo", "mập"],
    tip: "Nên tả dáng người nhẹ nhàng như “dáng cao, mảnh khảnh”, “tròn trịa” — “ốm” AI có thể hiểu là bị bệnh.",
  },
];

const hasTerm = (text, term) => new RegExp(String.raw`(^|[^\p{L}])${term}($|[^\p{L}])`, "iu").test(text);

const appearanceRisks = (text) => {
  const t = (text ?? "").normalize("NFC").toLowerCase();
  return t.trim() ? RISKS.filter((r) => r.terms.some((term) => hasTerm(t, term))).map((r) => r.tip) : [];
};

/** Gợi ý dưới ô mô tả ngoại hình (dùng để vẽ chân dung) + cảnh báo khi gõ chi tiết dễ bị chặn. */
function AppearanceHints({ value }) {
  const risks = appearanceRisks(value);
  return (
    <div className="mt-1.5 space-y-1.5 text-xs">
      <p className="flex gap-1.5 text-navy/55">
        <Lightbulb size={14} className="mt-px shrink-0 text-primary" />
        <span>
          Tả những gì nhìn thấy: tóc, màu da, dáng người, trang phục, phụ kiện. Ví dụ: “tóc đen xoăn ngắn, dáng cao mảnh khảnh, mặc áo choàng đỏ và bộ đồ
          xanh có ngôi sao”. Không cần ghi tên thật.
        </span>
      </p>
      {risks.map((tip) => (
        <p key={tip} className="flex gap-1.5 rounded-xl bg-amber-50 px-2.5 py-1.5 font-semibold text-amber-800">
          <AlertTriangle size={14} className="mt-px shrink-0" /> {tip}
        </p>
      ))}
    </div>
  );
}

export default AppearanceHints;
