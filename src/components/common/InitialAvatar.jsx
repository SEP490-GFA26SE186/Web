// BE không lưu ảnh đại diện người dùng (không cho upload ảnh) → hiển thị chữ cái đầu của tên
function InitialAvatar({ name = "", className = "h-9 w-9 text-sm" }) {
  const initial = name.trim().split(/\s+/).pop()?.[0]?.toUpperCase() ?? "?";
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-primary-tint font-display font-bold text-primary-dark ${className}`}
    >
      {initial}
    </span>
  );
}

export default InitialAvatar;
