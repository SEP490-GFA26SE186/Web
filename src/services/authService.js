import api, { getErrorMessage } from "./api";
import useAuthStore from "../stores/authStore";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Khớp auth.validation.js của BE
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,50}$/;
export const MIN_REGISTER_PASSWORD = 8;

/** BE cho đăng nhập bằng email hoặc username */
export const isValidIdentity = (value) => EMAIL_REGEX.test(value) || USERNAME_REGEX.test(value);

// BE trả message tiếng Anh → dịch các lỗi auth hay gặp cho ba mẹ dễ hiểu
const VI_MESSAGES = {
  "Invalid email/username or password": "Email/Tên đăng nhập hoặc mật khẩu chưa đúng",
  "Your account has been deactivated. Please contact support.": "Tài khoản đã bị khóa, ba mẹ liên hệ hỗ trợ nhé",
  "Email is already registered": "Email này đã được đăng ký, ba mẹ đăng nhập nhé",
  "Username is already taken": "Tên đăng nhập đã có người dùng",
  "Invalid email address": "Email chưa đúng định dạng",
  "Username must be at least 3 characters": "Tên đăng nhập có ít nhất 3 ký tự",
  "Username can only contain letters, numbers, and underscores": "Tên đăng nhập chỉ gồm chữ không dấu, số và dấu _",
  "Password must be at least 8 characters": "Mật khẩu có ít nhất 8 ký tự",
  "New password must be at least 8 characters": "Mật khẩu mới có ít nhất 8 ký tự",
  // Xác thực email
  "Email is already verified": "Email này đã được xác thực rồi",
  "Invalid or already used verification token": "Mã xác thực không đúng hoặc đã được dùng",
  "Email verification token has expired. Please request a new one.": "Mã xác thực đã hết hạn, ba mẹ bấm gửi lại mã nhé",
  // PIN thoát Kid Mode
  "Current PIN is incorrect": "Mã PIN hiện tại chưa đúng",
  "Account password is incorrect": "Mật khẩu tài khoản chưa đúng",
  "Kid Exit PIN is already set. Use change-pin endpoint to change it.": "Tài khoản đã có mã PIN, ba mẹ dùng chức năng đổi PIN nhé",
  "Kid Exit PIN has not been set yet. Please set it first.": "Tài khoản chưa có mã PIN, ba mẹ đặt PIN trước nhé",
};

const toAuthError = (error) => new Error(VI_MESSAGES[getErrorMessage(error)] ?? getErrorMessage(error));

// Các API chỉ trả { message } — gọi và đổi lỗi sang tiếng Việt
const postAuth = async (method, url, body) => {
  try {
    const { data } = await api[method](url, body);
    return data;
  } catch (error) {
    throw toAuthError(error);
  }
};

/** POST /auth/login → { user, tokens: { accessToken, refreshToken, expiresIn } } */
export const login = async (emailOrUsername, password) => {
  try {
    const { data } = await api.post("/auth/login", { emailOrUsername, password });
    return data.data;
  } catch (error) {
    throw toAuthError(error);
  }
};

/** POST /auth/register → { user, tokens }. BE luôn tạo tài khoản vai trò parent */
export const register = async ({ username, email, password, fullName, phone }) => {
  try {
    const { data } = await api.post("/auth/register", {
      username,
      email,
      password,
      // BE: field optional → không gửi chuỗi rỗng
      ...(fullName ? { fullName } : {}),
      ...(phone ? { phone } : {}),
    });
    return data.data;
  } catch (error) {
    throw toAuthError(error);
  }
};

/** GET /auth/me → user (kèm hasKidPin, wallet) */
export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data.data.user;
};

/** POST /auth/logout: thu hồi refresh token. Lỗi mạng cũng không chặn việc đăng xuất ở FE */
export const logout = async () => {
  const { refreshToken, logout: clearSession } = useAuthStore.getState();
  try {
    if (refreshToken) await api.post("/auth/logout", { refreshToken });
  } catch {
    // token đã hết hạn / bị thu hồi → coi như đã đăng xuất
  } finally {
    clearSession();
  }
};

// ---- Mật khẩu ----

/**
 * POST /auth/forgot-password { email } — BE gửi mã khôi phục (hạn 1 giờ) qua email.
 * Luôn trả thành công kể cả khi email không tồn tại (tránh dò email đã đăng ký).
 */
export const requestPasswordReset = (email) => postAuth("post", "/auth/forgot-password", { email });

/** POST /auth/reset-password { token, newPassword } — BE thu hồi mọi phiên đăng nhập sau khi đặt lại */
export const resetPassword = ({ token, newPassword }) => postAuth("post", "/auth/reset-password", { token, newPassword });

/** PUT /auth/change-password { currentPassword, newPassword } — cần đăng nhập */
export const changePassword = ({ currentPassword, newPassword }) =>
  postAuth("put", "/auth/change-password", { currentPassword, newPassword });

// ---- Xác thực email (BE gửi mã token qua email, người dùng dán vào form) ----

/** POST /auth/send-verification-email { email } — gửi lại mã, mã cũ hết hiệu lực */
export const sendVerificationEmail = (email) => postAuth("post", "/auth/send-verification-email", { email });

/** POST /auth/verify-email { token } → data: { id, username, email, emailVerifiedAt } */
export const verifyEmail = async (token) => (await postAuth("post", "/auth/verify-email", { token })).data;

// ---- Mã PIN thoát Kid Mode (users.kid_exit_pin_hash) — 4–6 chữ số ----

/** POST /auth/kid-pin/set { pin } — chỉ dùng khi tài khoản chưa có PIN */
export const setKidPin = (pin) => postAuth("post", "/auth/kid-pin/set", { pin });

/** PUT /auth/kid-pin/change { newPin, currentPin } hoặc { newPin, password } khi quên PIN cũ */
export const changeKidPin = ({ newPin, currentPin, password }) =>
  postAuth("put", "/auth/kid-pin/change", { newPin, ...(currentPin ? { currentPin } : { password }) });

// ---- Chưa có API ở BE → vẫn dùng mock ----

/** Đăng ký nhanh từ Landing page: gửi link kích hoạt tới email phụ huynh */
export const requestSignup = async (email) => {
  await delay(700);
  if (!EMAIL_REGEX.test(email)) throw new Error("Email chưa đúng định dạng");
  if (email.toLowerCase().endsWith("@test.com")) throw new Error("Email này đã được đăng ký, ba mẹ đăng nhập nhé");
  return { email, sent: true };
};
