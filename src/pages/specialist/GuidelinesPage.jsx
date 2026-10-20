import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ClipboardList, Loader2 } from "lucide-react";
import api from "../../services/api";

const RULES = [
  "Nhận bài trước khi duyệt — bài được giữ cho bạn 30 phút, người khác không nhận trùng được.",
  "Xem đủ 100% số trang (bấm “Đánh dấu đã xem” từng trang) và tick đạt đủ checklist mới bấm Duyệt được.",
  "Truyện có giọng đọc chỉ nhận duyệt khi giọng đọc đã tạo xong — nghe thử các trang trong lúc duyệt.",
  "Yêu cầu sửa / Từ chối / Gỡ hẳn: bắt buộc ghi nhận xét — người bán đọc được nhận xét này.",
  "Từ chối vì vi phạm nghiêm trọng, cố ý: tick “cảnh cáo tác giả”. Gỡ hẳn truyện đã bán tự cảnh cáo.",
  "Hậu kiểm (báo cáo, kiểm tra ngẫu nhiên): “Giữ truyện” để bán tiếp, “Gỡ hẳn” khi vi phạm thật.",
  "Bản đăng bán dùng tên chung; nếu còn thấy tên thật / chi tiết nhận dạng gia đình, chọn Yêu cầu sửa.",
];

// Quy chuẩn kiểm duyệt: checklist sư phạm (checklist_items, đang dùng khi duyệt) + quy tắc của không gian duyệt.
function GuidelinesPage() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["specialist", "checklist-items"],
    queryFn: async () => (await api.get("/checklist-items", { params: { isActive: true } })).data.data,
  });
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
          <ClipboardList size={16} /> Kiểm duyệt
        </p>
        <h1 className="text-3xl">Quy chuẩn kiểm duyệt</h1>
        <p className="mt-1 max-w-2xl text-navy/70">Checklist sư phạm áp dụng cho mọi lượt duyệt, và các quy tắc khi ra quyết định.</p>
      </div>
      <section className="card space-y-3 p-6">
        <h2 className="text-lg">Checklist sư phạm ({items.length} mục)</h2>
        {isLoading && <Loader2 size={22} className="animate-spin text-primary" />}
        <ol className="space-y-2">
          {items.map((it, i) => (
            <li key={it.id} className="flex gap-3 rounded-2xl bg-surface p-3 text-sm">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-white">{i + 1}</span>
              {it.description}
            </li>
          ))}
        </ol>
      </section>
      <section className="card space-y-3 p-6">
        <h2 className="text-lg">Quy tắc khi duyệt</h2>
        <ul className="space-y-2">
          {RULES.map((r) => (
            <li key={r} className="flex gap-2 text-sm text-navy/80">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-secondary" /> {r}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default GuidelinesPage;
