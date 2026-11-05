// Bộ dịch lỗi BE → tiếng Việt.
// BE còn nhiều message tiếng Anh (lỗi validate của zod, lỗi auth, lỗi Prisma…) và getErrorMessage hiện thẳng message đó lên giao diện.
// Mỗi nhóm lỗi là một file riêng: { messages: { "<message BE>": "<tiếng Việt>" }, patterns?: [[/regex/, (match) => "…"]] }
// Message lạ hoặc BE đã trả tiếng Việt → giữ nguyên.
import system from "./system";
import database from "./database";
import session from "./session";
import access from "./access";
import zod from "./zod";
import auth from "./auth";
import kid from "./kid";

const GROUPS = [system, database, session, access, zod, auth, kid];

const MESSAGES = Object.assign({}, ...GROUPS.map((group) => group.messages ?? {}));
const PATTERNS = GROUPS.flatMap((group) => group.patterns ?? []);

/** Đổi message của BE sang tiếng Việt nếu có trong bảng dịch, không thì trả lại nguyên văn. */
export const translateErrorMessage = (message) => {
  if (typeof message !== "string") return message;
  const text = message.trim();
  if (Object.hasOwn(MESSAGES, text)) return MESSAGES[text];
  for (const [pattern, toVi] of PATTERNS) {
    const match = text.match(pattern);
    if (match) return typeof toVi === "function" ? toVi(match) : toVi;
  }
  return message;
};
