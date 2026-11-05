import api, { getErrorMessage } from "./api";
import useAuthStore from "../stores/authStore";


export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Khớp auth.validation.js của BE
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,50}$/;
export const MIN_REGISTER_PASSWORD = 8;

/** BE cho đăng nhập bằng email hoặc username */
export const isValidIdentity = (value) => EMAIL_REGEX.test(value) || USERNAME_REGEX.test(value);

// BE trả message tiếng Anh → dịch các lỗi auth hay gặp cho ba mẹ dễ hiểu
// (lỗi đăng nhập / đăng ký, validate form và mã PIN đã chuyển sang services/errorMessages)
const VI_MESSAGES = {
  // Xác thực email (BE đã trả tiếng Việt, chỉ chỉnh giọng cho ba mẹ)
  "Email đã được xác thực": "Email này đã được xác thực rồi",
  "Mã xác thực không hợp lệ hoặc đã được sử dụng": "Mã xác thực không đúng hoặc đã được dùng",
  "Mã xác thực đã hết hạn. Vui lòng yêu cầu gửi lại mã.": "Mã xác thực đã hết hạn, ba mẹ bấm gửi lại mã nhé",
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

/**
 * POST /auth/send-verification-email (cần đăng nhập, không body) — gửi mã tới email của chính tài khoản,
 * mã cũ hết hiệu lực → data: { retryAfterSeconds }.
 * Gửi lại trong vòng 60 giây từ mã gần nhất → 429; lỗi ném ra kèm `retryAfterSeconds` để đếm ngược.
 */
export const sendVerificationEmail = async () => {
  try {
    const { data } = await api.post("/auth/send-verification-email");
    return data.data;
  } catch (error) {
    const authError = toAuthError(error);
    const retryAfterSeconds = error.response?.data?.errors?.[0]?.retryAfterSeconds;
    if (error.response?.status === 429 && retryAfterSeconds) authError.retryAfterSeconds = retryAfterSeconds;
    throw authError;
  }
};

/** POST /auth/verify-email { token } (cần đăng nhập; mã phải thuộc tài khoản đang đăng nhập) → data: { id, username, email, emailVerifiedAt } */
export const verifyEmail = async (token) => (await postAuth("post", "/auth/verify-email", { token })).data;

// ---- Mã PIN thoát Kid Mode (users.kid_exit_pin_hash) — 4–6 chữ số ----

/** POST /auth/kid-pin/set { pin } — chỉ dùng khi tài khoản chưa có PIN */
export const setKidPin = (pin) => postAuth("post", "/auth/kid-pin/set", { pin });

/** PUT /auth/kid-pin/change { newPin, currentPin } hoặc { newPin, password } khi quên PIN cũ */
export const changeKidPin = ({ newPin, currentPin, password }) =>
  postAuth("put", "/auth/kid-pin/change", { newPin, ...(currentPin ? { currentPin } : { password }) });

// ---- Chưa có API ở BE → vẫn dùng mock ----

