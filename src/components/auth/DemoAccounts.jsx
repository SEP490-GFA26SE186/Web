import { FlaskConical } from "lucide-react";
import { DEMO_ACCOUNT_LABELS, MOCK_ACCOUNTS } from "../../mocks/auth";

// Chỉ dùng khi dev (được import động sau điều kiện import.meta.env.DEV nên không lọt vào bản build production)
function DemoAccounts({ onPick }) {
  return (
    <details className="mt-6 rounded-2xl bg-surface p-3 text-sm">
      <summary className="flex cursor-pointer items-center gap-1.5 font-semibold text-navy/70">
        <FlaskConical size={16} /> Tài khoản demo (chỉ hiện khi dev)
      </summary>
      <div className="mt-2 flex flex-col gap-1.5">
        {MOCK_ACCOUNTS.map((a) => (
          <button
            key={a.email}
            type="button"
            onClick={() => onPick(a.email, a.password)}
            className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-left hover:bg-outline/50"
          >
            <span className="font-semibold">{DEMO_ACCOUNT_LABELS[a.user.role]}</span>
            <span className="truncate text-xs text-navy/60">{a.email}</span>
          </button>
        ))}
        <p className="text-xs text-navy/50">Mật khẩu chung: 123456 • Có thể đăng nhập bằng SĐT, VD: 0901234567</p>
      </div>
    </details>
  );
}

export default DemoAccounts;
