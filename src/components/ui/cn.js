/** Ghép className, bỏ giá trị rỗng / false. */
export const cn = (...parts) => parts.filter(Boolean).join(" ");
