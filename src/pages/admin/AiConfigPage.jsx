import { Cpu } from "lucide-react";
import SettingsGroup from "../../components/admin/SettingsGroup";
import { PageHeader } from "../../components/admin/AdminUi";

// Cấu hình AI: giá credit cho mỗi lần AI viết truyện.
// Nhà cung cấp / khoá API cấu hình trong biến môi trường của dịch vụ ai/ (không lưu trong DB, không sửa trên web).
function AiConfigPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Cấu hình AI" description="Credit là đơn vị phụ huynh dùng; mỗi gói cấp credit hằng tháng." />
      <section className="card space-y-3 p-5">
        <h2 className="flex items-center gap-2 text-lg">
          <Cpu size={20} className="text-primary" /> Giá & quy đổi
        </h2>
        <SettingsGroup group="ai" />
      </section>
      <section className="card space-y-2 p-5 text-sm text-navy/70">
        <h2 className="text-lg text-navy">Nhà cung cấp</h2>
        <p>
          Chữ do dịch vụ <b>ai/</b> sinh (Claude), giọng đọc do VieNeu TTS chạy cục bộ. Chọn nhà cung cấp và khoá API nằm trong biến môi trường của dịch vụ ai/ —
          không lưu trong cơ sở dữ liệu nên không sửa ở đây, tránh lộ khoá qua giao diện web.
        </p>
        <p>Lớp an toàn: từ khoá chặn do Kiểm duyệt viên quản lý áp dụng cho cả chữ AI viết và chữ phụ huynh tự viết.</p>
      </section>
    </div>
  );
}

export default AiConfigPage;
