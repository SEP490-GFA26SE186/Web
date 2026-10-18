import { useState } from "react";
import { Loader2, Lock, Plus, Search, Unlock } from "lucide-react";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import { LoadState, PageHeader, Tabs } from "../../components/admin/AdminUi";
import { fieldClass, formatDateTime } from "../../components/admin/adminFormat";
import useDebounce from "../../hooks/useDebounce";
import { useAccounts, useCreateModerator, useSetAccountActive } from "../../hooks/useAdmin";
import useAuthStore from "../../stores/authStore";
import { toast } from "../../stores/toastStore";

const ROLES = [
  { value: "all", label: "Tất cả" },
  { value: "parent", label: "Phụ huynh" },
  { value: "moderator", label: "Kiểm duyệt viên" },
  { value: "admin", label: "Admin" },
];
const ROLE_LABEL = { parent: "Phụ huynh", moderator: "Kiểm duyệt viên", admin: "Admin" };
const STATUS = [
  { value: "all", label: "Mọi trạng thái" },
  { value: "active", label: "Đang hoạt động" },
  { value: "locked", label: "Đã khoá" },
];

function CreateModeratorModal({ onClose }) {
  const [form, setForm] = useState({ email: "", username: "", fullName: "", password: "" });
  const create = useCreateModerator();
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    create.mutate(form, {
      onSuccess: () => {
        toast.success("Đã tạo tài khoản Kiểm duyệt viên");
        onClose();
      },
      onError: (err) => toast.error(err.message),
    });
  };
  return (
    <Modal
      open
      onClose={onClose}
      title="Tạo tài khoản Kiểm duyệt viên"
      description="Gửi email + mật khẩu tạm cho người được giao; họ nên đổi mật khẩu sau lần đăng nhập đầu."
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">Hủy</button>
          <button type="submit" form="mod-form" disabled={create.isPending} className="btn-primary py-2.5 text-sm">
            {create.isPending && <Loader2 size={16} className="animate-spin" />} Tạo tài khoản
          </button>
        </>
      }
    >
      <form id="mod-form" onSubmit={submit} className="space-y-3">
        {[
          ["fullName", "Họ tên", "text"],
          ["email", "Email", "email"],
          ["username", "Tên đăng nhập", "text"],
          ["password", "Mật khẩu tạm (tối thiểu 8 ký tự)", "password"],
        ].map(([k, label, type]) => (
          <label key={k} className="block">
            <span className="mb-1 block text-sm font-semibold">{label}</span>
            <input type={type} required value={form[k]} onChange={set(k)} minLength={k === "password" ? 8 : undefined} className={fieldClass} autoComplete="off" />
          </label>
        ))}
      </form>
    </Modal>
  );
}

// Tài khoản: tìm kiếm, khoá / mở khoá (khoá → đăng xuất ngay, mọi request bị chặn), tạo Kiểm duyệt viên.
function AccountsPage() {
  const me = useAuthStore((s) => s.user);
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);
  const debounced = useDebounce(search);
  const params = { role, status, search: debounced, page };
  const { data, isLoading, isFetching, error } = useAccounts(params);
  const toggle = useSetAccountActive();
  const rows = data?.accounts ?? [];

  const change = (fn) => (v) => {
    fn(v);
    setPage(1);
  };
  const setActive = (u) =>
    toggle.mutate(
      { userId: u.id, isActive: !u.isActive },
      { onSuccess: () => toast.success(u.isActive ? `Đã khoá ${u.email}` : `Đã mở khoá ${u.email}`), onError: (e) => toast.error(e.message) },
    );

  return (
    <div className="space-y-5">
      <PageHeader title="Tài khoản" description="Phụ huynh tự đăng ký; Kiểm duyệt viên do Admin tạo. Khoá tài khoản sẽ đăng xuất người đó ngay.">
        <button type="button" onClick={() => setCreating(true)} className="btn-primary">
          <Plus size={18} /> Kiểm duyệt viên
        </button>
      </PageHeader>
      <div className="card flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-navy/40" />
          <input type="search" value={search} onChange={(e) => change(setSearch)(e.target.value)} placeholder="Tìm email, tên đăng nhập, họ tên..." className={`${fieldClass} rounded-full pl-11`} />
        </label>
        <Tabs value={role} onChange={change(setRole)} items={ROLES} label="Vai trò" />
        <select value={status} onChange={(e) => change(setStatus)(e.target.value)} className={`${fieldClass} cursor-pointer rounded-full lg:w-48`}>
          {STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <section className={`card overflow-x-auto transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
        <LoadState isLoading={isLoading} error={error} empty={!rows.length} emptyText="Không có tài khoản phù hợp." />
        {rows.length > 0 && (
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-outline text-left text-xs text-navy/60">
              <tr>
                <th className="px-5 py-3">Tài khoản</th>
                <th>Vai trò</th>
                <th>Gói / credit</th>
                <th>Người bán</th>
                <th>Đăng nhập gần nhất</th>
                <th className="pr-5 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {rows.map((u) => (
                <tr key={u.id} className={u.isActive ? "" : "bg-danger-tint/40"}>
                  <td className="px-5 py-3">
                    <p className="font-bold">{u.fullName || u.username}</p>
                    <p className="text-xs text-navy/55">{u.email} • @{u.username}</p>
                  </td>
                  <td>{ROLE_LABEL[u.role]}</td>
                  <td>{u.role === "parent" ? `${u.plan?.name ?? "—"} • ${u.creditBalance ?? 0} credit • ${u.childrenCount} bé` : "—"}</td>
                  <td>{u.seller ? `${u.seller.displayName} (${u.seller.status})` : "—"}</td>
                  <td>{formatDateTime(u.lastLoginAt)}</td>
                  <td className="pr-5 text-right">
                    {u.id === me?.id ? (
                      <span className="text-xs text-navy/50">Bạn</span>
                    ) : (
                      <button
                        type="button"
                        disabled={(toggle.isPending && toggle.variables?.userId === u.id) || (u.role === "admin" && u.isActive)}
                        onClick={() => setActive(u)}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold disabled:opacity-40 ${u.isActive ? "bg-surface text-navy hover:bg-danger-tint hover:text-danger" : "bg-danger text-white"}`}
                        title={u.role === "admin" ? "Không khoá Admin ở đây" : undefined}
                      >
                        {u.isActive ? <><Lock size={13} /> Khoá</> : <><Unlock size={13} /> Mở khoá</>}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      {data?.pagination.totalPages > 1 && <Pagination page={page} totalPages={data.pagination.totalPages} onChange={setPage} />}
      {creating && <CreateModeratorModal onClose={() => setCreating(false)} />}
    </div>
  );
}

export default AccountsPage;
